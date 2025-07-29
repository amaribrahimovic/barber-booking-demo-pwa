"use client";

import { isNumber } from "./(other)/util";
import { Input, Button } from "@mui/joy";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import Loader from "@/app/(components)/Loader";
import Alert from "@/app/(components)/Alert";

export default function Home() {
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState<"success" | "danger">("success");

  const handleOnClick = async () => {
    const pinValue = pin.trim();

    if (pinValue.length === 4 && isNumber(pinValue)) {
      setLoading(true);
      const response = await signIn("credentials", {
        pin: pinValue,
        redirect: false,
      });

      if (response?.ok) {
        setLoading(false);
        redirect("/booking");
      } else {
        console.error("Error during sign-in:", response?.error);
        setLoading(false);
        setAlertText("Napačen PIN. Prosim, poskusite znova.");
        setAlertType("danger");
        setAlertOpen(true);
        setPin("");
      }
    }
  };

  const handleSetPin = (value: string) => {
    if (value === "" || (value.length <= 4 && isNumber(value))) {
      setPin(value);
    }
  };

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-4">
      <Input
        value={pin}
        onChange={(e) => handleSetPin(e.target.value)}
        placeholder="Vpiši PIN za vstop"
        variant="plain"
        className="w-10/12"
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
        className="w-10/12"
        size="lg"
        sx={{
          "--Button-minHeight": "48px",
          "--Button-paddingInline": "16px",
        }}
        onClick={handleOnClick}
      >
        Vstopi
      </Button>

      {loading ? <Loader /> : null}
      {alertOpen ? <Alert text={alertText} type={alertType} /> : null}
    </div>
  );
}
