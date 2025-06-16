'use server'

import { stripe } from '@/lib/stripe'

export async function GetStripeDashboard(accountId: string | undefined) {
  if (!accountId) {
    return null
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId)

    return loginLink.url
  } catch {
    return null
  }
}
