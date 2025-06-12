'use server'

import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const createPaymentSchema = z.object({
  slug: z.string().min(1, { message: 'Slug é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  message: z
    .string({ message: 'Mensagem é obrigatória' })
    .min(5, { message: 'Mensagem deve ter pelo menos 5 caracteres' }),
  price: z.number().min(1500, { message: 'Preço mínimo é de R$15,00' }),
  creatorId: z.string(),
})

type CreatePaymentSchema = z.infer<typeof createPaymentSchema>

export async function createPayment(data: CreatePaymentSchema) {
  const parsedData = createPaymentSchema.safeParse(data)

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0].message,
    }
  }

  if (!parsedData.data.creatorId) {
    return {
      error: 'Criador não encontrado',
    }
  }

  try {
    const creator = await prisma.user.findFirst({
      where: {
        connectedStripeAccountId: parsedData.data.creatorId,
      },
    })

    if (!creator) {
      return {
        error: 'Erro ao criar pagamento, tente mais tarde',
      }
    }

    const applicationFee = Math.round(parsedData.data.price * 0.1) // 10% fee
    const donation = await prisma.donations.create({
      data: {
        donorName: parsedData.data.name,
        donorMessage: parsedData.data.message,
        userId: creator.id,
        status: 'PENDING',
        amount: parsedData.data.price - applicationFee, // Amount after fee
      },
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.HOST_URL}/creator/${parsedData.data.slug}`,
      cancel_url: `${process.env.HOST_URL}/creator/${parsedData.data.slug}`,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Apoiar ' + creator.name,
            },
            unit_amount: parsedData.data.price,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: creator.connectedStripeAccountId as string,
        },
        metadata: {
          donorName: parsedData.data.name,
          donorMessage: parsedData.data.message,
          donationId: donation.id,
        },
      },
    })

    return {
      sessionId: session.id,
    }
  } catch (error) {
    console.log('Error creating payment:', error)
    return {
      data: null,
      error: 'Erro ao criar pagamento, tente mais tarde',
    }
  }
}
