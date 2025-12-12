import { Card } from "@/components/ui/card";
import { MenuItem } from "./menu-item";
import type { MenuCategory as MenuCategoryType } from "@/types/menu";

interface MenuCategoryProps {
  category: MenuCategoryType;
}

export function MenuCategory({ category }: MenuCategoryProps) {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
        {category.description && (
          <p className="mt-2 text-sm text-gray-600">{category.description}</p>
        )}
      </div>
      <Card>
        <div className="divide-y divide-gray-200">
          {category.items.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </Card>
    </div>
  );
}
