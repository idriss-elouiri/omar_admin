const TopNavbar = ({ onMenuClick }) => {
  return (
    <header className="flex justify-between items-center px-4 py-3 sm:px-6 shadow-md border-b border-gray-300 bg-white">
      {/* Mobile Menu Button */}
      <button
        className="text-black text-2xl lg:hidden"
        onClick={onMenuClick}
        aria-label="Open Menu"
      >
        ☰
      </button>
      <h1 className="text-lg font-semibold text-black">لوحة التحكم</h1>
      <button className="text-sm font-semibold text-white bg-black px-4 py-2 rounded-full">
        تسجيل الخروج
      </button>
    </header>
  );
};

export default TopNavbar;
