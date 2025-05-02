
import React from 'react';
import { Ticket, ShoppingBag, Wallet } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Ticket className="h-10 w-10 text-ticket-purple" />,
      title: "NFT Tickets",
      description: "Each ticket is a unique, non-fungible token (NFT) on the blockchain, ensuring authenticity and preventing counterfeits."
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-ticket-purple" />,
      title: "Controlled Resale",
      description: "Event organizers can set resale rules to prevent scalping, ensuring fair pricing for secondary sales."
    },
    {
      icon: <Wallet className="h-10 w-10 text-ticket-purple" />,
      title: "Secure Ownership",
      description: "Real-time validation and transfer on the blockchain ensures that ticket ownership is always verifiable and secure."
    }
  ];

  return (
    <div className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Platform Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm hover:border-ticket-purple transition-all"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
