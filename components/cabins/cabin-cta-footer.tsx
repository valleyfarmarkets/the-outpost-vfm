import {
  Star,
  Shield,
  Clock,
  Phone,
  Award,
  Heart,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import reviewsData from "@/data/cabin-reviews.json";
import cabinsData from "@/data/cabins.json";

const iconMap = {
  Shield,
  Clock,
  Phone,
  Award,
  Heart,
  CheckCircle,
};

// Calculate overall stats from all cabin reviews
function getOverallStats() {
  const cabinKeys = Object.keys(reviewsData) as Array<keyof typeof reviewsData>;
  let totalReviews = 0;
  let totalRatingSum = 0;

  cabinKeys.forEach((key) => {
    const cabin = reviewsData[key];
    totalReviews += cabin.totalReviews;
    totalRatingSum += cabin.averageRating * cabin.totalReviews;
  });

  const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
  };
}

// Get sample reviews from multiple cabins
function getHighlightReviews() {
  const cabinKeys = Object.keys(reviewsData) as Array<keyof typeof reviewsData>;
  const allReviews: Array<{
    rating: number;
    snippet: string;
    author: string;
    cabin: string;
  }> = [];

  cabinKeys.forEach((key) => {
    const cabin = reviewsData[key];
    cabin.reviews.slice(0, 1).forEach((review) => {
      allReviews.push({
        rating: review.rating,
        snippet: review.comment,
        author: review.author.name,
        cabin: key,
      });
    });
  });

  return allReviews.slice(0, 3);
}

const trustSignals = [
  {
    icon: "Shield",
    label: "100% Secure Booking",
    description: "Your payment information is protected and secure",
  },
  {
    icon: "Clock",
    label: "24/7 Guest Support",
    description: "We're here to help anytime during your stay",
  },
  {
    icon: "Award",
    label: "Best Price Guarantee",
    description: "Find a lower price? We'll match it",
  },
];

export function CabinCTAFooter() {
  const stats = getOverallStats();
  const highlights = getHighlightReviews();

  return (
    <section className="relative bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Reviews Snippet */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(stats.averageRating)
                    ? "fill-brand-sunflower text-brand-sunflower"
                    : "text-white/40"
                }`}
              />
            ))}
          </div>
          <p className="text-xl font-semibold mb-1">
            {stats.averageRating} out of 5 stars
          </p>
          <p className="text-white/90">
            Based on {stats.totalReviews} verified guest reviews
          </p>
        </div>

        {/* Featured Reviews */}
        <div className="grid gap-6 md:grid-cols-3 mb-12 max-w-5xl mx-auto">
          {highlights.map((review, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-brand-sunflower text-brand-sunflower"
                  />
                ))}
              </div>
              <p className="text-white/95 text-sm leading-relaxed mb-3 line-clamp-4">
                &ldquo;{review.snippet}&rdquo;
              </p>
              <p className="text-white/80 text-xs font-medium">
                — {review.author}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12 max-w-4xl mx-auto">
          {trustSignals.map((signal, index) => {
            const IconComponent =
              iconMap[signal.icon as keyof typeof iconMap] || CheckCircle;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <IconComponent className="h-6 w-6 text-brand-sunflower" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{signal.label}</h4>
                  <p className="text-sm text-white/80 mt-1">
                    {signal.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Book Your Mountain Escape?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Experience the beauty of Mount Laguna from the comfort of your own
            cabin. Book now or call us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={cabinsData.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-white text-brand-primary hover:bg-white/90 hover:text-brand-primary/90 font-semibold shadow-xl w-full sm:w-auto"
              >
                Book Your Stay Now
              </Button>
            </a>
            <a href={`tel:${cabinsData.bookingPhone}`}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold w-full sm:w-auto"
              >
                <Phone className="mr-2 h-5 w-5" />
                {cabinsData.bookingPhone}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
