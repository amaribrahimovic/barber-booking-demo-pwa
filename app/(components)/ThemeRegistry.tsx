"use client";

import * as React from "react";
import { CssBaseline, CssVarsProvider } from "@mui/joy";

interface Props {
  children: React.ReactNode;
}

export default function ThemeRegistry({ children }: Props) {
  return (
    <CssVarsProvider>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}
