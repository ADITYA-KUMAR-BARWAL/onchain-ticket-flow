import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellTicketForm, IssueTicketForm } from '@/components/dashboard/TicketForm';
import TicketCard from '@/components/dashboard/TicketCard';
import { useWallet, SUPPORTED_NETWORKS } from '@/context/WalletContext';
import { mockTicketContract } from '@/services/mockContract';
import { ethersTicketContract } from '@/services/ethersContract';
import { TicketInfo } from '@/interfaces/TicketContract';
import { toast } from "sonner";
import { ShoppingBag, Plus, Ticket, Wallet, TicketSlash, AlertCircle } from 'lucide-react';

// The network we want to use for our app
const PREFERRED_NETWORK = SUPPORTED_NETWORKS.SEPOLIA;

const Dashboard = () => {
  const { isConnected, account, networkId, switchNetwork } = useWallet();
  const navigate = useNavigate();
  
  const [myTickets, setMyTickets] = useState<TicketInfo[]>([]);
  const [ticketsForSale, setTicketsForSale] = useState<TicketInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  // Use either the mock contract or the real implementation
  // In a production app, you would only use the real implementation
  const ticketContract = process.env.NODE_ENV === 'development' ? mockTicketContract : ethersTicketContract;

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }
    
    // Check if we're on the correct network
    if (networkId && parseInt(PREFERRED_NETWORK.chainId, 16) !== networkId) {
      setIsCorrectNetwork(false);
    } else {
      setIsCorrectNetwork(true);
      loadData();
    }
  }, [isConnected, account, navigate, networkId]);

  const handleSwitchNetwork = async () => {
    const success = await switchNetwork(PREFERRED_NETWORK.chainId);
    if (success) {
      setIsCorrectNetwork(true);
      loadData();
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (account) {
        const [myTicketsData, forSaleData] = await Promise.all([
          ticketContract.getMyTickets(account),
          ticketContract.getTicketsForSale()
        ]);
        setMyTickets(myTicketsData);
        setTicketsForSale(forSaleData.filter(ticket => ticket.owner.toLowerCase() !== account.toLowerCase()));
      }
    } catch (error) {
      console.error('Error loading ticket data:', error);
      toast.error('Failed to load ticket data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsSellModalOpen(true);
  };

  const handleCancelSale = async (ticketId: string) => {
    setIsProcessing(true);
    try {
      const success = await ticketContract.removeFromSale(ticketId);
      if (success) {
        toast.success('Ticket removed from sale');
        loadData();
      } else {
        toast.error('Failed to remove ticket from sale');
      }
    } catch (error) {
      console.error('Error cancelling sale:', error);
      toast.error('Error processing your request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSellSubmit = async (price: string) => {
    if (!selectedTicketId) return;
    
    setIsProcessing(true);
    try {
      const success = await ticketContract.setTicketForSale(selectedTicketId, price);
      if (success) {
        toast.success('Ticket listed for sale');
        setIsSellModalOpen(false);
        loadData();
      } else {
        toast.error('Failed to list ticket for sale');
      }
    } catch (error) {
      console.error('Error listing for sale:', error);
      toast.error('Error processing your request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyTicket = async (ticketId: string, price: string) => {
    setIsProcessing(true);
    try {
      const success = await ticketContract.buyTicket(ticketId, price);
      if (success) {
        toast.success('Ticket purchased successfully');
        loadData();
      } else {
        toast.error('Failed to purchase ticket');
      }
    } catch (error) {
      console.error('Error buying ticket:', error);
      toast.error('Error processing your purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIssueSubmit = async (name: string, event: string, price: string) => {
    setIsProcessing(true);
    try {
      // For NFT minting, we use the issueTicket method which internally calls mintNFT
      const success = await ticketContract.issueTicket(name, event, price);
      if (success) {
        toast.success('NFT Ticket minted successfully');
        setIsIssueModalOpen(false);
        loadData();
      } else {
        toast.error('Failed to mint NFT ticket');
      }
    } catch (error) {
      console.error('Error issuing ticket:', error);
      toast.error('Error processing your request');
    } finally {
      setIsProcessing(false);
    }
  };

  // Display network warning if on wrong network
  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508997449629-303059a039c0?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-10 z-0"></div>
        <div className="relative z-10">
          <Navbar />
          
          <main className="container mx-auto py-16 px-4 flex flex-col items-center justify-center">
            <div className="bg-gray-900/80 p-8 rounded-lg border border-red-500 max-w-md w-full text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Wrong Network</h2>
              <p className="text-gray-300 mb-6">
                Please switch to {PREFERRED_NETWORK.name} to use this application.
              </p>
              <Button 
                onClick={handleSwitchNetwork}
                className="w-full bg-ticket-gradient hover:bg-ticket-purple-dark"
              >
                Switch Network
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508997449629-303059a039c0?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-10 z-0"></div>
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <div className="flex gap-4">
              <Button 
                onClick={() => setIsIssueModalOpen(true)}
                className="bg-ticket-gradient hover:bg-ticket-purple-dark"
              >
                <Plus className="mr-2 h-4 w-4" />
                Issue Ticket
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="my-tickets" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-gray-900/50">
              <TabsTrigger value="my-tickets" className="data-[state=active]:bg-ticket-purple data-[state=active]:text-white">
                <Ticket className="mr-2 h-4 w-4" />
                My Tickets
              </TabsTrigger>
              <TabsTrigger value="for-sale" className="data-[state=active]:bg-ticket-purple data-[state=active]:text-white">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Buy Tickets
              </TabsTrigger>
              <TabsTrigger value="resale" className="data-[state=active]:bg-ticket-purple data-[state=active]:text-white">
                <TicketSlash className="mr-2 h-4 w-4" />
                Resell Tickets
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-tickets">
              {isLoading ? (
                <div className="text-center py-8">Loading your tickets...</div>
              ) : myTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myTickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
                  <p className="text-gray-400 mb-6">You don't have any tickets yet.</p>
                  <Button 
                    onClick={() => setIsIssueModalOpen(true)}
                    className="bg-ticket-gradient hover:bg-ticket-purple-dark"
                  >
                    Issue a New Ticket
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="for-sale">
              {isLoading ? (
                <div className="text-center py-8">Loading tickets for sale...</div>
              ) : ticketsForSale.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ticketsForSale.map(ticket => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      onBuy={handleBuyTicket}
                      actionType="buy"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Tickets Available</h3>
                  <p className="text-gray-400">There are currently no tickets for sale.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resale">
              {isLoading ? (
                <div className="text-center py-8">Loading your tickets...</div>
              ) : myTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myTickets.map(ticket => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      onSell={handleSellClick}
                      onCancelSale={handleCancelSale}
                      actionType="sell"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TicketSlash className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Tickets to Resell</h3>
                  <p className="text-gray-400 mb-6">You don't have any tickets to resell.</p>
                  <Button 
                    onClick={() => setIsIssueModalOpen(true)}
                    className="bg-ticket-gradient hover:bg-ticket-purple-dark"
                  >
                    Issue a New Ticket
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <SellTicketForm 
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSubmit={handleSellSubmit}
        title="Set Resale Price"
        loading={isProcessing}
      />
      
      <IssueTicketForm 
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSubmit={handleIssueSubmit}
        loading={isProcessing}
      />
    </div>
  );
};

export default Dashboard;
