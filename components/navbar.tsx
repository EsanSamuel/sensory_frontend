import React from "react";
import { Button } from "./ui/button";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        ES
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <a href="#work" className="text-gray-600 hover:text-gray-900 transition-colors">Work</a>
        <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
        <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
      </div>
    </div>
  </nav>
);

export default Navbar;
