"use server"

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createSlug } from '@/utils/create-slug';
import { z } from 'zod';
 
const createUsernameSchema = z.object({
  username: z.string({ message: 'O username é obrigatório' }).min(4, 'O username precisa ter pelo menos 4 caracteres')
});

type CreateUsernameSchema = z.infer<typeof createUsernameSchema>;

export async function createUsernameAction(data: CreateUsernameSchema) {

  const session = await auth()
  
  if(!session?.user) {
    return { data: null, error: 'Você precisa estar logado para criar um username.' };
  }
  
  const schema = createUsernameSchema.safeParse(data);

  if (!schema.success) {
    return { data:null, error: schema.error.issues[0].message };
  }

  try {
    const slug = createSlug(schema.data.username);
    const userId = session.user.id;

    const existingUser = await prisma.user.findUnique({
      where: { username: slug }
    });
    if (existingUser) {
      return { data: null, error: 'Esse username já está em uso. Tente outro.' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { username: slug }
    });

    return { data: slug, error: null };
    
  } catch (error) {
    return { data: null, error: 'Erro ao criar o username. Tente novamente mais tarde.' };
  }
} 