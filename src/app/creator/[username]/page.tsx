import { notFound } from 'next/navigation'
import { AboutSection } from './_components/about-section'
import { CoverSection } from './_components/cover-section'
import { FormDonate } from './_components/form-donate'
import { getInfoUser } from './_data-access/get-info-user'

export default async function Apoia({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const user = await getInfoUser({ username })

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to bg-slate-100">
      <CoverSection
        coverImage={user.image ?? ''}
        profileImage={user.image ?? ''}
        name={user.name ?? 'Sem nome'}
      />

      <main className="container mx-auto max-w-6xl p-4 sm:p-6 -mt-8 md:-mt-16  relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="order-2 lg:order-1">
            <AboutSection
              name={user.name ?? 'Sem nome'}
              description={user.bio ?? 'Sem descrição'}
            />
          </div>
          <div className="order-1 lg:order-2">
            <FormDonate
              slug={user.username!}
              creatorId={user.connectedStripeAccountId ?? ''}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
