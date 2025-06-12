'use server'

import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function getCreatorStats(userId: string, stripeAccountId: string) {
  if (!userId) {
    return {
      error: 'Usuário não autenticado',
    }
  }

  if (!stripeAccountId) {
    return {
      error: 'Conta Stripe não conectada',
    }
  }

  try {
    const totalDonations = await prisma.donations.count({
      where: {
        userId,
        status: 'PAID',
      },
    })

    const totalAmountDonated = await prisma.donations.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
        status: 'PAID',
      },
    })

    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    })

    return {
      totalDonations,
      totalAmountDonated: totalAmountDonated._sum.amount ?? 0,
      balance: balance.pending[0]?.amount ?? 0,
    }
  } catch (error) {
    console.error('Erro ao obter doações:', error)
    return {
      error: 'Erro ao obter estatísticas',
    }
  }
}
