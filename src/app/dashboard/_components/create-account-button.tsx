'use client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

export function CreateAccountButton() {
  const [loading, setLoading] = useState(false)

  async function handleCreateStripeAccount() {
    setLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/stripe/create-account`,
        {
          method: 'POST',
        },
      )

      if (!response.ok) {
        toast.error('Falha ao criar conta de pagamento')
        setLoading(false)
        return
      }

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Erro ao criar conta Stripe:', error)
      setLoading(false)
    }
  }

  return (
    <div className="mb-5 ">
      <Button
        className="cursor-pointer"
        onClick={handleCreateStripeAccount}
        disabled={loading}
      >
        {loading ? 'Ativando conta...' : 'Ativar conta de pagamento'}
      </Button>
    </div>
  )
}
