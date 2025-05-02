
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if MetaMask is installed
  const checkIfMetaMaskIsInstalled = () => {
    return typeof window !== 'undefined' && !!window.ethereum;
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (!checkIfMetaMaskIsInstalled()) {
      toast.error("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    try {
      setIsConnecting(true);
      const { ethereum } = window as any;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem('walletConnected', 'true');
        toast.success("Wallet connected successfully!");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem('walletConnected');
    toast.info("Wallet disconnected");
  };

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (wasConnected && checkIfMetaMaskIsInstalled()) {
        try {
          const { ethereum } = window as any;
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            localStorage.removeItem('walletConnected');
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          localStorage.removeItem('walletConnected');
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (checkIfMetaMaskIsInstalled()) {
      const { ethereum } = window as any;
      
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      ethereum?.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        connectWallet,
        disconnectWallet,
        isConnected: !!account,
        isConnecting
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
