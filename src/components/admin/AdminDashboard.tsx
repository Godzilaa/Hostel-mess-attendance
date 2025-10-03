import AdminPanel from './AdminPanel';
import { useAccount, useReadContract } from 'wagmi';
import { MESS_TOKEN_ABI } from '../../lib/abi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MESS_TOKEN_ADDRESS as `0x${string}`;

export default function AdminDashboard() {
  const { address } = useAccount();
  
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MESS_TOKEN_ABI,
    functionName: 'owner',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">HM</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Hostel Mess Token Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Admin Account</div>
                <div className="text-xs text-gray-500 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <div className="w-6 h-6 text-blue-600">📊</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contract Address</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {CONTRACT_ADDRESS?.slice(0, 8)}...{CONTRACT_ADDRESS?.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <div className="w-6 h-6 text-green-600">🎯</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Network</p>
                  <p className="text-lg font-semibold text-gray-900">Polygon Amoy</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <div className="w-6 h-6 text-purple-600">👑</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <p className="text-lg font-semibold text-gray-900">Contract Owner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Panel */}
          <div className="lg:col-span-2">
            <AdminPanel />
          </div>

          {/* Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Instructions</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Enter Student Address</p>
                    <p>Copy the student's wallet address from their profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Set Token Amount</p>
                    <p>Enter how many meal tokens to send (e.g., 10 for weekly allowance)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Send Tokens</p>
                    <p>Click send and confirm the transaction in your wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-orange-100 rounded-full opacity-20 blur-3xl" />
      </div>
    </div>
  );
}