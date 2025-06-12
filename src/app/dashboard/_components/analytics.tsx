import { formatCurrencyFromCents } from '@/utils/format'
import { DollarSign, Users, Wallet } from 'lucide-react'
import { getCreatorStats } from '../_data_access/get-creator-stats'
import { StatCard } from './stats-card'

export async function Stats({
  userId,
  stripeAccountId,
}: {
  userId: string
  stripeAccountId: string
}) {
  const { balance, totalAmountDonated, totalDonations } = await getCreatorStats(
    userId,
    stripeAccountId,
  )
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
      <StatCard
        title="Apoiadores"
        description="Total de apoiadores"
        icon={<Users className="w-8 h-8 text-blue-400" />}
        value={totalDonations || 0}
      />

      <StatCard
        title="Total recebido"
        description="Quantidade total recebida"
        icon={<DollarSign className="w-8 h-8 text-amber-500" />}
        value={formatCurrencyFromCents(totalAmountDonated || 0)} // Assuming amount is in cents
      />

      <StatCard
        title="Saldo em conta"
        description="Saldo pendente"
        icon={<Wallet className="w-8 h-8 text-green-500" />}
        value={formatCurrencyFromCents(balance || 0)}
      />
    </div>
  )
}
