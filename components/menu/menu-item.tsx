import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { DIETARY_TAGS } from "@/lib/constants";
import type { MenuItem as MenuItemType } from "@/types/menu";

interface MenuItemProps {
  item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
  return (
    <div className="flex justify-between border-b border-gray-200 py-4 last:border-0">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            {item.dietaryTags && item.dietaryTags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.dietaryTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      DIETARY_TAGS[tag].color as
                        | "green"
                        | "blue"
                        | "purple"
                        | "orange"
                    }
                  >
                    {DIETARY_TAGS[tag].label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <p className="ml-4 text-lg font-bold text-brand-primary">
            {formatPrice(item.price)}
          </p>
        </div>
        <p className="mt-2 text-sm text-gray-600">{item.description}</p>
        {!item.available && (
          <p className="mt-1 text-sm font-medium text-orange-600">
            Currently unavailable
          </p>
        )}
      </div>
    </div>
  );
}
