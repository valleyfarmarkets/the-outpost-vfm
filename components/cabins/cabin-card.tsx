'use client';

import { Users, Bed, Bath, Flame, PawPrint, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useBookingContext } from "@/context/booking-context";
import type { Cabin } from "@/types/cabins";
import { getAmenityIcon } from "@/lib/amenity-icons";

interface CabinCardProps {
  cabin: Cabin;
  featured?: boolean;
}

export function CabinCard({ cabin, featured = false }: CabinCardProps) {
  const bookingEnabled = process.env.NEXT_PUBLIC_ENABLE_GUESTY_BOOKING === 'true';
  const { actions } = useBookingContext();
  return (
    <Card hover>
      <div>
        {/* Header with Badges */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-2xl font-bold text-gray-900">{cabin.name}</h3>
          <div className="flex flex-wrap gap-2">
            {featured && (
              <Badge variant="orange" className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                Featured
              </Badge>
            )}
            {cabin.personalityTag && (
              <Badge variant="blue">{cabin.personalityTag}</Badge>
            )}
          </div>
        </div>

        {/* Icons for Pet-Friendly and Fireplace */}
        {(cabin.petFriendly || cabin.hasFireplace) && (
          <div className="flex gap-3 mb-2">
            {cabin.petFriendly && (
              <div className="flex items-center gap-1 text-sm text-brand-primary">
                <PawPrint className="h-4 w-4" />
                <span className="font-medium">Pet-Friendly</span>
              </div>
            )}
            {cabin.hasFireplace && (
              <div className="flex items-center gap-1 text-sm text-brand-accent">
                <Flame className="h-4 w-4" />
                <span className="font-medium">Fireplace</span>
              </div>
            )}
          </div>
        )}

        <p className="mt-2 text-sm text-gray-600">{cabin.description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="mr-1.5 h-4 w-4 text-brand-primary" />
            <span>Sleeps {cabin.capacity}</span>
          </div>
          <div className="flex items-center">
            <Bed className="mr-1.5 h-4 w-4 text-brand-primary" />
            <span>
              {cabin.bedrooms} Bedroom{cabin.bedrooms > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center">
            <Bath className="mr-1.5 h-4 w-4 text-brand-primary" />
            <span>
              {cabin.bathrooms} Bathroom{cabin.bathrooms > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {cabin.amenities.slice(0, 5).map((amenity) => {
            const Icon = getAmenityIcon(amenity.icon);
            return (
              <span
                key={amenity.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                <Icon className="h-3.5 w-3.5" />
                {amenity.label}
              </span>
            );
          })}
          {cabin.amenities.length > 5 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              +{cabin.amenities.length - 5} more
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Price Range</p>
            <p className="text-xl font-bold text-brand-primary">
              {formatPrice(cabin.priceRange.min)} -{" "}
              {formatPrice(cabin.priceRange.max)}
            </p>
            <p className="text-xs text-gray-500">per {cabin.priceRange.unit}</p>
          </div>
          <Button
            onClick={() => actions.openBooking(cabin)}
            disabled={!bookingEnabled}
          >
            {bookingEnabled ? 'Book Now' : 'Booking Unavailable'}
          </Button>
        </div>

        {!bookingEnabled && (
          <p className="mt-2 text-xs text-gray-600">
            Online booking is disabled in this environment.
          </p>
        )}

        {!cabin.available && (
          <div className="mt-4 rounded-md bg-orange-50 p-3">
            <p className="text-sm font-medium text-orange-800">
              Currently unavailable for booking
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
