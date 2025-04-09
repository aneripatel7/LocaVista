import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const ProfileDropdown = ({ role = "User", onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* User Icon */}
      <FaUserCircle size={28} className="cursor-pointer" />

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border z-50">
          <div className="px-4 py-2 text-center font-semibold border-b">
            {role}
          </div>
          <button
            onClick={onLogout}
            className="w-full text-red-600 hover:bg-red-50 px-4 py-2 text-center"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
