
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Add TypeScript interface for window.ethereum
interface Window {
  ethereum?: any;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  networkId: number | null;
  switchNetwork: (chainId: string) => Promise<boolean>;
}

// Networks
export const SUPPORTED_NETWORKS = {
  ETHEREUM_MAINNET: { chainId: '0x1', name: 'Ethereum Mainnet' },
  GOERLI: { chainId: '0x5', name: 'Goerli Testnet' },
  SEPOLIA: { chainId: '0xaa36a7', name: 'Sepolia Testnet' },
  POLYGON: { chainId: '0x89', name: 'Polygon Mainnet' },
  MUMBAI: { chainId: '0x13881', name: 'Mumbai Testnet' }
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkId, setNetworkId] = useState<number | null>(null);

  // Check if MetaMask is installed
  const checkIfMetaMaskIsInstalled = () => {
    return typeof window !== 'undefined' && !!window.ethereum;
  };

  // Get current network
  const getNetwork = async () => {
    if (!checkIfMetaMaskIsInstalled()) return null;
    
    try {
      const { ethereum } = window as any;
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch (error) {
      console.error("Error getting network:", error);
      return null;
    }
  };

  // Switch to a different network
  const switchNetwork = async (chainId: string): Promise<boolean> => {
    if (!checkIfMetaMaskIsInstalled()) {
      toast.error("MetaMask is not installed");
      return false;
    }
    
    try {
      const { ethereum } = window as any;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      
      // Update the networkId state after switching
      const newNetworkId = await getNetwork();
      setNetworkId(newNetworkId);
      return true;
    } catch (error: any) {
      // This error code indicates the chain has not been added to MetaMask
      if (error.code === 4902) {
        toast.error("This network is not available in your MetaMask. Please add it manually.");
      } else {
        console.error("Error switching network:", error);
        toast.error("Failed to switch network");
      }
      return false;
    }
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
        
        // Get and set the network ID
        const currentNetworkId = await getNetwork();
        setNetworkId(currentNetworkId);
        
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
            
            // Get and set the network ID
            const currentNetworkId = await getNetwork();
            setNetworkId(currentNetworkId);
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

  // Listen for account and network changes
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
      
      const handleChainChanged = (chainId: string) => {
        setNetworkId(parseInt(chainId, 16));
        // Refresh the page to ensure all state is updated properly
        window.location.reload();
      };

      ethereum?.on('accountsChanged', handleAccountsChanged);
      ethereum?.on('chainChanged', handleChainChanged);
      
      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        ethereum?.removeListener('chainChanged', handleChainChanged);
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
        isConnecting,
        networkId,
        switchNetwork
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
