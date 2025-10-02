// components/wallet/ConnectButton.tsx
'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { WalletStatus } from './WalletStatus'

export function WalletConnectButton() {
  const { address } = useAccount()

  return (
    <div className="flex items-center gap-3">
      {address ? (
        <WalletStatus />
      ) : (
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openConnectModal,
            mounted
          }) => {
            return (
              <div
                {...(!mounted && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }
                })}
              >
                {(() => {
                  if (!mounted || !account || !chain) {
                    return (
                      <button
                        onClick={openConnectModal}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Connect Wallet
                      </button>
                    )
                  }

                  return (
                    <button
                      onClick={openAccountModal}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-mono text-sm">
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </span>
                    </button>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      )}
    </div>
  )
}