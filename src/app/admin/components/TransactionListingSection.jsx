'use client';

import { MoreHorizontal } from 'lucide-react';

export default function TransactionListingSection({ title, transactions = [] }) {
  const displayTransactions = Array.isArray(transactions) ? transactions : []

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#4EC50E] text-green-800';
      case 'Pending':
        return 'bg-[#C5B60E] text-yellow-800';
      case 'Failed':
        return 'bg-[#E01A1A] text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <a href="#" className="text-sm text-tertiary hover:text-tertiary/50">View All</a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="text-black33 text-sm">
              <th className="text-left py-3 px-4 font-semibold">ID</th>
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Type</th>
              <th className="text-left py-3 px-4 font-semibold">Amount</th>
              <th className="text-left py-3 px-4 font-semibold">Date</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold"></th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="space-y-2">
            {displayTransactions.length > 0 ? (
              displayTransactions.map((transaction, index) => (
                <tr key={index} className={`text-sm text-tertiary hover:bg-gray-50 transition-colors border-b-2 border-b-white ${
                  index % 2 === 0 ? 'bg-black10' : 'bg-white'
                }`}>
                  <td className="py-3 px-4">
                    {transaction.id}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.name}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.email}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.type}
                  </td>
                  <td className="py-3 px-4 text-secondary font-medium">
                    {transaction.amount}
                  </td>
                  <td className="py-3 px-4">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                  No transaction records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
