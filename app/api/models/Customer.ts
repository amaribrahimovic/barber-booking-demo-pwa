import mongoose, { Schema, models, model, Document } from "mongoose";

// Define TypeScript interface for the schema
interface ICustomer extends Document {
  fullName: string;
  phoneNumber: string;
}

// Define schema with interface
const CustomerSchema = new Schema<ICustomer>(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Customer =
  (models.Customer as mongoose.Model<ICustomer>) ||
  model<ICustomer>("Customer", CustomerSchema);

export default Customer;
