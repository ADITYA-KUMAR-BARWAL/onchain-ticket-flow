
import { ethers } from 'ethers';
import { TicketContract, TicketInfo } from '../interfaces/TicketContract';
import { toast } from "sonner";

// This is a simplified ABI for an ERC-721 ticket NFT contract
// In a real implementation, you would import the full ABI from your compiled contract
const TICKET_NFT_ABI = [
  // ERC-721 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  
  // Custom ticket functions
  "function mintTicket(string memory name, string memory event, uint256 price) returns (uint256)",
  "function getTicket(uint256 tokenId) view returns (string memory name, string memory event, uint256 price, address owner, bool isForSale, uint256 resalePrice)",
  "function listTicketForSale(uint256 tokenId, uint256 price)",
  "function cancelTicketSale(uint256 tokenId)",
  "function buyTicket(uint256 tokenId) payable",
  "function getAllTickets() view returns (uint256[])",
  "function getTicketsForSale() view returns (uint256[])"
];

// This would be your deployed contract address
const CONTRACT_ADDRESS = "0x123..."; // Replace with actual contract address in production

export class EthersTicketContract implements TicketContract {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, TICKET_NFT_ABI, this.signer);
      } catch (error) {
        console.error("Failed to initialize Ethereum provider:", error);
      }
    } else {
      console.error("Ethereum provider not available. Please install MetaMask.");
    }
  }

  private async ensureConnection(): Promise<boolean> {
    if (!this.contract || !this.signer || !this.provider) {
      await this.initializeProvider();
      return !!this.contract;
    }
    return true;
  }

  private weiToEth(weiValue: bigint): string {
    return ethers.formatEther(weiValue);
  }

  private ethToWei(ethValue: string): bigint {
    return ethers.parseEther(ethValue);
  }

  private tokenIdToString(tokenId: bigint): string {
    return tokenId.toString();
  }

  private async getTicketFromChain(tokenId: number | string): Promise<TicketInfo | null> {
    try {
      if (!await this.ensureConnection()) return null;

      const [name, event, price, owner, isForSale, resalePrice] = await this.contract!.getTicket(tokenId);
      
      return {
        id: tokenId.toString(),
        name,
        event,
        price: this.weiToEth(price),
        owner,
        isForSale,
        resalePrice: isForSale ? this.weiToEth(resalePrice) : null,
      };
    } catch (error) {
      console.error(`Error getting ticket ${tokenId}:`, error);
      return null;
    }
  }

  async getAllTickets(): Promise<TicketInfo[]> {
    try {
      if (!await this.ensureConnection()) return [];

      const tokenIds = await this.contract!.getAllTickets();
      
      const ticketsPromises = tokenIds.map((id: bigint) => 
        this.getTicketFromChain(this.tokenIdToString(id))
      );
      
      const tickets = await Promise.all(ticketsPromises);
      return tickets.filter(ticket => ticket !== null) as TicketInfo[];
    } catch (error) {
      console.error("Error getting all tickets:", error);
      return [];
    }
  }

  async getMyTickets(address: string): Promise<TicketInfo[]> {
    try {
      if (!await this.ensureConnection()) return [];
      
      // Get all tickets and filter for owner
      const allTickets = await this.getAllTickets();
      return allTickets.filter(ticket => 
        ticket.owner.toLowerCase() === address.toLowerCase()
      );
    } catch (error) {
      console.error("Error getting my tickets:", error);
      return [];
    }
  }

  async getTicketsForSale(): Promise<TicketInfo[]> {
    try {
      if (!await this.ensureConnection()) return [];
      
      const forSaleIds = await this.contract!.getTicketsForSale();
      
      const ticketsPromises = forSaleIds.map((id: bigint) => 
        this.getTicketFromChain(this.tokenIdToString(id))
      );
      
      const tickets = await Promise.all(ticketsPromises);
      return tickets.filter(ticket => ticket !== null && ticket.isForSale) as TicketInfo[];
    } catch (error) {
      console.error("Error getting tickets for sale:", error);
      return [];
    }
  }

  async buyTicket(id: string, price: string): Promise<boolean> {
    try {
      if (!await this.ensureConnection()) return false;
      
      // Convert price to Wei and create transaction options
      const valueInWei = this.ethToWei(price);
      const tx = await this.contract!.buyTicket(id, { value: valueInWei });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      return receipt.status === 1; // 1 indicates success
    } catch (error) {
      console.error("Error buying ticket:", error);
      toast.error("Transaction failed. Please check your wallet balance and try again.");
      return false;
    }
  }

  async mintNFT(name: string, event: string, price: string): Promise<string | null> {
    try {
      if (!await this.ensureConnection()) return null;
      
      // Convert price to Wei for the contract
      const priceInWei = this.ethToWei(price);
      
      // Call the contract method to mint a new ticket NFT
      const tx = await this.contract!.mintTicket(name, event, priceInWei);
      
      // Wait for the transaction to be confirmed
      const receipt = await tx.wait();
      
      // Check for successful transaction
      if (receipt.status !== 1) {
        throw new Error("Transaction failed");
      }
      
      // Find the tokenId from the transaction logs
      // Note: This implementation assumes the event structure of the smart contract
      const tokenIdEvent = receipt.events?.find(event => event.event === 'Transfer');
      const tokenId = tokenIdEvent?.args?.tokenId.toString();
      
      if (!tokenId) {
        throw new Error("Failed to retrieve token ID");
      }
      
      toast.success(`Successfully minted NFT ticket #${tokenId}`);
      return tokenId;
    } catch (error) {
      console.error("Error minting NFT ticket:", error);
      toast.error("Failed to mint NFT ticket. Please try again.");
      return null;
    }
  }

  async issueTicket(name: string, event: string, price: string): Promise<boolean> {
    try {
      const tokenId = await this.mintNFT(name, event, price);
      return tokenId !== null;
    } catch (error) {
      console.error("Error issuing ticket:", error);
      return false;
    }
  }

  async setTicketForSale(id: string, price: string): Promise<boolean> {
    try {
      if (!await this.ensureConnection()) return false;
      
      const priceInWei = this.ethToWei(price);
      const tx = await this.contract!.listTicketForSale(id, priceInWei);
      
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error) {
      console.error("Error listing ticket for sale:", error);
      toast.error("Failed to list ticket for sale.");
      return false;
    }
  }

  async removeFromSale(id: string): Promise<boolean> {
    try {
      if (!await this.ensureConnection()) return false;
      
      const tx = await this.contract!.cancelTicketSale(id);
      
      const receipt = await tx.wait();
      return receipt.status === 1;
    } catch (error) {
      console.error("Error removing ticket from sale:", error);
      toast.error("Failed to remove ticket from sale.");
      return false;
    }
  }
}

// Export a singleton instance of the contract service
export const ethersTicketContract = new EthersTicketContract();
