import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface Transaction {
  id: string;
  type: "booking" | "sale" | "commission" | "withdrawal" | "refund";
  description: string;
  amount: number;
  date: Date;
  status: "completed" | "pending" | "failed";
  icon: string;
}

interface WalletStats {
  totalBalance: number;
  totalEarnings: number;
  totalCommissions: number;
  pendingBalance: number;
  monthlyEarnings: number;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "booking",
    description: "Consultation - Dr. Ahmed Clinic",
    amount: 250,
    date: new Date("2024-01-25"),
    status: "completed",
    icon: "💰",
  },
  {
    id: "2",
    type: "commission",
    description: "Platform commission (10%)",
    amount: -25,
    date: new Date("2024-01-25"),
    status: "completed",
    icon: "📊",
  },
  {
    id: "3",
    type: "sale",
    description: "Product sale - Organic Dog Food",
    amount: 350,
    date: new Date("2024-01-24"),
    status: "completed",
    icon: "🛍️",
  },
  {
    id: "4",
    type: "commission",
    description: "Platform commission (10%)",
    amount: -35,
    date: new Date("2024-01-24"),
    status: "completed",
    icon: "📊",
  },
  {
    id: "5",
    type: "withdrawal",
    description: "Withdrawal to bank account",
    amount: -500,
    date: new Date("2024-01-20"),
    status: "completed",
    icon: "🏦",
  },
  {
    id: "6",
    type: "booking",
    description: "Consultation - Pet Care Center",
    amount: 300,
    date: new Date("2024-01-18"),
    status: "completed",
    icon: "💰",
  },
];

const walletStats: WalletStats = {
  totalBalance: 1240,
  totalEarnings: 900,
  totalCommissions: -90,
  pendingBalance: 150,
  monthlyEarnings: 1200,
};

export default function FinancialDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "transactions" | "withdraw">("dashboard");
  const [filterType, setFilterType] = useState<"all" | "booking" | "sale" | "commission" | "withdrawal">("all");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    bankName: "",
    accountHolder: "",
  });

  const filteredTransactions = mockTransactions.filter(
    (t) => filterType === "all" || t.type === filterType
  );

  const handleWithdrawal = () => {
    if (!withdrawalAmount || !bankDetails.accountNumber) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Call withdrawal API
    alert("Withdrawal request submitted!");
    setWithdrawalAmount("");
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-yellow-200">Manage your earnings and wallet</p>
        </div>

        <div className="max-w-5xl mx-auto w-full">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {[
              { id: "dashboard", label: "💼 Dashboard" },
              { id: "transactions", label: "📊 Transactions" },
              { id: "withdraw", label: "💸 Withdraw" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg"
                    : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Main stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Balance */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-400/40 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-yellow-200">Total Balance</h3>
                    <span className="text-4xl">💰</span>
                  </div>
                  <p className="text-5xl font-bold text-yellow-300 mb-2">
                    {walletStats.totalBalance} EGP
                  </p>
                  <p className="text-yellow-100/60">Available for withdrawal</p>
                </div>

                {/* Monthly Earnings */}
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-400/40 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-green-200">Monthly Earnings</h3>
                    <span className="text-4xl">📈</span>
                  </div>
                  <p className="text-5xl font-bold text-green-300 mb-2">
                    {walletStats.monthlyEarnings} EGP
                  </p>
                  <p className="text-green-100/60">This month</p>
                </div>
              </div>

              {/* Detailed stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Earnings", value: walletStats.totalEarnings, icon: "💵", color: "from-blue-500 to-blue-600" },
                  { label: "Commissions Paid", value: Math.abs(walletStats.totalCommissions), icon: "📊", color: "from-purple-500 to-purple-600" },
                  { label: "Pending Balance", value: walletStats.pendingBalance, icon: "⏳", color: "from-orange-500 to-orange-600" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`bg-gradient-to-br ${stat.color}/20 border border-${stat.color.split("-")[1]}-400/40 rounded-lg p-6`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-yellow-100/60 text-sm">{stat.label}</p>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <p className="text-3xl font-bold text-yellow-300">{stat.value} EGP</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-yellow-200 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600">
                    📊 View Reports
                  </Button>
                  <Button className="bg-purple-500 text-white font-bold py-3 rounded-lg hover:bg-purple-600">
                    🎯 Set Goals
                  </Button>
                  <Button className="bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600">
                    💸 Withdraw
                  </Button>
                  <Button className="bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-600">
                    📈 Analytics
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div className="space-y-6">
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "all", label: "All" },
                  { id: "booking", label: "Bookings" },
                  { id: "sale", label: "Sales" },
                  { id: "commission", label: "Commissions" },
                  { id: "withdrawal", label: "Withdrawals" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id as typeof filterType)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                      filterType === filter.id
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900"
                        : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Transactions list */}
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-slate-800/60 border border-yellow-400/30 rounded-lg p-4 flex items-center justify-between hover:border-yellow-400/60 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{transaction.icon}</span>
                      <div>
                        <p className="font-bold text-yellow-200">{transaction.description}</p>
                        <p className="text-sm text-yellow-100/60">
                          {transaction.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.amount > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}{transaction.amount} EGP
                      </p>
                      <p
                        className={`text-xs ${
                          transaction.status === "completed"
                            ? "text-green-400"
                            : transaction.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === "withdraw" && (
            <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-yellow-200 mb-6">Withdraw Funds</h3>

              <div className="space-y-6">
                {/* Available balance */}
                <div className="bg-slate-700/50 border border-yellow-400/30 rounded-lg p-4">
                  <p className="text-yellow-100/60 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-yellow-300">{walletStats.totalBalance} EGP</p>
                </div>

                {/* Withdrawal amount */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    Withdrawal Amount (EGP) *
                  </label>
                  <Input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    className="bg-slate-700/50 border-yellow-400/30"
                  />
                  <p className="text-sm text-yellow-100/60 mt-2">
                    Minimum withdrawal: 100 EGP
                  </p>
                </div>

                {/* Bank details */}
                <div className="space-y-4">
                  <h4 className="font-bold text-yellow-200">Bank Account Details</h4>

                  <div>
                    <label className="block text-yellow-200 font-semibold mb-2">
                      Account Holder Name *
                    </label>
                    <Input
                      value={bankDetails.accountHolder}
                      onChange={(e) =>
                        setBankDetails((prev) => ({ ...prev, accountHolder: e.target.value }))
                      }
                      placeholder="Full name"
                      className="bg-slate-700/50 border-yellow-400/30"
                    />
                  </div>

                  <div>
                    <label className="block text-yellow-200 font-semibold mb-2">
                      Bank Name *
                    </label>
                    <Input
                      value={bankDetails.bankName}
                      onChange={(e) =>
                        setBankDetails((prev) => ({ ...prev, bankName: e.target.value }))
                      }
                      placeholder="e.g., National Bank of Egypt"
                      className="bg-slate-700/50 border-yellow-400/30"
                    />
                  </div>

                  <div>
                    <label className="block text-yellow-200 font-semibold mb-2">
                      Account Number *
                    </label>
                    <Input
                      value={bankDetails.accountNumber}
                      onChange={(e) =>
                        setBankDetails((prev) => ({ ...prev, accountNumber: e.target.value }))
                      }
                      placeholder="Your bank account number"
                      className="bg-slate-700/50 border-yellow-400/30"
                    />
                  </div>
                </div>

                {/* Processing fee info */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    ℹ️ Processing fee: 2% (will be deducted from withdrawal amount)
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setActiveTab("dashboard")}
                    variant="outline"
                    className="flex-1 border-2 border-yellow-400 text-yellow-200 font-bold py-3 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleWithdrawal}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-slate-900 font-bold py-3 rounded-lg"
                  >
                    Request Withdrawal
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-8">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-2 border-yellow-400 text-yellow-200 font-bold px-6 py-2 rounded-full"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
