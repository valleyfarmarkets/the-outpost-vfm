import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import siteInfo from "@/data/site-info.json";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start">
          <MapPin className="mt-1 h-6 w-6 text-brand-primary" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            <address className="mt-2 text-sm not-italic text-gray-600">
              <p className="whitespace-pre-line">
                {siteInfo.contact.address.full ??
                  `${siteInfo.contact.address.street}\n${siteInfo.contact.address.city}, ${siteInfo.contact.address.state}, ${siteInfo.contact.address.zip}`}
              </p>
            </address>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start">
          <Phone className="mt-1 h-6 w-6 text-brand-primary" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
            <a
              href={`tel:${siteInfo.contact.phone}`}
              className="mt-2 block text-sm text-gray-600 hover:text-brand-primary"
            >
              {siteInfo.contact.phone}
            </a>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start">
          <Mail className="mt-1 h-6 w-6 text-brand-primary" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
            <a
              href={`mailto:${siteInfo.contact.email}`}
              className="mt-2 block text-sm text-gray-600 hover:text-brand-primary"
            >
              {siteInfo.contact.email}
            </a>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start">
          <Clock className="mt-1 h-6 w-6 text-brand-primary" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Hours</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              {siteInfo.hours.map((day) => (
                <div key={day.day} className="flex justify-between">
                  <span className="font-medium">{day.day}</span>
                  <span>
                    {day.closed ? "Closed" : `${day.open} - ${day.close}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
