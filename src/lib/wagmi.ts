// lib/wagmi.ts
'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon, polygonMumbai, polygonAmoy, hardhat } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'ce8e1b1879506de55bf15bf0d0776c62'

// Contract addresses
export const CONTRACT_ADDRESSES = {
  messToken: {
    [hardhat.id]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [polygonAmoy.id]: process.env.NEXT_PUBLIC_MESS_TOKEN_ADDRESS || '',
    [polygon.id]: process.env.NEXT_PUBLIC_MESS_TOKEN_ADDRESS || '',
  }
} as const

export const config = getDefaultConfig({
  appName: 'Hostel Mess Token',
  projectId,
  chains: [hardhat, polygonAmoy, polygon, polygonMumbai],
  ssr: true,
})

export const polygonChain = polygon // Mainnet
export const mumbaiChain = polygonMumbai // Testnet (deprecated)
export const amoyChai = polygonAmoy // New testnet
export const nlocalhostChain = hardhat // Local development

