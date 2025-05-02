
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface SellTicketFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (price: string) => void;
  title: string;
  loading: boolean;
}

export const SellTicketForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title,
  loading 
}: SellTicketFormProps) => {
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="price">Price in ETH</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !price}
              className="bg-ticket-gradient hover:bg-ticket-purple-dark"
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface IssueTicketFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, event: string, price: string) => void;
  loading: boolean;
}

export const IssueTicketForm = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading 
}: IssueTicketFormProps) => {
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, event, price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Issue New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Ticket Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VIP Pass"
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="event">Event Name</Label>
              <Input
                id="event"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="ETH Global Conference 2025"
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="ticketPrice">Price in ETH</Label>
              <Input
                id="ticketPrice"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading || !name || !event || !price}
              className="bg-ticket-gradient hover:bg-ticket-purple-dark"
            >
              {loading ? "Processing..." : "Issue Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
