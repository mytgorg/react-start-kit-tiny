
import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentSection: React.FC<{ onPayNow: () => void }> = ({ onPayNow }) => {
  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center text-[#c9df3d]">
        Premium Services Available
      </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={onPayNow}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
        >
          <CreditCard className="w-5 h-5" />
          Pay Now
        </button>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
        >
          <img src="/src/assets/images/qr-code.png" className="w-5 h-5" alt="QR" />
          QR Code
        </button>
      </div>
    </div>
  );
};

export default PaymentSection;
