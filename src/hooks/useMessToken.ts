'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useChainId } from 'wagmi'
import { MESS_TOKEN_ABI } from '../lib/abi'
import { CONTRACT_ADDRESSES } from '../lib/wagmi'

const MEAL_TOKEN_ID = BigInt(1)

// Hook to get contract address for current chain
export function useMessTokenAddress() {
  const chainId = useChainId()
  return CONTRACT_ADDRESSES.messToken[chainId as keyof typeof CONTRACT_ADDRESSES.messToken] || ''
}

// Hook to get user's meal token balance
export function useMealTokenBalance(address?: `0x${string}`) {
  const contractAddress = useMessTokenAddress()
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MESS_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address, MEAL_TOKEN_ID] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })
}

// Hook to get contract owner
export function useContractOwner() {
  const contractAddress = useMessTokenAddress()
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MESS_TOKEN_ABI,
    functionName: 'owner',
    query: {
      enabled: !!contractAddress,
    },
  })
}

// Hook to mint meal tokens (admin only)
export function useMintMealTokens() {
  const contractAddress = useMessTokenAddress()
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const mint = (to: `0x${string}`, amount: number) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: MESS_TOKEN_ABI,
      functionName: 'mint',
      args: [to, BigInt(amount)],
    })
  }

  return {
    mint,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

// Hook to redeem meal tokens
export function useRedeemMeal() {
  const contractAddress = useMessTokenAddress()
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const redeem = (amount: number) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: MESS_TOKEN_ABI,
      functionName: 'redeemMeal',
      args: [BigInt(amount)],
    })
  }

  return {
    redeem,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

// Hook to check if user is contract owner
export function useIsContractOwner(address?: `0x${string}`) {
  const { data: owner } = useContractOwner()
  
  return {
    isOwner: !!address && !!owner && address.toLowerCase() === owner.toLowerCase(),
    owner,
  }
}

// Hook to get token URI
export function useTokenURI() {
  const contractAddress = useMessTokenAddress()
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MESS_TOKEN_ABI,
    functionName: 'uri',
    args: [MEAL_TOKEN_ID],
    query: {
      enabled: !!contractAddress,
    },
  })
}