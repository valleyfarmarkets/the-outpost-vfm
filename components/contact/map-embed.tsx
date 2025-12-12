import { Card } from "@/components/ui/card";
import siteInfo from "@/data/site-info.json";

export function MapEmbed() {
  const { lat, lng } = siteInfo.contact.address.coordinates;
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"}&q=${lat},${lng}&zoom=14`;

  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-video w-full">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="The Outpost VFM Location"
        />
      </div>
    </Card>
  );
}
