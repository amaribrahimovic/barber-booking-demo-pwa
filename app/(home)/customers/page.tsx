import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../../api/auth/authOptions";
import Customers from "@/app/(components)/Customers";

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <Customers />;
}
