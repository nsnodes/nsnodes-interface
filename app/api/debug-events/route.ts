import { getAllEventsDebug } from '@/lib/actions/events'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await getAllEventsDebug()
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  // Return formatted JSON with proper headers
  return new NextResponse(JSON.stringify(result.data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

