
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';
import { Wallet } from 'lucide-react';

const Hero = () => {
  const { connectWallet, isConnected, isConnecting } = useWallet();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard');
    } else {
      connectWallet();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        The Future of <span className="gradient-text">Ticket Distribution</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-8">
        A decentralized, tamper-proof blockchain-based ticketing platform that ensures fair pricing,
        authenticity, and secure ownership using NFTs.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          onClick={handleGetStarted}
          disabled={isConnecting}
          className="bg-ticket-gradient hover:bg-ticket-purple-dark text-xl px-8 py-6 animate-pulse-glow"
        >
          {isConnecting ? (
            "Connecting..."
          ) : isConnected ? (
            "Go to Dashboard"
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-ticket-purple text-white hover:bg-ticket-purple/10 text-xl px-8 py-6"
          onClick={() => navigate('/about')}
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default Hero;
