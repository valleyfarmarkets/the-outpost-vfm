import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-brand-primary">
              The Outpost VFM
            </span>
          </Link>

          <Navigation className="hidden lg:flex" />

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
