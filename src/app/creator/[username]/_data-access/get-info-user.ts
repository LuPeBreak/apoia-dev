'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'

const getInfoUserSchema = z.object({
  username: z.string({ message: 'O nome de usuário é obrigatório' }),
})

type GetInfoUserSchema = z.infer<typeof getInfoUserSchema>

export async function getInfoUser(data: GetInfoUserSchema) {
  const parsedData = getInfoUserSchema.safeParse(data)
  if (!parsedData.success) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: parsedData.data.username },
    })

    return user
  } catch (error) {
    console.log('Error fetching user info:', error)

    return null
  }
}
