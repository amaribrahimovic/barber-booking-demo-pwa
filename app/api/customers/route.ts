import connectDB from "@/app/api/lib/connectDB";
import Customer from "../models/Customer";

export async function GET() {
  await connectDB();

  try {
    const customers = await Customer.find({});
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new Response("Failed to fetch customers", { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { fullName, phoneNumber } = body;

  try {
    const newCustomer = new Customer({
      fullName,
      phoneNumber,
    });

    const existingCustomer = await Customer.findOne({
      phoneNumber,
    });

    if (existingCustomer) {
      return new Response("Customer already exists.", {
        status: 409,
      });
    }

    await newCustomer.save();

    return new Response(JSON.stringify(newCustomer), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return new Response("Failed to create customer", { status: 500 });
  }
}
