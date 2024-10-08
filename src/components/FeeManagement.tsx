import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

interface Fee {
  id: number;
  userId: number;
  userName: string;
  lastPaymentDate: string;
  status: string;
  dueDate: string;
  amount: number;
}

const FeeManagement: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fees`);
      if (!response.ok) {
        throw new Error('Failed to fetch fees');
      }
      const data = await response.json();
      setFees(data);
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

  const handlePaymentUpdate = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/fees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Paid',
          lastPaymentDate: new Date().toISOString().split('T')[0],
        }),
      });
      if (response.ok) {
        fetchFees();
      }
    } catch (error) {
      console.error('Error updating fee:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fee Management</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Last Payment</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id} className="border-t">
                <td className="px-4 py-2">{fee.userName}</td>
                <td className="px-4 py-2">${fee.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{fee.dueDate}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded ${
                    fee.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-4 py-2">{fee.lastPaymentDate || 'N/A'}</td>
                <td className="px-4 py-2">
                  {fee.status !== 'Paid' && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
                      onClick={() => handlePaymentUpdate(fee.id)}
                    >
                      <DollarSign size={16} className="mr-1" /> Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagement;