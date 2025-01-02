"use client";
// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      redirect("/dashboard/reports");
    }
  }
  redirect("/login");
}
