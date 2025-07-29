import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../../api/auth/authOptions";
import Calendar from "@/app/(components)/Calendar";
import { Typography } from "@mui/joy";

export default async function Booking() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography level="h2" className="text-center !text-foreground">
        Termini
      </Typography>
      <Calendar />
    </div>
  );
}
