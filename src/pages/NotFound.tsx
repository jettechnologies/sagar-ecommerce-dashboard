import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 Error</h1>
        <p className="text-gray-600 mb-8">Oops! Page not found.</p>
        <img src="/images/404.svg" alt="404 Illustration" className="w-80 mx-auto mb-8" />
        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Go back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
