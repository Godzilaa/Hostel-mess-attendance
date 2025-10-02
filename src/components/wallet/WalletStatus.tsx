'use client'

import { useAccount, useBalance } from 'wagmi'

export function WalletStatus() {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })

  return (
    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="font-mono text-sm">
        {address?.slice(0, 6)}...{address?.slice(-4)}
        {balance ? ` (${balance?.formatted} ${balance?.symbol})` : ''}
      </span>
    </button>
  )
}