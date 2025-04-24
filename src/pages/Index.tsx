
import React from 'react';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-dark-purple">
          Welcome to Your Minimal App
        </h1>
        <p className="text-xl text-neutral-gray mb-8">
          A clean, simple starting point for your next great idea.
        </p>
        <div className="inline-flex space-x-4">
          <button className="bg-primary-purple text-white px-6 py-3 rounded-lg hover:bg-secondary-purple transition-colors">
            Get Started
          </button>
          <button className="bg-soft-gray text-dark-purple px-6 py-3 rounded-lg hover:bg-light-purple transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
