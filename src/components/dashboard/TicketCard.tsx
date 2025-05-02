
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketInfo } from '@/interfaces/TicketContract';
import { Ticket } from 'lucide-react';

interface TicketCardProps {
  ticket: TicketInfo;
  onSell?: (id: string) => void;
  onCancelSale?: (id: string) => void;
  onBuy?: (id: string, price: string) => void;
  actionType?: 'buy' | 'sell' | 'none';
}

const TicketCard = ({ ticket, onSell, onCancelSale, onBuy, actionType = 'none' }: TicketCardProps) => {
  return (
    <Card className="bg-gray-900/70 border-gray-800 overflow-hidden backdrop-blur-sm">
      <div className="h-2 bg-ticket-gradient" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{ticket.name}</CardTitle>
          <div className="bg-ticket-purple/20 p-2 rounded-full">
            <Ticket className="h-4 w-4 text-ticket-purple-light" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-400 mb-2">Event</p>
        <p className="font-medium mb-4">{ticket.event}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Original Price</p>
            <p className="font-bold">{ticket.price} ETH</p>
          </div>
          
          {ticket.isForSale && ticket.resalePrice && (
            <div>
              <p className="text-sm text-gray-400">Resale Price</p>
              <p className="font-bold text-ticket-purple-light">{ticket.resalePrice} ETH</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {actionType === 'sell' && (
          <>
            {ticket.isForSale ? (
              <Button 
                variant="outline" 
                className="w-full border-ticket-purple hover:bg-ticket-purple/10"
                onClick={() => onCancelSale && onCancelSale(ticket.id)}
              >
                Cancel Sale
              </Button>
            ) : (
              <Button 
                className="w-full bg-ticket-gradient hover:bg-ticket-purple-dark"
                onClick={() => onSell && onSell(ticket.id)}
              >
                Sell Ticket
              </Button>
            )}
          </>
        )}
        
        {actionType === 'buy' && (
          <Button 
            className="w-full bg-ticket-gradient hover:bg-ticket-purple-dark"
            onClick={() => onBuy && ticket.resalePrice && onBuy(ticket.id, ticket.resalePrice)}
          >
            Buy for {ticket.resalePrice} ETH
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
