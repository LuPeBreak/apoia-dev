'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const changeDescriptionSchema = z.object({
  description: z.string().min(1, 'A descrição deve ter pelo menos 1 caractere'),
})

type ChangeDescriptionSchema = z.infer<typeof changeDescriptionSchema>

export default async function changeDescription(data: ChangeDescriptionSchema) {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    return {
      data: null,
      error: 'Usuário não autenticado',
    }
  }

  const parsedData = changeDescriptionSchema.safeParse(data)

  if (!parsedData.success) {
    return {
      data: null,
      error: parsedData.error.issues[0].message,
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: parsedData.data.description,
      },
    })

    return {
      data: user.bio,
      error: null,
    }
  } catch (error) {
    console.log('Error updating bio:', error)

    return {
      data: null,
      error: 'Erro ao atualizar a bio',
    }
  }
}
