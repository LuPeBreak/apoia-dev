'use server'

import { stripe } from '@/lib/stripe'

export async function getOnboardAccount(accountId: string | undefined) {
  if (!accountId) {
    return null
  }

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
      return_url: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
      type: 'account_onboarding',
    })

    return accountLink.url
  } catch (error) {
    console.log(error)
    return null
  }
}
