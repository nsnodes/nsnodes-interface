/**
 * Webhook Dispatcher
 *
 * Dispatches webhook events to registered subscribers when resources change.
 * Uses HMAC signatures for payload verification.
 */

import { createHmac } from 'crypto'
import { createServerClient } from '@/lib/supabase/server'

export interface WebhookPayload {
  event: 'created' | 'updated' | 'deleted'
  resource_type: 'societies' | 'events' | 'popups'
  data: Record<string, unknown>
  timestamp: string
}

interface WebhookSubscription {
  id: string
  callback_url: string
  secret: string
  event_types: string[]
}

/**
 * Generate HMAC signature for webhook payload
 */
function generateSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

/**
 * Send webhook to a single subscriber
 */
async function sendWebhook(
  subscription: WebhookSubscription,
  payload: WebhookPayload
): Promise<{ success: boolean; status?: number; error?: string }> {
  const payloadString = JSON.stringify(payload)
  const signature = generateSignature(payloadString, subscription.secret)

  try {
    const response = await fetch(subscription.callback_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': payload.timestamp,
      },
      body: payloadString,
      // 10 second timeout
      signal: AbortSignal.timeout(10000),
    })

    return {
      success: response.ok,
      status: response.status,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Log webhook delivery attempt
 */
async function logDelivery(
  subscriptionId: string,
  payload: WebhookPayload,
  result: { success: boolean; status?: number; error?: string }
): Promise<void> {
  try {
    const supabase = createServerClient()

    await supabase.from('webhook_deliveries').insert({
      subscription_id: subscriptionId,
      payload,
      response_status: result.status || null,
      success: result.success,
      error_message: result.error || null,
    })
  } catch (error) {
    console.error('Failed to log webhook delivery:', error)
  }
}

/**
 * Dispatch webhook to all active subscribers for a resource type and event
 */
export async function dispatchWebhook(
  resourceType: WebhookPayload['resource_type'],
  event: WebhookPayload['event'],
  data: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = createServerClient()

    // Find active subscriptions for this resource type and event
    const { data: subscriptions, error } = await supabase
      .from('webhook_subscriptions')
      .select('id, callback_url, secret, event_types')
      .eq('resource_type', resourceType)
      .eq('is_active', true)
      .contains('event_types', [event])

    if (error) {
      console.error('Error fetching webhook subscriptions:', error)
      return
    }

    if (!subscriptions || subscriptions.length === 0) {
      return
    }

    const payload: WebhookPayload = {
      event,
      resource_type: resourceType,
      data,
      timestamp: new Date().toISOString(),
    }

    // Send webhooks in parallel
    const deliveryPromises = subscriptions.map(async (subscription) => {
      const result = await sendWebhook(subscription, payload)
      await logDelivery(subscription.id, payload, result)

      if (!result.success) {
        console.warn(
          `Webhook delivery failed for subscription ${subscription.id}: ${result.error || `HTTP ${result.status}`}`
        )
      }
    })

    await Promise.all(deliveryPromises)
  } catch (error) {
    console.error('Error dispatching webhooks:', error)
  }
}

/**
 * Dispatch webhooks for multiple items (bulk operation)
 * Used after sync operations to notify about all changes
 */
export async function dispatchBulkWebhook(
  resourceType: WebhookPayload['resource_type'],
  event: WebhookPayload['event'],
  items: Record<string, unknown>[]
): Promise<void> {
  // For bulk operations, we dispatch a single webhook with all items
  await dispatchWebhook(resourceType, event, { items, count: items.length })
}
