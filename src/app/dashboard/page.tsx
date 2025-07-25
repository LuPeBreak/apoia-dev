import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Stats } from './_components/analytics'
import { CreateAccountButton } from './_components/create-account-button'
import { DonationTable } from './_components/donates'
import { GetStripeDashboard } from './_data_access/get-stripe-dashboard'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/')
  }

  const urlStripeDashboard = session.user.connectedStripeAccountId
    ? await GetStripeDashboard(session.user.connectedStripeAccountId)
    : null

  return (
    <div className="p-4">
      <section className="flex items-center justify-between mb-4">
        <div className="w-full flex items-center gap-2 justify-between">
          <h1 className="text-2xl font-semibold">Minha conta</h1>

          {urlStripeDashboard && (
            <a
              href={urlStripeDashboard}
              className="bg-zinc-900 px-4 py-1 rounded-md text-white cursor-pointer"
              target="_blank"
              rel="noreferrer"
            >
              Stripe Dashboard
            </a>
          )}
        </div>
      </section>

      {!urlStripeDashboard && <CreateAccountButton />}
      {urlStripeDashboard && (
        <>
          <Stats
            userId={session.user.id}
            stripeAccountId={session.user.connectedStripeAccountId || ''}
          />

          <h2 className="text-2xl font-semibold mb-2">Últimas doações</h2>
          <DonationTable userId={session.user.id} />
        </>
      )}
    </div>
  )
}
