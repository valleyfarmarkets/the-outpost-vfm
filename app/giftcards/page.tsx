import { Store, CreditCard, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import siteInfo from "@/data/site-info.json";

export default function GiftCardsPage() {
  return (
    <section className="px-6 pt-40 pb-12">
      <Container>
        <div className="text-center">
          <h1 className="font-serif text-[clamp(48px,10vw,80px)] font-bold leading-[1.05] tracking-tight text-[#221F1F]">
            Gift Cards
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-gray-600">
            Give the gift of mountain dining and mountain getaways
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Card className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Perfect for Any Occasion
              </h2>
              <p className="mt-2 text-gray-600">
                Our gift cards can be used for dining at our restaurant or cabin
                rentals
              </p>
            </div>
          </Card>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card>
              <div className="flex items-start">
                <Store className="mt-1 h-8 w-8 text-brand-primary" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    In-Person Purchase
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Visit us at The Outpost VFM during business hours to
                    purchase gift cards. Available in any denomination.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="font-medium text-gray-900">Location:</p>
                    <p className="text-gray-600 whitespace-pre-line">
                      {siteInfo.contact.address.full ??
                        `${siteInfo.contact.address.street}\n${siteInfo.contact.address.city}, ${siteInfo.contact.address.state}, ${siteInfo.contact.address.zip}`}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start">
                <Globe className="mt-1 h-8 w-8 text-brand-primary" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Order Online
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Purchase digital gift cards online and have them delivered
                    instantly via email to you or your recipient.
                  </p>
                  <div className="mt-4">
                    <a
                      href="https://order.toasttab.com/egiftcards/valley-farm-outpost-10600-sunrise-highway"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 transition"
                    >
                      Purchase Gift Card
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-8 border-brand-primary/20 bg-brand-primary/5">
            <div className="flex items-start">
              <CreditCard className="mt-1 h-8 w-8 text-brand-primary" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  How to Use Your Gift Card
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Present your gift card when dining at our restaurant
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Apply gift card credit toward cabin rental bookings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>No expiration date on gift cards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Remaining balance can be used for future visits</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Questions about gift cards? Contact us at{" "}
              <a
                href={`mailto:${siteInfo.contact.email}`}
                className="text-brand-primary hover:underline"
              >
                {siteInfo.contact.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
