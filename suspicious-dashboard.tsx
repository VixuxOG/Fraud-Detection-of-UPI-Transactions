import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, AlertCircle, Shield } from 'lucide-react';

const Dashboard = () => {
  // Realistic mock data for fraud detection
  const mockData = {
    stats: {
      total: { value: 15782, change: 12.3 },
      suspicious: { value: 342, change: 15.8 },
      amount: { value: 9845672, change: 8.4 },
    },
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      time: `${23-i}:00`,
      transactions: Math.floor(Math.random() * 500 + 300),
      suspiciousCount: Math.floor(Math.random() * 30 + 10),
      riskScore: Math.floor(Math.random() * 40 + 60)
    })).reverse(),
    suspiciousTransactions: [
      {
        id: 1,
        time: "2024-10-26 09:23:15",
        amount: 52999,
        sender: "User745",
        recipient: "User162",
        riskScore: 0.92,
        flags: ["Unusual Amount", "New Recipient"]
      },
      {
        id: 2,
        time: "2024-10-26 09:15:32",
        amount: 25000,
        sender: "User891",
        recipient: "User443",
        riskScore: 0.88,
        flags: ["Multiple Transactions", "Off-hours"]
      },
      {
        id: 3,
        time: "2024-10-26 08:55:41",
        amount: 149999,
        sender: "User234",
        recipient: "User567",
        riskScore: 0.95,
        flags: ["Large Amount", "Location Mismatch"]
      },
      {
        id: 4,
        time: "2024-10-26 08:45:19",
        amount: 74999,
        sender: "User432",
        recipient: "User876",
        riskScore: 0.86,
        flags: ["Velocity Check", "Pattern Match"]
      },
      {
        id: 5,
        time: "2024-10-26 08:30:27",
        amount: 35000,
        sender: "User654",
        recipient: "User321",
        riskScore: 0.89,
        flags: ["Suspicious IP", "Amount Pattern"]
      }
    ]
  };

  const [timeframe] = useState('24h');

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="flex items-baseline">
        <h3 className="text-2xl font-bold">
          {typeof value === 'number' && value > 999 
            ? value.toLocaleString() 
            : value}
        </h3>
        <span className={`ml-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fraud Detection Monitor</h1>
            <p className="text-gray-600">High-risk transaction analysis</p>
          </div>
          <div className="flex gap-4">
            <select className="bg-white border rounded-md px-3 py-2 shadow-sm">
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button className="bg-red-50 text-red-700 px-4 py-2 rounded-md font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {mockData.stats.suspicious.value} Alerts
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Transactions" 
            value={mockData.stats.total.value}
            change={mockData.stats.total.change}
            icon={TrendingUp}
          />
          <StatCard 
            title="High Risk Transactions" 
            value={mockData.stats.suspicious.value}
            change={mockData.stats.suspicious.change}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard 
            title="Total Amount Flagged (₹)" 
            value={mockData.stats.amount.value}
            change={mockData.stats.amount.change}
            icon={AlertCircle}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Suspicious Transaction Volume</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.hourlyData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="suspiciousCount" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Risk Score Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.hourlyData}>
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="riskScore" 
                    stroke="#ea580c" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Suspicious Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium">High Risk Transactions</h3>
            </div>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Showing {mockData.suspiciousTransactions.length} suspicious transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockData.suspiciousTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.time}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.sender}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.recipient}</td>
                    <td className="px-6 py-4">
                      <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full w-16 text-center">
                        {(tx.riskScore * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {tx.flags.map((flag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
