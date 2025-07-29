import connectDB from "@/app/api/lib/connectDB";
import { toLjubljanaTime } from "@/app/(other)/util";
import Appointment from "../../models/Appointment";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Customer from "@/app/api/models/Customer";

export async function POST(req: Request): Promise<Response> {
  await connectDB();

  const body = await req.json();
  const { date } = body;

  try {
    if (!date) {
      return new Response("Missing required fields: date", {
        status: 400,
      });
    }

    const normalizedDate = toLjubljanaTime(new Date(date));

    const appointments = await Appointment.find({
      dateFrom: {
        $gte: normalizedDate.startOf("day").toDate(),
        $lt: normalizedDate.endOf("day").toDate(),
      },
    }).populate("customer");

    return new Response(JSON.stringify(appointments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching date's appointments:", error);
    return new Response("Failed to fetch date's appointment", { status: 500 });
  }
}
