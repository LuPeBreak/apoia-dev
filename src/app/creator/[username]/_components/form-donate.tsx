'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { getStripeClient } from '@/lib/stripe-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { createPayment } from '../_actions/create-payment'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  message: z.string().min(1, { message: 'Mensagem é obrigatória' }),
  amount: z.enum(['15', '25', '35'], {
    required_error: 'Valor é obrigatório',
  }),
})

type FormSchema = z.infer<typeof formSchema>

interface FormDonateProps {
  slug: string
  creatorId: string
}

export function FormDonate({ slug, creatorId }: FormDonateProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      message: '',
      amount: '15',
    },
  })

  async function onSubmit(values: FormSchema) {
    const priceInCents = Number(values.amount) * 100

    const checkout = await createPayment({
      slug,
      creatorId,
      message: values.message,
      name: values.name,
      price: priceInCents,
    })

    await handlePaymentResponse(checkout)
  }

  async function handlePaymentResponse(checkout: {
    error?: string
    sessionId?: string
  }) {
    if (checkout.error) {
      toast.error(checkout.error)
      return
    }

    if (!checkout.sessionId) {
      toast.error('Falha ao criar o pagamento, tente novamente mais tarde.')
      return
    }

    const stripe = await getStripeClient()

    if (!stripe) {
      toast.error('Falha ao criar o pagamento, tente novamente mais tarde.')
      return
    }

    await stripe.redirectToCheckout({
      sessionId: checkout.sessionId,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu nome..."
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite sua mensagem..."
                  {...field}
                  className="bg-white h-32 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex items-center gap-3"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {['15', '25', '35'].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} id={value} />
                      <Label className="text-lg" htmlFor={value}>
                        R${value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? 'Processando...' : 'Doar'}
        </Button>
      </form>
    </Form>
  )
}
