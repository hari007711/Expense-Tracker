import { Outlet } from "@tanstack/react-router";
import { SideMenu } from "../layouts/sidemenu";
import Navbar from "@/layouts/navbar";
import "../index.css";
import { Toaster } from "@/components/ui/sonner";

export function RootComponent() {
  return (
    <div className="h-screen overflow-hidden bg-gray-200 ">
      <Navbar />
      <div className="flex flex-row mt-0 h-screen">
        <div className="bg-[#fff]-500 overflow-auto scrollbar-thin w-1/6 flex text-center font-[serif] w-[19.5vw]">
          <SideMenu />
        </div>
        <main className="flex bg-grey-50 p-4 h-[91vh] overflow-y-scroll scrollbar-thin w-full">
          <Outlet />
          <Toaster position="top-center" richColors />
        </main>
      </div>
    </div>
  );
}
