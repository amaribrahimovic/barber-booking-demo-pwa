"use client";

import Modal from "@mui/joy/Modal";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import Loader from "./Loader";
import "./customCalendar.css";
import CustomerAutocomplete from "./CustomerAutocomplete";
import { Button } from "@mui/joy";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Alert from "./Alert";

dayjs.extend(utc);

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "#121212",
  border: "1px solid #1F7A1F",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  color: "#fff",
};

interface Appointment {
  _id: string;
  customer: Customer;
  dateFrom: string;
  dateTo: string;
}

interface CalendarAppointment {
  _id: string;
  customer: Customer;
  start: string;
  end: string;
}

interface Customer {
  fullName: string;
  phoneNumber: string;
}

const Calendar = () => {
  const [open, setOpen] = useState(false);

  const calendarRef = useRef<FullCalendar | null>(null);

  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);

  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState<"success" | "danger">("success");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [eventStartTime, setEventStartTime] = useState<Date | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);

    if (calendarRef && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();

      const response = await axios.post(`${backendUrl}/appointments/date`, {
        date: currentDate.toISOString(),
      });

      console.log(response.status);

      if (response.status === 200) {
        const appointments = response.data;

        const formattedAppointments = appointments.map(
          (appointment: Appointment) => {
            return {
              _id: appointment._id,
              customer: appointment.customer,
              start: appointment.dateFrom,
              end: appointment.dateTo,
            };
          }
        );

        setAppointments(formattedAppointments);
      }
    }
    setLoading(false);
  };

  const addAppointment = async () => {
    if (!eventStartTime || !customerId) {
      setLoading(false);
      setAlertText("Prosimo, izberite datum in stranko.");
      setAlertType("danger");
      setAlertOpen(true);
      return;
    }

    handleClose();
    setLoading(true);

    const response = await axios.post(`${backendUrl}/appointments`, {
      customerId,
      dateFrom: eventStartTime,
    });

    if (response.status === 201) {
      setAppointments([
        ...appointments,
        {
          _id: response.data._id,
          customer: response.data.customer,
          start: response.data.dateFrom,
          end: response.data.dateTo,
        },
      ]);
      setAlertText("Termin uspešno dodan.");
      setAlertType("success");
      setAlertOpen(true);
    } else {
      setLoading(false);
      setAlertText("Napaka pri dodajanju termina.");
      setAlertType("danger");
      setAlertOpen(true);
      return;
    }

    setEventStartTime(null);
    setCustomerId(null);
    setLoading(false);
  };

  const deleteAppointment = async () => {
    const eventId = selectedEvent.event.extendedProps._id;

    setLoading(true);
    setSelectedEvent(null);
    const response = await axios.delete(
      `${backendUrl}/appointments/${eventId}`
    );
    if (response.status === 200) {
      setAppointments(
        appointments.filter((appointment) => appointment._id !== eventId)
      );
      setLoading(false);
      setAlertText("Termin uspešno izbrisan.");
      setAlertType("success");
      setAlertOpen(true);
    } else {
      setLoading(false);
      setAlertText("Napaka pri brisanju termina.");
      setAlertType("danger");
      setAlertOpen(true);
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEventStartTime(null);
  };

  const handleSelect = (selectionInfo) => {
    const startTime = selectionInfo.dateStr;

    setEventStartTime(startTime);
    handleOpen();
  };

  const renderDayHeader = (arg) => {
    const dayNumber = arg.date.getDate().toString().padStart(2, "0");
    let weekdayName = arg.date.toLocaleDateString(undefined, {
      weekday: "long",
    });

    switch (weekdayName) {
      case "Monday":
        weekdayName = "Ponedeljek";
        break;
      case "Tuesday":
        weekdayName = "Torek";
        break;
      case "Wednesday":
        weekdayName = "Sreda";
        break;
      case "Thursday":
        weekdayName = "Četrtek";
        break;
      case "Friday":
        weekdayName = "Petek";
        break;
      case "Saturday":
        weekdayName = "Sobota";
        break;
      case "Sunday":
        weekdayName = "Nedelja";
        break;
    }

    return (
      <div style={{ textAlign: "left" }}>
        <p>{dayNumber}</p>
        <p>{weekdayName}</p>
      </div>
    );
  };

  const renderSlotLabel = (arg) => {
    const hours = arg.date.getHours();
    const minutes = arg.date.getMinutes();

    const formattedHours = hours.toString();
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return (
      <div style={{ textAlign: "center" }}>
        {formattedHours}.{formattedMinutes}
      </div>
    );
  };

  const renderEventContent = (eventInfo) => {
    return (
      <Box className="already-booked">
        <Typography level="h4" className="!text-white">
          {eventInfo.event.extendedProps.customer.fullName} -{" "}
          {eventInfo.event.extendedProps.customer.phoneNumber}
        </Typography>
      </Box>
    );
  };

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      calendarApi.gotoDate(dayjs(currentDate).add(1, "day").toDate());
    }
  };

  const handleNext7 = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      calendarApi.gotoDate(dayjs(currentDate).add(7, "day").toDate());
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      calendarApi.gotoDate(dayjs(currentDate).subtract(1, "day").toDate());
    }
  };

  const handlePrev7 = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      calendarApi.gotoDate(dayjs(currentDate).subtract(7, "day").toDate());
    }
  };

  return (
    <>
      <Box className="w-full flex flex-col justify-between items-start">
        <Box className="flex w-full">
          <Box className="w-full">
            <Box className="flex justify-between items-center mb-2">
              <Box className="flex items-center gap-2">
                <Button onClick={handlePrev} color="success">
                  <ArrowBackIos />
                </Button>
                <Button
                  onClick={handlePrev7}
                  startDecorator={<ArrowBackIos />}
                  color="success"
                >
                  7
                </Button>
              </Box>
              <Box className="flex items-center gap-2">
                <Button
                  onClick={handleNext7}
                  endDecorator={<ArrowForwardIos />}
                  color="success"
                >
                  7
                </Button>
                <Button onClick={handleNext} color="success">
                  <ArrowForwardIos />
                </Button>
              </Box>
            </Box>
            <FullCalendar
              dateClick={handleSelect}
              initialView={"timeGridDay"}
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              allDaySlot={false}
              slotDuration="00:20:00"
              selectable={true}
              select={handleSelect}
              headerToolbar={{
                left: "",
                center: "",
                right: "",
              }}
              themeSystem="standard"
              height="auto"
              slotMinTime={"06:00:00"}
              slotMaxTime={"24:00:00"}
              dayHeaderContent={renderDayHeader}
              slotLabelContent={renderSlotLabel}
              events={appointments}
              eventContent={renderEventContent}
              eventClick={(eventInfo) => {
                setSelectedEvent(eventInfo);
              }}
              eventClassNames={(eventInfo) => {
                return eventInfo.event.title === "IT Support"
                  ? "it-support-event"
                  : "";
              }}
              firstDay={1}
              ref={calendarRef}
              datesSet={fetchAppointments}
            />
          </Box>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="z-40"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            level="h2"
            sx={{ color: "#1f7a1f", mb: 2 }}
          >
            Dodaj termin
          </Typography>
          <Box className="flex flex-col gap-4">
            <Box className="flex flex-col gap-2">
              <Typography level="body-md" sx={{ color: "#fff" }}>
                Izbran datum in čas:
              </Typography>
              <input
                value={
                  eventStartTime
                    ? dayjs(eventStartTime).format("DD.MM.YYYY ob HH:mm")
                    : ""
                }
                className="p-2 rounded bg-gray-800 text-white"
                readOnly
              />
              <CustomerAutocomplete
                onSelect={(customer) => {
                  if (customer) setCustomerId(customer._id);
                }}
              />
            </Box>
            <Box className="flex justify-end">
              <button
                onClick={addAppointment}
                className="bg-[#1F7A1F] text-white px-4 py-2 rounded w-full cursor-pointer"
              >
                Dodaj
              </button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {selectedEvent ? (
        <Modal
          open={true}
          onClose={() => setSelectedEvent(null)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="z-40"
        >
          <Box sx={modalStyle}>
            <Typography
              id="modal-modal-title"
              level="h2"
              sx={{ color: "#1F7A1F", mb: 2 }}
            >
              Podrobnosti termina
            </Typography>
            <Box className="flex flex-col gap-4">
              <Box className="flex flex-col gap-2">
                <Typography level="body-md" sx={{ color: "#fff" }}>
                  Stranka:
                </Typography>
                <input
                  value={
                    selectedEvent.event.extendedProps.customer.fullName +
                    " - " +
                    selectedEvent.event.extendedProps.customer.phoneNumber
                  }
                  className="p-2 rounded bg-gray-800 text-white"
                  readOnly
                />
                <Typography level="body-md" sx={{ color: "#fff" }}>
                  Datum in čas:
                </Typography>
                <input
                  value={dayjs(selectedEvent.event.start).format(
                    "DD.MM.YYYY ob HH:mm"
                  )}
                  className="p-2 rounded bg-gray-800 text-white mb-2"
                  readOnly
                />
                <Button
                  variant="solid"
                  color="danger"
                  onClick={() => {
                    deleteAppointment();
                  }}
                  className="w-full"
                >
                  Izbriši termin
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      ) : null}

      {loading ? <Loader /> : null}
      {alertOpen ? <Alert text={alertText} type={alertType} /> : null}
    </>
  );
};

export default Calendar;
