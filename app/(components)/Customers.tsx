"use client";
import { useEffect, useState } from "react";
import { Box, Button, Input, Modal, Sheet, Typography } from "@mui/joy";
import { isNumber } from "@/app/(other)/util";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "@/app/(components)/Loader";
import Alert from "@/app/(components)/Alert";

const style = {
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

export interface Customer {
  _id: string;
  fullName: string;
  phoneNumber: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState<"success" | "danger">("success");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        setAlertText(
          "Napaka pri pridobivanju strank. Prosim, poskusite znova."
        );
        setAlertType("danger");
        setAlertOpen(true);
        return;
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setAlertText("Napaka pri pridobivanju strank. Prosim, poskusite znova.");
      setAlertType("danger");
      setAlertOpen(true);
    }
    setLoading(false);
  };

  const addCustomer = async () => {
    if (!fullName || !phoneNumber) {
      setAlertText("Vsa polja so obvezna.");
      setAlertType("danger");
      setAlertOpen(true);
      return;
    }
    if (!isNumber(phoneNumber)) {
      setAlertText("Telefonska številka mora vsebovati samo številke.");
      setAlertType("danger");
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, phoneNumber }),
      });
      if (!response.ok) {
        setAlertText("Napaka pri dodajanju stranke. Prosim, poskusite znova.");
        setAlertType("danger");
        setAlertOpen(true);
        return;
      }
      const data = await response.json();
      setCustomers((prevCustomers) => [...prevCustomers, data]);
      setFullName("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error adding customer:", error);
      setAlertText("Napaka pri dodajanju stranke. Prosim, poskusite znova.");
      setAlertType("danger");
      setAlertOpen(true);
    }
    setLoading(false);
  };

  const deleteCustomer = async (customerId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setAlertText("Napaka pri brisanju stranke. Prosim, poskusite znova.");
        setAlertType("danger");
        setAlertOpen(true);
        return;
      }
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );
    } catch (error) {
      console.error("Error deleting customer:", error);
      setAlertText("Napaka pri brisanju stranke. Prosim, poskusite znova.");
      setAlertType("danger");
      setAlertOpen(true);
      return;
    }
    setLoading(false);
  };

  const onPhoneNumberChange = (phoneNumber: string) => {
    if (isNumber(phoneNumber) || " ") setPhoneNumber(phoneNumber);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  return (
    <div>
      <Typography level="h2" className="text-center !text-foreground">
        Stranke
      </Typography>
      <div className="flex flex-col gap-4 my-4">
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ime in priimek"
          variant="plain"
          className="w-full"
          size="lg"
          sx={{
            "--Input-focusedThickness": "0px",
            "--Input-focusedState": "0px",
            "--Input-placeholderColor": "var(--joy-palette-neutral-500)",
          }}
        />
        <Input
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="Telefonska številka"
          variant="plain"
          className="w-full"
          size="lg"
          sx={{
            "--Input-focusedThickness": "0px",
            "--Input-focusedState": "0px",
            "--Input-placeholderColor": "var(--joy-palette-neutral-500)",
          }}
        />
        <Button
          variant="solid"
          color="success"
          onClick={() => addCustomer()}
          className="w-full"
        >
          Dodaj stranko
        </Button>
      </div>

      {customers?.length > 0 ? (
        <div className="flex flex-col gap-2">
          {customers.map((customer: Customer) => (
            <Sheet
              color="success"
              variant="solid"
              className="p-4 flex items-center justify-between rounded-md"
              key={customer._id}
            >
              <Typography className="!text-foreground">
                {customer.fullName} - {customer.phoneNumber}
              </Typography>
              <DeleteIcon
                className="cursor-pointer ml-2"
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setSelectedCustomerId(customer._id);
                }}
              />
            </Sheet>
          ))}
        </div>
      ) : (
        <p>Ni strank.</p>
      )}

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="plain"
            component="h2"
            className="!text-foreground"
          >
            Ali ste prepričani, da želite izbrisati stranko?
          </Typography>
          <Box className="flex justify-end mt-4">
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setIsDeleteModalOpen(false)}
              className="mr-2"
            >
              Prekliči
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={() => {
                if (selectedCustomerId) {
                  deleteCustomer(selectedCustomerId);
                }
                setIsDeleteModalOpen(false);
              }}
            >
              Izbriši
            </Button>
          </Box>
        </Box>
      </Modal>

      {loading ? <Loader /> : null}
      {alertOpen ? <Alert text={alertText} type={alertType} /> : null}
    </div>
  );
};

export default Customers;
