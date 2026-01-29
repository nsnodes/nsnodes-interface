-- Webhook subscription tables for notifying external stakeholders
-- When societies or events are updated, registered webhooks are called

CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_hash TEXT NOT NULL,
  callback_url TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('societies', 'events', 'popups')),
  event_types TEXT[] DEFAULT ARRAY['created', 'updated', 'deleted'],
  is_active BOOLEAN DEFAULT true,
  secret TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by active subscriptions
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_active ON webhook_subscriptions(resource_type, is_active);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding recent deliveries by subscription
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_subscription ON webhook_deliveries(subscription_id, delivered_at DESC);
