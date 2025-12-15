import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import siteInfo from "@/data/site-info.json";

export function HoursLocation() {
  return (
    <Section className="bg-gray-50">
      <Container>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <div className="flex items-start">
              <Clock className="mt-1 h-6 w-6 text-brand-primary" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">Hours</h2>
                <div className="mt-4 space-y-2">
                  {siteInfo.hours.map((day) => (
                    <div key={day.day} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {day.day}
                      </span>
                      <span className="text-gray-600">
                        {`${day.open} - ${day.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start">
              <MapPin className="mt-1 h-6 w-6 text-brand-primary" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                <address className="mt-4 text-sm not-italic text-gray-600">
                  <p className="whitespace-pre-line">
                    {siteInfo.contact.address.full ??
                      `${siteInfo.contact.address.street}\n${siteInfo.contact.address.city}, ${siteInfo.contact.address.state}, ${siteInfo.contact.address.zip}`}
                  </p>
                </address>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-brand-primary" />
                    <a
                      href={`tel:${siteInfo.contact.phone}`}
                      className="text-gray-600 hover:text-brand-primary"
                    >
                      {siteInfo.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-brand-primary" />
                    <a
                      href={`mailto:${siteInfo.contact.email}`}
                      className="text-gray-600 hover:text-brand-primary"
                    >
                      {siteInfo.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
