
// This is a mock interface for the smart contract
// In a real application, you would generate this from your actual smart contract ABI

export interface TicketInfo {
  id: string;
  name: string;
  event: string;
  price: string;
  owner: string;
  isForSale: boolean;
  resalePrice: string | null;
}

export interface TicketContract {
  getAllTickets: () => Promise<TicketInfo[]>;
  getMyTickets: (address: string) => Promise<TicketInfo[]>;
  getTicketsForSale: () => Promise<TicketInfo[]>;
  buyTicket: (id: string, price: string) => Promise<boolean>;
  issueTicket: (name: string, event: string, price: string) => Promise<boolean>;
  setTicketForSale: (id: string, price: string) => Promise<boolean>;
  removeFromSale: (id: string) => Promise<boolean>;
}
