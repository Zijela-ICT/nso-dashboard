"use client";
import { CHPBRN_TOKEN } from "@/constants";
// src/app/page.tsx
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log(
      'localStorage.getItem("token")',
      localStorage.getItem(CHPBRN_TOKEN)
    );

    typeof window !== undefined &&
    window &&
    window?.localStorage.getItem(CHPBRN_TOKEN)
      ? redirect("/dashboard/home")
      : redirect("/login");
  }, []);
}
