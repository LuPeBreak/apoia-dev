'use server'

import prisma from '@/lib/prisma'

export async function getCreatorDonations(userId: string) {
  if (!userId) {
    return {
      error: 'Usuário não autenticado',
    }
  }

  try {
    const donations = await prisma.donations.findMany({
      where: {
        userId,
        status: 'PAID',
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        amount: true,
        donorName: true,
        donorMessage: true,
        createdAt: true,
      },
    })

    return {
      donations,
    }
  } catch (error) {
    console.error('Erro ao obter doações:', error)
    return {
      error: 'Erro ao obter doações',
    }
  }
}
