import { NextRequest, NextResponse } from "next/server";
import Appointment from "../../models/Appointment";

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const id = url.pathname.split("/").pop();

//   if (!id || isNaN(Number(id))) {
//     return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
//   }

//   const customer = await Customer.findById(id);

//   if (!customer) {
//     return NextResponse.json({ error: "Customer not found" }, { status: 404 });
//   }

//   return NextResponse.json({ customer }, { status: 200 });
// }

// export async function PUT(req: NextRequest) {
//   const url = new URL(req.url);
//   const id = url.pathname.split("/").pop();

//   if (!id || isNaN(Number(id))) {
//     return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
//   }

//   const body = await req.json();
//   const { fullName, phoneNumber } = body;

//   try {
//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       id,
//       { fullName, phoneNumber },
//       { new: true }
//     );

//     if (!updatedCustomer) {
//       return NextResponse.json(
//         { error: "Customer not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ customer: updatedCustomer }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating customer:", error);
//     return NextResponse.json(
//       { error: "Failed to update customer" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "Invalid appointment ID" },
      { status: 400 }
    );
  }

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
