import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')!
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string

  let event: Stripe.Event

  try {
    const payload = await request.text()
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (error) {
    console.log('Falha ao autenticar a assinatura:', error)
    return new NextResponse('Webhook Error', { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const paymentIntentId = session.payment_intent as string

      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId)

      const donorName = paymentIntent.metadata.donorName
      const donorMessage = paymentIntent.metadata.donorMessage
      const donationId = paymentIntent.metadata.donationId

      try {
        const updatedDonation = await prisma.donations.update({
          where: { id: donationId },
          data: {
            status: 'PAID',
            donorName,
            donorMessage,
          },
        })
        console.log(`Doação atualizada: `, updatedDonation)
      } catch (error) {
        console.error('Erro ao processar o pagamento:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
      }
      break
    }
    default:
      console.log(`Evento não tratado: ${event.type}`)
      return new NextResponse('Event type not handled', { status: 400 })
  }

  return new NextResponse('Webhook received', { status: 200 })
}
