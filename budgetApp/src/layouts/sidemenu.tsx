import image from "../assets/usr.jfif";
import {
  LayoutDashboard,
  BanknoteArrowDown,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

export const SideMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      to: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Expense",
      to: "/expense",
      icon: <BanknoteArrowDown className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="flex flex-col items-center bg-[#ffffff] w-[16vw] py-6 shadow-md border-r-2 border-[#e5e5e5]">
      <img
        src={image}
        alt="Profile"
        className="h-[10vh] w-[10vh] rounded-full"
      />
      <h3 className="text-lg font-semibold mt-2">Hari</h3>

      <nav className="mt-8 flex flex-col gap-4 w-full px-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center justify-center text-[18px] p-[15px] transition-all  duration-200 rounded-[10px]
                ${isActive ? "bg-[#ad46ff] text-white" : "hover:bg-[#bdbdbd] hover:text-white border border-[#cacaca]"}
              `}
            >
              {item.icon}
              <span className="ml-4">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
