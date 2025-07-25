import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export const POST = auth(async function POST(request) {
  if (!request.auth) {
    return NextResponse.json({ error: 'Usuário não autenticado' })
  }

  try {
    const account = await stripe.accounts.create({
      controller: {
        losses: {
          payments: 'application',
        },
        fees: {
          payer: 'application',
        },
        stripe_dashboard: {
          type: 'express',
        },
      },
    })

    if (!account.id) {
      return NextResponse.json(
        { error: 'Falha ao criar conta de pagamento' },
        { status: 400 },
      )
    }

    await prisma.user.update({
      where: { id: request.auth.user.id },
      data: { connectedStripeAccountId: account.id },
    })

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
      return_url: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
      type: 'account_onboarding',
    })

    return NextResponse.json(
      { url: accountLink.url },
      {
        status: 200,
      },
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Falha ao criar link de configuração' },
      { status: 400 },
    )
  }
})
