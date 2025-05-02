
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useWallet } from '@/context/WalletContext';
import { Wallet, X } from 'lucide-react';

const Navbar = () => {
  const { isConnected, account, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const navigate = useNavigate();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between bg-black/30 backdrop-blur-sm">
      <div className="flex items-center">
        <h1 
          className="text-2xl font-bold gradient-text cursor-pointer" 
          onClick={() => navigate('/')}
        >
          BlockTix
        </h1>
      </div>
      <div>
        {isConnected ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-gray-300">
              {formatAddress(account || '')}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnectWallet}
              className="border-ticket-purple hover:bg-ticket-purple/10 text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="bg-ticket-purple hover:bg-ticket-purple-dark"
            >
              Dashboard
            </Button>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-ticket-gradient hover:bg-ticket-purple-dark animate-pulse-glow"
          >
            {isConnecting ? (
              "Connecting..."
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
