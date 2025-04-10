import React from 'react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl md:text-2xl text-gray-700 mb-8">Page not found</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
          Return to Home
        </button>
      </Link>
    </div>
  );
}