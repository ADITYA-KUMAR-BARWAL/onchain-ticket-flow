
import { TicketContract, TicketInfo } from "../interfaces/TicketContract";

// Mock data
let mockTickets: TicketInfo[] = [
  {
    id: "1",
    name: "VIP Pass",
    event: "ETH Global Conference 2025",
    price: "0.5",
    owner: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    isForSale: true,
    resalePrice: "0.75"
  },
  {
    id: "2",
    name: "General Admission",
    event: "DeFi Summit 2025",
    price: "0.2",
    owner: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    isForSale: false,
    resalePrice: null
  },
  {
    id: "3",
    name: "Backstage Pass",
    event: "NFT Music Festival",
    price: "1.0",
    owner: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    isForSale: true,
    resalePrice: "1.5"
  }
];

// Mock implementation of the ticket contract
export const mockTicketContract: TicketContract = {
  getAllTickets: async (): Promise<TicketInfo[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [...mockTickets];
  },

  getMyTickets: async (address: string): Promise<TicketInfo[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTickets.filter(ticket => ticket.owner.toLowerCase() === address.toLowerCase());
  },

  getTicketsForSale: async (): Promise<TicketInfo[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTickets.filter(ticket => ticket.isForSale);
  },

  buyTicket: async (id: string, price: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const ticketIndex = mockTickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1 || !mockTickets[ticketIndex].isForSale) {
      return false;
    }

    // In a real implementation, we would check if the sent value matches the price
    // and transfer ownership on the blockchain
    
    // For now, just update our mock data
    const connectedAccount = (window as any).ethereum?.selectedAddress;
    if (connectedAccount) {
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        owner: connectedAccount,
        isForSale: false,
        resalePrice: null
      };
      return true;
    }
    
    return false;
  },

  issueTicket: async (name: string, event: string, price: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const connectedAccount = (window as any).ethereum?.selectedAddress;
    if (!connectedAccount) return false;
    
    // Generate a new unique ID (in a real implementation this would be the NFT token ID)
    const newId = (mockTickets.length + 1).toString();
    
    // Create the new ticket
    const newTicket: TicketInfo = {
      id: newId,
      name,
      event,
      price,
      owner: connectedAccount,
      isForSale: false,
      resalePrice: null
    };
    
    // Add to our mock data
    mockTickets.push(newTicket);
    return true;
  },

  setTicketForSale: async (id: string, price: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const connectedAccount = (window as any).ethereum?.selectedAddress;
    if (!connectedAccount) return false;
    
    const ticketIndex = mockTickets.findIndex(
      ticket => ticket.id === id && ticket.owner.toLowerCase() === connectedAccount.toLowerCase()
    );
    
    if (ticketIndex === -1) return false;
    
    // Update the ticket
    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      isForSale: true,
      resalePrice: price
    };
    
    return true;
  },

  removeFromSale: async (id: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const connectedAccount = (window as any).ethereum?.selectedAddress;
    if (!connectedAccount) return false;
    
    const ticketIndex = mockTickets.findIndex(
      ticket => ticket.id === id && ticket.owner.toLowerCase() === connectedAccount.toLowerCase()
    );
    
    if (ticketIndex === -1) return false;
    
    // Update the ticket
    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      isForSale: false,
      resalePrice: null
    };
    
    return true;
  }
};
