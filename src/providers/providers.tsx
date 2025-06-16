'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  // O useState garante que o QueryClient só é criado uma vez por renderização no cliente.
  const [queryClient] = useState(() => new QueryClient())

  return (
    // O SessionProvider da NextAuth
    <SessionProvider>
      {/* O Provider do TanStack Query */}
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster duration={3000} richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
