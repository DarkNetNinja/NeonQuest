import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Initialize a server-side Supabase client with the service role key for admin updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const text = await req.text()
    const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!)
    const digest = hmac.update(text).digest('hex')
    const signature = req.headers.get('x-signature')

    // Verify webhook signature for security
    if (signature !== digest) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(text)
    const eventName = payload.meta.event_name
    
    // Check if the order was successfully paid
    if (eventName === 'order_created') {
      const customData = payload.meta.custom_data
      const userId = customData?.user_id

      if (userId) {
        // Update user profile to Pro status in Supabase
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