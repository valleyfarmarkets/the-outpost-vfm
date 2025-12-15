import { cn } from "@/lib/utils";

interface CarouselPaginationProps {
  totalSlides: number;
  selectedIndex: number;
  onDotClick: (index: number) => void;
}

const palette = {
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
};

export function CarouselPagination({
  totalSlides,
  selectedIndex,
  onDotClick,
}: CarouselPaginationProps) {
  return (
    <div className="mt-8 flex justify-center gap-3" role="tablist" aria-label="Cabin carousel navigation">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          role="tab"
          aria-label={`Go to slide ${index + 1}`}
          aria-selected={selectedIndex === index}
          className={cn(
            "rounded-full transition-all duration-300 ease-out",
            selectedIndex === index
              ? "h-3 w-3 shadow-lg hover:scale-110"
              : "h-2.5 w-2.5 border hover:scale-115 hover:opacity-100"
          )}
          style={
            selectedIndex === index
              ? {
                  background: `linear-gradient(to right, ${palette.deepRed}, ${palette.burntOrange})`,
                  boxShadow: `0 2px 8px rgba(177, 51, 48, 0.4)`,
                }
              : {
                  backgroundColor: `rgba(206, 124, 35, 0.3)`,
                  borderColor: `rgba(206, 124, 35, 0.5)`,
                }
          }
        />
      ))}
    </div>
  );
}
