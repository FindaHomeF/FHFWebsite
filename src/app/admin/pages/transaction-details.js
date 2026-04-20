'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const TransactionDetailsPage = ({ transactionId }) => {
  const router = useRouter();
  const params = useParams();
  const id = transactionId || params?.id;

  // Default transaction data
  const defaultTransaction = {
    id: "#1234",
    name: "John Doe",
    email: "john@example.com",
    phone: "08012345678",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Card",
    date: "12/12/2025",
    time: "10:30 AM",
    status: "Completed",
    transactionRef: "TXN-20250112-001234",
    description: "Payment for home cleaning service",
    serviceProvider: "Elite Cleaning Services",
    paymentDetails: {
      cardLast4: "4242",
      cardBrand: "Visa",
      authorizationCode: "AUTH123456"
    }
  };

  const [transaction, setTransaction] = useState(defaultTransaction);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Load transaction data from localStorage or use mock data
  useEffect(() => {
    console.log('Loading transaction with id:', id);
    
    if (typeof window !== 'undefined') {
      // Try to get from localStorage first
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const foundTransaction = transactions.find(t => t.id === id);
      
      if (foundTransaction) {
        console.log('Found transaction in localStorage:', foundTransaction);
        setTransaction(foundTransaction);
        return;
      }
      
      // Mock transactions matching the list
      const mockTransactions = [
        {
          id: "#1234",
          name: "John Doe",
          email: "john@example.com",
          phone: "08012345678",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Card",
          date: "12/12/2025",
          time: "10:30 AM",
          status: "Completed",
          transactionRef: "TXN-20250112-001234",
          description: "Payment for home cleaning service",
          serviceProvider: "Elite Cleaning Services",
          paymentDetails: { cardLast4: "4242", cardBrand: "Visa", authorizationCode: "AUTH123456" }
        },
        {
          id: "#1235",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "08023456789",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Transfer",
          date: "12/12/2025",
          time: "11:00 AM",
          status: "Pending",
          transactionRef: "TXN-20250112-001235",
          description: "Payment for plumbing service",
          serviceProvider: "Plumbing Pro",
          paymentDetails: null
        },
        {
          id: "#1236",
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "08034567890",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Wallet",
          date: "12/12/2025",
          time: "11:30 AM",
          status: "Failed",
          transactionRef: "TXN-20250112-001236",
          description: "Payment for electrical work",
          serviceProvider: "Electric Solutions",
          paymentDetails: null
        },
        {
          id: "#1237",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          phone: "08045678901",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Card",
          date: "12/12/2025",
          time: "12:00 PM",
          status: "Completed",
          transactionRef: "TXN-20250112-001237",
          description: "Payment for carpentry service",
          serviceProvider: "Carpenter Plus",
          paymentDetails: { cardLast4: "5678", cardBrand: "Mastercard", authorizationCode: "AUTH789012" }
        },
        {
          id: "#1238",
          name: "David Brown",
          email: "david@example.com",
          phone: "08056789012",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Transfer",
          date: "12/12/2025",
          time: "12:30 PM",
          status: "Pending",
          transactionRef: "TXN-20250112-001238",
          description: "Payment for painting service",
          serviceProvider: "Paint Masters",
          paymentDetails: null
        },
        {
          id: "#1239",
          name: "Lisa Anderson",
          email: "lisa@example.com",
          phone: "08067890123",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Wallet",
          date: "12/12/2025",
          time: "1:00 PM",
          status: "Completed",
          transactionRef: "TXN-20250112-001239",
          description: "Payment for landscaping",
          serviceProvider: "Green Thumbs",
          paymentDetails: null
        },
        {
          id: "#1240",
          name: "Robert Taylor",
          email: "robert@example.com",
          phone: "08078901234",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Card",
          date: "12/12/2025",
          time: "1:30 PM",
          status: "Pending",
          transactionRef: "TXN-20250112-001240",
          description: "Payment for HVAC service",
          serviceProvider: "Cool Air",
          paymentDetails: { cardLast4: "9012", cardBrand: "Visa", authorizationCode: "AUTH345678" }
        },
        {
          id: "#1241",
          name: "Emily Davis",
          email: "emily@example.com",
          phone: "08089012345",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Transfer",
          date: "12/12/2025",
          time: "2:00 PM",
          status: "Failed",
          transactionRef: "TXN-20250112-001241",
          description: "Payment for appliance repair",
          serviceProvider: "Fix It All",
          paymentDetails: null
        },
        {
          id: "#1242",
          name: "James Martinez",
          email: "james@example.com",
          phone: "08090123456",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Card",
          date: "12/12/2025",
          time: "2:30 PM",
          status: "Completed",
          transactionRef: "TXN-20250112-001242",
          description: "Payment for roofing service",
          serviceProvider: "Roof Experts",
          paymentDetails: { cardLast4: "3456", cardBrand: "Visa", authorizationCode: "AUTH901234" }
        },
        {
          id: "#1243",
          name: "Jennifer Brown",
          email: "jennifer@example.com",
          phone: "08001234567",
          paymentType: "Service Payment",
          amount: "₦200,000",
          paymentMethod: "Wallet",
          date: "12/12/2025",
          time: "3:00 PM",
          status: "Completed",
          transactionRef: "TXN-20250112-001243",
          description: "Payment for flooring service",
          serviceProvider: "Floor Masters",
          paymentDetails: null
        }
      ];
      
      const mockTransaction = mockTransactions.find(t => t.id === id);
      if (mockTransaction) {
        console.log('Found mock transaction:', mockTransaction);
        setTransaction(mockTransaction);
        return;
      }
      
      // If not found in mock data either, use default
      console.log('Not found in mock data, using default transaction');
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF...');
  };

  const handleApprove = () => {
    try {
      setIsUpdating(true);
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const transactionIndex = transactions.findIndex(t => t.id === transaction.id);
      
      if (transactionIndex !== -1) {
        transactions[transactionIndex].status = 'Completed';
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        setTransaction({ ...transaction, status: 'Completed' });
        toast.success('Transaction approved successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      toast.error('Failed to approve transaction');
      setIsUpdating(false);
    }
  };

  const handleReject = () => {
    try {
      setIsUpdating(true);
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const transactionIndex = transactions.findIndex(t => t.id === transaction.id);
      
      if (transactionIndex !== -1) {
        transactions[transactionIndex].status = 'Failed';
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        setTransaction({ ...transaction, status: 'Failed' });
        setIsRejectDialogOpen(false)
        toast.success('Transaction rejected successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      toast.error('Failed to reject transaction');
      setIsUpdating(false);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.transactionRef);
    toast.success('Reference copied to clipboard!');
  };

  const getStatusBadge = (status) => {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'Completed':
        return <span className={`${baseClass} bg-green-500 text-white`}>{status}</span>;
      case 'Pending':
        return <span className={`${baseClass} bg-yellow-500 text-white`}>{status}</span>;
      case 'Failed':
        return <span className={`${baseClass} bg-red-500 text-white`}>{status}</span>;
      default:
        return <span className={`${baseClass} bg-gray-500 text-white`}>{status}</span>;
    }
  };

  // Get recipient - could be service provider or derived from transaction
  const recipient = transaction.serviceProvider || transaction.description?.split(' ').slice(-2).join(' ') || 'N/A';

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm max-h-screen">
        {/* Header Section with Back and Download Buttons */}
        <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-8 pt-4 border-b backdrop-blur-md px-6 border-b-black10">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
                </Button>
            {transaction.status !== 'Failed' && (
              <Button
                onClick={() => setIsRejectDialogOpen(true)}
                variant="destructive"
                className="flex items-center gap-2"
                disabled={isUpdating}
              >
                Reject Transaction
              </Button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 max-w-3xl mx-auto">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction Details</h1>

          {/* Transaction Information List */}
          <div className="space-y-0">
            {/* Transaction ID */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Transaction ID</span>
              <span className="text-sm text-gray-900 font-semibold">{transaction.id}</span>
                </div>

            {/* Name */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <span className="text-sm text-gray-900">{transaction.name}</span>
            </div>

            {/* Transaction Type */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Transaction Type</span>
              <span className="text-sm text-blue-600 font-medium">{transaction.paymentType}</span>
              </div>

              {/* Amount */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Amount</span>
              <span className="text-sm text-gray-900 font-semibold">{transaction.amount}</span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Payment Method</span>
              <span className="text-sm text-gray-900">{transaction.paymentMethod}</span>
              </div>

            {/* Status */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Status</span>
                  <span>{getStatusBadge(transaction.status)}</span>
                </div>
                
            {/* Date */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Date</span>
              <span className="text-sm text-gray-900">{transaction.date}</span>
                </div>
                
            {/* Property/Service/Item */}
            <div className="flex justify-between items-center py-4 border-b border-dashed border-black10">
              <span className="text-sm font-medium text-gray-700">Property/Service/Item</span>
              <span className="text-sm text-gray-900 text-right max-w-xs">
                {transaction.serviceProvider || transaction.description || 'N/A'}
              </span>
                </div>
                
            {/* Recipient */}
            <div className="flex justify-between items-center py-4">
              <span className="text-sm font-medium text-gray-700">Recipient</span>
              <span className="text-sm text-gray-900">{recipient}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmActionDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        title='Reject transaction?'
        description='This action cannot be undone.'
        confirmText='Reject transaction'
        onConfirm={handleReject}
        isConfirming={isUpdating}
      />
    </div>
  );
};

export default TransactionDetailsPage;
