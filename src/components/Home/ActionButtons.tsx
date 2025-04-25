
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ExternalLink, MessageSquare } from 'lucide-react';

const ActionButtons: React.FC<{ clientId?: string }> = ({ clientId }) => {
  const history = useHistory();
  const basePath = clientId ? `/${clientId}` : '';

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <button
        onClick={() => {
          history.push(`${basePath}/free-demo`);
        }}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
      >
        <ExternalLink className="w-5 h-5" />
        Login for Free Demo
      </button>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => window.open(`https://t.me/${clientId || ''}`)}
        >
          <img src="/src/assets/images/tg.svg" className="w-5 h-5" alt="Telegram" />
          Telegram
        </button>
        <button 
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
