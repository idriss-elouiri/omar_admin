import React from 'react';

const SuccessMessage = ({ message }) => {
  return (
    <div className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg" role="alert">
      <svg
        className="w-5 h-5 mr-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L9.5 11.086l6.793-6.793a1 1 0 011.414 0z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span>{message || "Action completed successfully!"}</span>
    </div>
  );
};

export default SuccessMessage;
