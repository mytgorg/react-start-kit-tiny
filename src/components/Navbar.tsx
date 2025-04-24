
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-soft-gray p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-dark-purple">
          MyApp
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-neutral-gray hover:text-primary-purple">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
