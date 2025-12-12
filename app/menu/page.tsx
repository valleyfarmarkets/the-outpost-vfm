import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { MenuCategory } from "@/components/menu/menu-category";
import rawMenuData from "@/data/menu.json";
import type { DietaryTag, MenuData } from "@/types/menu";

const menuData: MenuData = {
  ...rawMenuData,
  categories: rawMenuData.categories.map((category) => ({
    ...category,
    items: category.items.map((item) => ({
      ...item,
      dietaryTags: item.dietaryTags as DietaryTag[] | undefined,
    })),
  })),
};

export default function MenuPage() {
  const sortedCategories = [...menuData.categories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <Section>
      <Container>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Menu
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Delicious mountain-inspired cuisine made with fresh, locally-sourced
            ingredients
          </p>
        </div>

        <div className="mt-12">
          {sortedCategories.map((category) => (
            <MenuCategory key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">
            Menu items and prices subject to change. Last updated:{" "}
            {new Date(menuData.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </Container>
    </Section>
  );
}
