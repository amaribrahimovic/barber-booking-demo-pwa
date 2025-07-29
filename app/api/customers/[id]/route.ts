import { NextRequest, NextResponse } from "next/server";
import Customer from "../../models/Customer";
import Appointment from "../../models/Appointment";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
  }

  const customer = await Customer.findById(id);

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ customer }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
  }

  const body = await req.json();
  const { fullName, phoneNumber } = body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { fullName, phoneNumber },
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer: updatedCustomer }, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
  }

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    const deletedAppointments = await Appointment.deleteMany({
      customer: id,
    });

    if (deletedAppointments.deletedCount > 0) {
      console.log(
        `Deleted ${deletedAppointments.deletedCount} appointments for customer ${id}`
      );
    }

    if (!deletedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
