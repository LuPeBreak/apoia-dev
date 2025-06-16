'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrencyFromCents, formatDate } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import {
  getCreatorDonations,
  type Donation,
} from '../_data_access/get-creator-donations'

export function DonationTable({ userId }: { userId: string }) {
  const {
    data: donations,
    status,
    error,
  } = useQuery<Donation[]>({
    queryKey: ['creator-donations', userId],
    queryFn: () => getCreatorDonations(userId),
    refetchInterval: 10 * 1000,
  })

  if (status === 'pending') {
    return <div>Carregando doações...</div>
  }

  if (status === 'error') {
    return <div>Ocorreu um erro: {error.message}</div>
  }

  return (
    <>
      {/* Versão para desktop */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-black">
                Nome do doador
              </TableHead>
              <TableHead className="font-semibold text-black">
                Mensagem
              </TableHead>
              <TableHead className="text-center font-semibold text-black">
                Valor
              </TableHead>
              <TableHead className="text-center font-semibold text-black">
                Data da doação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations &&
              donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {donation.donorName}
                  </TableCell>
                  <TableCell className="max-w-72">
                    {donation.donorMessage}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrencyFromCents(donation.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(donation.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Versão para mobile */}
      <div className="lg:hidden space-y-4">
        {donations &&
          donations.map((donation) => (
            <Card key={donation.id}>
              <CardHeader>
                <CardTitle className="text-lg">{donation.donorName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {donation.donorMessage}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-500 font-semibold">
                    {formatCurrencyFromCents(donation.amount)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(donation.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  )
}
