// hooks/usePolygonSwitch.ts
'use client'

import { useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { amoyChai } from '@/lib/wagmi'

export function useAutoSwitchToPolygon() {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (chain && amoyChai && chain.id !== amoyChai.id) {
      console.log('Switching to Amoy...')
      switchChain({ chainId: amoyChai.id })
    }
  }, [chain, switchChain])
}