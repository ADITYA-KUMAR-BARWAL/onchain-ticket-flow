
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-10 z-0"></div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
        </main>
        <footer className="py-6 text-center text-gray-400 text-sm">
          <p>© 2025 BlockTix. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
