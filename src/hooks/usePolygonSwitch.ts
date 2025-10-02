// hooks/usePolygonSwitch.ts
'use client'

import { useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { polygonChain } from '@/lib/wagmi'

export function useAutoSwitchToPolygon() {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (chain && chain.id !== polygonChain.id) {
      console.log('Switching to Polygon...')
      switchChain({ chainId: polygonChain.id })
    }
  }, [chain, switchChain])
}