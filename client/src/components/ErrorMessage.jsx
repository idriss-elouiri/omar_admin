import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg" role="alert">
      <svg
        className="w-5 h-5 mr-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.366-.778 1.42-.778 1.786 0l6.857 14.143c.334.689-.115 1.458-.893 1.458H2.293c-.778 0-1.227-.77-.893-1.458L8.257 3.1zm.743 4.401a.75.75 0 00-1.5 0v3.25a.75.75 0 001.5 0V7.5zm-.75 6a.875.875 0 100 1.75.875.875 0 000-1.75z"
          clipRule="evenodd"
        ></path>
      </svg>
      <span>{message || "An error occurred. Please try again."}</span>
    </div>
  );
};

export default ErrorMessage;
