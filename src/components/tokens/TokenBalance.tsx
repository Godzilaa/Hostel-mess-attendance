'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { CurrencyDollarIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useMealTokenBalance, useMintMealTokens, useRedeemMeal, useIsContractOwner } from '@/hooks/useMessToken'

interface TokenBalanceProps {
  className?: string
}

export default function TokenBalance({ className = '' }: TokenBalanceProps) {
  const { address } = useAccount()
  const [mintAmount, setMintAmount] = useState('')
  const [redeemAmount, setRedeemAmount] = useState('')
  
  // Contract hooks
  const { data: balance, isLoading: balanceLoading } = useMealTokenBalance(address)
  const { isOwner } = useIsContractOwner(address)
  const { mint, isPending: isMinting, isConfirmed: mintConfirmed } = useMintMealTokens()
  const { redeem, isPending: isRedeeming, isConfirmed: redeemConfirmed } = useRedeemMeal()

  const handleMint = () => {
    if (!address || !mintAmount) return
    const amount = parseInt(mintAmount)
    if (amount > 0) {
      mint(address, amount)
      setMintAmount('')
    }
  }

  const handleRedeem = () => {
    if (!redeemAmount) return
    const amount = parseInt(redeemAmount)
    if (amount > 0 && balance && BigInt(amount) <= balance) {
      redeem(amount)
      setRedeemAmount('')
    }
  }

  const balanceDisplay = balance ? balance.toString() : '0'

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <CurrencyDollarIcon className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meal Tokens</h3>
          <p className="text-sm text-gray-500">ERC1155 tokens for meal redemption</p>
        </div>
      </div>

      {/* Balance Display */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {balanceLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mx-auto"></div>
          ) : (
            balanceDisplay
          )}
        </div>
        <p className="text-sm text-gray-500">Available meal tokens</p>
      </div>

      {/* Transaction Status */}
      {(mintConfirmed || redeemConfirmed) && (
        <motion.div 
          className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-sm text-green-700 text-center">
            {mintConfirmed && "✅ Tokens minted successfully!"}
            {redeemConfirmed && "✅ Meal redeemed successfully!"}
          </p>
        </motion.div>
      )}

      {/* Admin Mint Section */}
      {isOwner && (
        <motion.div 
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h4 className="text-sm font-medium text-blue-900 mb-3">Admin: Mint Tokens</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <button
              onClick={handleMint}
              disabled={isMinting || !mintAmount}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              {isMinting ? 'Minting...' : 'Mint'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Redeem Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Redeem Meal</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="1"
            max={balanceDisplay}
          />
          <button
            onClick={handleRedeem}
            disabled={isRedeeming || !redeemAmount || !balance || BigInt(redeemAmount || '0') > balance}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <MinusIcon className="w-4 h-4" />
            {isRedeeming ? 'Redeeming...' : 'Redeem'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Redeem tokens to prove meal attendance on-chain
        </p>
      </div>
    </motion.div>
  )
}