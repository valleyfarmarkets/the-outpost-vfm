import rawCabinsData from "@/data/cabins.json";
import reviewsData from "@/data/cabin-reviews.json";
import type { Cabin, CabinData, CabinReview, ReviewStats } from "@/types/cabins";

const cabinsData = rawCabinsData as CabinData;

/**
 * Get a specific cabin by its ID
 * @param id - The cabin ID to search for
 * @returns The cabin object or undefined if not found
 */
export function getCabinById(id: string): Cabin | undefined {
  return cabinsData.cabins.find((c) => c.id === id);
}

/**
 * Get reviews and statistics for a specific cabin
 * @param cabinId - The cabin ID to get reviews for
 * @returns Object containing reviews array and stats, or empty data if not found
 */
export function getReviewsForCabin(cabinId: string): {
  reviews: CabinReview[];
  stats: ReviewStats | null;
} {
  const data = reviewsData[cabinId as keyof typeof reviewsData];

  if (!data) {
    return {
      reviews: [],
      stats: null,
    };
  }

  return {
    reviews: data.reviews,
    stats: {
      averageRating: data.averageRating,
      totalReviews: data.totalReviews,
      breakdown: data.breakdown,
    },
  };
}

/**
 * Get all cabins
 * @returns Array of all cabin objects
 */
export function getAllCabins(): Cabin[] {
  return cabinsData.cabins;
}

/**
 * Get featured cabin
 * @returns The featured cabin or undefined if none is featured
 */
export function getFeaturedCabin(): Cabin | undefined {
  return cabinsData.cabins.find((cabin) => cabin.featured);
}
