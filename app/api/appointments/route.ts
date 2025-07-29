import connectDB from "@/app/api/lib/connectDB";
import Appointment from "@/app/api/models/Appointment";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Customer from "@/app/api/models/Customer";

export async function GET() {
  await connectDB();

  try {
    const appointments = await Appointment.find({});
    return new Response(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return new Response("Failed to fetch appointments", { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { customerId, dateFrom } = body;

  try {
    if (!customerId || !dateFrom) {
      return new Response("Missing required fields: customerId or dateFrom", {
        status: 400,
      });
    }

    const existingAppointment = await Appointment.findOne({
      dateFrom: new Date(dateFrom),
    });

    if (existingAppointment) {
      return new Response("Appointment already exists.", {
        status: 409,
      });
    }

    const newAppointment = new Appointment({
      customer: customerId,
      dateFrom: new Date(dateFrom),
    });

    await newAppointment.save();

    const populatedAppointment = await newAppointment.populate("customer");

    return new Response(JSON.stringify(populatedAppointment), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return new Response("Failed to create appointment", { status: 500 });
  }
}
