"use client";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { redirect, usePathname } from "next/navigation";

const Navigator = () => {
  const pathname = usePathname();

  const isBooking = pathname === "/" || pathname === "/booking";
  const isCustomers = pathname === "/customers";

  const handleBookingClick = () => {
    redirect("/booking");
  };

  const handleCustomersClick = () => {
    redirect("/customers");
  };

  return (
    <nav className="w-full flex rounded-t-md bg-[#1E1E1E] p-4">
      <div
        className="w-1/2 flex justify-center items-center border-r h-full"
        onClick={handleBookingClick}
      >
        <CalendarTodayIcon
          sx={{
            fontSize: "25px",
            color: isBooking ? "#1f7a1f" : "",
          }}
        />
      </div>
      <div
        className="w-1/2 flex justify-center items-center h-full"
        onClick={handleCustomersClick}
      >
        <PersonIcon
          sx={{
            fontSize: "32px",
            color: isCustomers ? "#1f7a1f" : "",
          }}
        />
      </div>
    </nav>
  );
};

export default Navigator;
