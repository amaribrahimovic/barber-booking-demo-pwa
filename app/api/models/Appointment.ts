import mongoose, { Schema, models, model, Document } from "mongoose";
import "./Customer";

interface IAppointment extends Document {
  dateFrom: Date;
  dateTo: Date;
  customer: mongoose.Types.ObjectId;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
      default: function () {
        return new Date(this.dateFrom.getTime() + 20 * 60 * 1000);
      },
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment =
  (models.Appointments as mongoose.Model<IAppointment>) ||
  model<IAppointment>("Appointments", AppointmentSchema);

export default Appointment;
