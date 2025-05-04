
// This interface represents the smart contract interaction for NFT tickets

export interface TicketInfo {
  id: string;
  name: string;
  event: string;
  price: string;
  owner: string;
  isForSale: boolean;
  resalePrice: string | null;
  tokenURI?: string;
}

export interface TicketContract {
  getAllTickets: () => Promise<TicketInfo[]>;
  getMyTickets: (address: string) => Promise<TicketInfo[]>;
  getTicketsForSale: () => Promise<TicketInfo[]>;
  buyTicket: (id: string, price: string) => Promise<boolean>;
  issueTicket: (name: string, event: string, price: string) => Promise<boolean>;
  setTicketForSale: (id: string, price: string) => Promise<boolean>;
  removeFromSale: (id: string) => Promise<boolean>;
  mintNFT: (name: string, event: string, price: string) => Promise<string | null>;
}
