'use server'

import prisma from '@/lib/prisma'

export type Donation = {
  id: string
  amount: number
  donorName: string
  donorMessage: string
  createdAt: Date
}

export async function getCreatorDonations(userId: string): Promise<Donation[]> {
  if (!userId) {
    throw new Error('Usuário não autenticado')
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

    return donations
  } catch (error) {
    console.error('Erro ao obter doações:', error)
    throw new Error('Erro ao obter doações')
  }
}
