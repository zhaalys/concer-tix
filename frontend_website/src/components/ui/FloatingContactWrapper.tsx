"use client";

import { usePathname } from "next/navigation";
import FloatingContact from "./FloatingContact";

export default function FloatingContactWrapper() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;
  return <FloatingContact />;
}
