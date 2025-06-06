'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const changeNameSchema = z.object({
  name: z.string().min(1, 'O nome deve ter pelo menos 1 caractere'),
})

type ChangeNameSchema = z.infer<typeof changeNameSchema>

export default async function changeName(data: ChangeNameSchema) {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    return {
      data: null,
      error: 'Usuário não autenticado',
    }
  }

  const parsedData = changeNameSchema.safeParse(data)

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
        name: parsedData.data.name,
      },
    })

    return {
      data: user.name,
      error: null,
    }
  } catch (error) {
    console.log('Error updating name:', error)

    return {
      data: null,
      error: 'Erro ao atualizar o nome',
    }
  }
}
