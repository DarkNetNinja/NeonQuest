import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// 1. Force dynamic execution so Next.js does not analyze this during build time ⚡
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // 2. Safely guard against missing keys at runtime 🛡️
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const text = await req.text()
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || ''
    const hmac = crypto.createHmac('sha256', secret)
    const digest = hmac.update(text).digest('hex')
    const signature = req.headers.get('x-signature')

    if (signature !== digest) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(text)
    const eventName = payload.meta.event_name
    
    if (eventName === 'order_created') {
      const customData = payload.meta.custom_data
      const userId = customData?.user_id

      if (userId) {
        await supabaseAdmin
          .from('profiles')
          .update({ is_pro: true })
          .eq('id', userId)
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}