
import SettingsComp from "@/components/Dashboard/settings";

const Navbar = () => {

  return (
    <div className="flex items-center justify-between bg-white p-[15px] border-b-2 border-[#e5e5e5]">
      <div>
        <h2 className="text-[20px] font-bold">Expense Tracker</h2>
      </div>
      <div className="h-[22px]">
        <SettingsComp />
      </div>
    </div>
  );
};

export default Navbar;
