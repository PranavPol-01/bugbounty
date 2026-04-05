"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#111827",
          color: "#fff",
          borderRadius: "12px",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#22C55E", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#EF4444", secondary: "#fff" },
        },
      }}
    />
  );
}
