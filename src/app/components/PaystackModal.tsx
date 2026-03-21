import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Loader2 } from 'lucide-react';

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  amount: number;
  onSuccess: (reference: string) => void;
  onError?: (error: string) => void;
  title?: string;
}

export function PaystackModal({
  isOpen,
  onClose,
  email,
  amount,
  onSuccess,
  onError,
  title = 'Add Payment Method',
}: PaystackModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const config = {
    email,
    amount: amount * 100, // Convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxx',
    currency: 'NGN',
    channels: ['card'],
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaystackSuccess = (reference: any) => {
    setIsProcessing(false);
    onSuccess(reference.reference);
  };

  const handlePaystackClose = () => {
    setIsProcessing(false);
    onClose();
  };

  const handlePaystackError = (error: any) => {
    setIsProcessing(false);
    onError?.(error.message || 'Payment failed');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handlePaystackClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={handlePaystackClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-center py-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-medium mb-2">Secure Payment</h3>
            <p className="text-slate-500 text-sm">
              You'll not be charged during the 7-day trial. Your card will only be charged if you continue after the trial ends.
            </p>
          </div>

          <button
            onClick={() => {
              setIsProcessing(true);
              initializePayment(handlePaystackSuccess, handlePaystackError);
            }}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Add Card'
            )}
          </button>

          <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secured by Paystack
          </p>
        </div>
      </div>
    </div>
  );
}