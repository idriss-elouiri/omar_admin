import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import React from "react";
import { CiCirclePlus, CiCircleCheck } from "react-icons/ci";

const Sidebar = ({ showNav, onClose }) => {
  const router = useRouter(); // Initialize useRouter

  const isActive = (path) => router.pathname === path; // Check if the route matches

  return (
    <aside
      className={`fixed lg:relative z-50 lg:z-auto ${
        showNav ? "translate-x-0" : "-translate-x-full"
      } transform transition-transform duration-300 ease-in-out text-black min-h-screen w-56 bg-white py-4 pl-6 pr-0 border-r border-gray-300`}
    >
      {/* Close Button for Small Screens */}
      <button
        className="lg:hidden text-black text-2xl mb-4 focus:outline-none"
        onClick={onClose}
        aria-label="Close Sidebar"
      >
        &times;
      </button>

      <div className="flex items-center mb-8 gap-2">
        <Image
          src="/images/logo.png"
          alt="Upload Images"
          width={80}
          height={80}
          className="cursor-pointer"
        />
      </div>

      <nav className="space-y-4">
        <Link
          href="/add"
          className={`flex items-center gap-3 flex-row-reverse text-lg font-medium block p-2 rounded-md ${
            isActive("/add") ? "bg-blue-500 text-white" : "bg-[#ffebf5]"
          }`}
        >
          <Image
            src="/images/add_icon.png"
            alt="Upload Images"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          اضافة عنصر
        </Link>
        <Link
          href="/view-items"
          className={`flex items-center gap-3 flex-row-reverse text-lg font-medium block p-2 rounded-md ${
            isActive("/view-items") ? "bg-blue-500 text-white" : "bg-[#eaf4ff]"
          }`}
        >
          <Image
            src="/images/order_icon.png"
            alt="Upload Images"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          عرض العناصر
        </Link>
        <Link
          href="/orders"
          className={`flex items-center gap-3 flex-row-reverse text-lg font-medium block p-2 rounded-md ${
            isActive("/orders") ? "bg-blue-500 text-white" : "bg-[#eaf4ff]"
          }`}
        >
          <Image
            src="/images/order_icon.png"
            alt="Upload Images"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          عرض الطلبات
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
