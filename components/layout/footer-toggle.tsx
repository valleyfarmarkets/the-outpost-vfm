"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function FooterToggle() {
  const pathname = usePathname();

  // Hide footer on the cabins landing page; show everywhere else.
  if (pathname === "/cabins") {
    return null;
  }

  return <Footer />;
}
