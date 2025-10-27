import { getAllNetworkSchoolEvents } from '@/lib/actions/events'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (type === 'all-ns') {
    // Get all Network School events (past and future)
    const events = await getAllNetworkSchoolEvents()
    return NextResponse.json(events)
  }

  return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
}
