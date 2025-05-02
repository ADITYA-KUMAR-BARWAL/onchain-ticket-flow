
import React from 'react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-10 z-0"></div>
      <div className="relative z-10">
        <Navbar />
        <main className="container max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-8 gradient-text">About BlockTix</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                BlockTix was created to solve the problems that plague traditional ticketing systems - fraud, scalping, and lack of transparency. 
                We've built a decentralized, tamper-proof solution that eliminates intermediaries and enhances ticket security through blockchain technology.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">The Problem</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Traditional ticket booking systems suffer from several critical issues:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Fake tickets that can't be easily verified</li>
                <li>Scalping through automated bots that buy tickets in bulk</li>
                <li>Lack of transparency in the resale market</li>
                <li>Unfair reselling practices leading to overpriced tickets</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                BlockTix leverages the power of blockchain technology and NFTs (Non-Fungible Tokens) to create a fair and transparent ticketing platform:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Issue tickets as NFTs - Each ticket is a unique, non-fungible token on the blockchain</li>
                <li>Organizer-controlled resale policy - Event organizers can set resale rules</li>
                <li>On-chain validation and transfer - Verify ticket ownership in real-time</li>
                <li>Dynamic pricing and resale rules - Prevent price gouging through smart contracts</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Technology</h2>
              <p className="text-gray-300 leading-relaxed">
                Our platform is built on the Ethereum blockchain, providing a secure and transparent infrastructure for ticket issuance, validation, and transfer. 
                Smart contracts handle all ticket transactions, ensuring that rules set by event organizers are automatically enforced, eliminating the need for third-party oversight.
              </p>
            </section>
          </div>
        </main>
        
        <footer className="py-6 text-center text-gray-400 text-sm">
          <p>© 2025 BlockTix. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
