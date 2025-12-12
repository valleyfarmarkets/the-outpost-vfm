import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NAV_LINKS } from "@/lib/constants";
import siteInfo from "@/data/site-info.json";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-3">
          <div>
            <Image
              src="/images/outpost_logo_2.svg"
              alt="The Outpost VFM"
              width={150}
              height={40}
              className="mb-4 h-8 w-auto"
            />
            <p className="text-sm text-gray-600">{siteInfo.tagline}</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-brand-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Contact Us
            </h3>
            <address className="text-sm not-italic text-gray-600">
              <p>{siteInfo.contact.address.street}</p>
              <p>
                {siteInfo.contact.address.city},{" "}
                {siteInfo.contact.address.state} {siteInfo.contact.address.zip}
              </p>
              <p className="mt-2">
                <a
                  href={`tel:${siteInfo.contact.phone}`}
                  className="hover:text-brand-primary"
                >
                  {siteInfo.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteInfo.contact.email}`}
                  className="hover:text-brand-primary"
                >
                  {siteInfo.contact.email}
                </a>
              </p>
            </address>

            <div className="mt-4 flex space-x-4">
              {siteInfo.social.facebook && (
                <a
                  href={siteInfo.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-brand-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {siteInfo.social.instagram && (
                <a
                  href={siteInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-brand-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} The Outpost VFM. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
