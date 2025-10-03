import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { MESS_TOKEN_ABI } from "../../lib/abi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MESS_TOKEN_ADDRESS as `0x${string}`;

export default function AdminPanel() {
  const { address } = useAccount();
  const [mintAmount, setMintAmount] = useState(1);
  const [recipient, setRecipient] = useState("");

  // Read contract owner
  const owner = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MESS_TOKEN_ABI,
    functionName: "owner",
  });

  // Mint tokens
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleMint = () => {
    if (!recipient || mintAmount <= 0) return;
    // Validate recipient address format
    const validRecipient = recipient.startsWith('0x') && recipient.length === 42 ? (recipient as `0x${string}`) : undefined;
    if (!validRecipient) return alert('Invalid recipient address');
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: MESS_TOKEN_ABI,
      functionName: "mint",
      args: [validRecipient, BigInt(mintAmount)],
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🔧 Admin Panel</h2>
        <div className="text-sm text-green-600 font-medium">Admin Access</div>
      </div>
      
      <div className="space-y-6">
        {/* Send Tokens Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">📤 Send Meal Tokens</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Wallet Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0x742d35Cc6C4C9C432CD81C9A5C2A067f5B97a52D"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Meal Tokens
              </label>
              <input
                type="number"
                min={1}
                value={mintAmount}
                onChange={e => setMintAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount (e.g., 10)"
              />
            </div>
            
            <button
              onClick={handleMint}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending || !recipient || mintAmount <= 0}
            >
              {isPending ? "Sending Tokens..." : `Send ${mintAmount} Meal Token${mintAmount > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
        
        {/* Status Messages */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-600 mr-2">✅</div>
              <div className="text-green-800 font-medium">
                Successfully sent {mintAmount} meal token{mintAmount > 1 ? 's' : ''} to student!
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-2">❌</div>
              <div className="text-red-800 font-medium">
                Error: {error.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
