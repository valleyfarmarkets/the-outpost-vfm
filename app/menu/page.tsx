"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Snowflake,
  Star,
  ExternalLink,
  UtensilsCrossed,
  Drumstick,
  Leaf,
  Pizza,
} from "lucide-react";
import rawMenuData from "@/data/menu.json";
import type { MenuData, DietaryTag } from "@/types/menu";

const colors = {
  charcoal: "#221F1F",
  deepRed: "#B13330",
  burntOrange: "#CE7C23",
  goldenAmber: "#DE9A2E",
  brightGold: "#F9AC30",
  cream: "#FAF8F5",
  warmWhite: "#FFFDF9",
  textMuted: "#6B6966",
  lightGray: "#E8E4DE",
};

const menuData: MenuData = rawMenuData as MenuData;

const seasonalItems = {
  title: "Winter Warmers",
  subtitle: "Seasonal favorites to warm your soul",
  items: [
    {
      id: "s1",
      name: "Cowboy Chili",
      description:
        "Hearty beef & bean chili with smoked brisket burnt ends, topped with cheddar, sour cream & green onions. Served with cornbread.",
      price: 14,
      tags: ["Hearty", "Staff Pick"],
      image:
        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=80",
    },
    {
      id: "s2",
      name: "Tomato Basil Soup",
      description:
        "Creamy roasted tomato soup with fresh basil and a grilled cheese dipper. Pure comfort.",
      price: 10,
      tags: ["Vegetarian"],
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    },
  ],
};

const monthlySpecial = {
  title: "December Special",
  name: "The Holiday Platter",
  description:
    "Feeds 4-6. Smoked turkey breast, honey-glazed ham, cranberry jalapeno glaze, all the sides, and a dozen fresh-baked rolls. Pre-order recommended.",
  price: 89,
  image:
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
};

function Tag({ label }: { label: string }) {
  const variants = {
    default: { bg: colors.lightGray, color: colors.charcoal },
    signature: { bg: colors.deepRed, color: "#fff" },
    vegetarian: { bg: "#4A7C59", color: "#fff" },
    spicy: { bg: "#E85D04", color: "#fff" },
    limited: { bg: colors.goldenAmber, color: colors.charcoal },
    favorite: { bg: colors.burntOrange, color: "#fff" },
    pick: { bg: colors.brightGold, color: colors.charcoal },
    shareable: { bg: colors.charcoal, color: "#fff" },
    hearty: { bg: "#8B4513", color: "#fff" },
  };

  const lower = label.toLowerCase();
  const style =
    (lower.includes("signature") && variants.signature) ||
    (lower.includes("vegetarian") && variants.vegetarian) ||
    (lower.includes("spicy") && variants.spicy) ||
    (lower.includes("limited") && variants.limited) ||
    (lower.includes("favorite") && variants.favorite) ||
    (lower.includes("pick") && variants.pick) ||
    (lower.includes("shareable") && variants.shareable) ||
    (lower.includes("hearty") && variants.hearty) ||
    variants.default;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        letterSpacing: "0.2px",
      }}
    >
      {label}
    </span>
  );
}

function MenuItem({
  item,
}: {
  item: MenuData["categories"][number]["items"][number] & {
    tags?: string[];
    dietaryTags?: DietaryTag[];
    featured?: boolean;
  };
}) {
  const tags: string[] = [
    ...(item.tags ?? []),
    ...(item.dietaryTags ?? []),
    ...(item.featured ? ["Featured"] : []),
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px 0",
        borderBottom: `1px solid ${colors.lightGray}`,
        gap: "16px",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "6px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: colors.charcoal,
              margin: 0,
            }}
          >
            {item.name}
          </h4>
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.5,
            color: colors.textMuted,
            margin: 0,
          }}
        >
          {item.description}
        </p>
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: colors.charcoal,
          whiteSpace: "nowrap",
        }}
      >
        ${item.price}
      </div>
    </div>
  );
}

function FeaturedCard({
  item,
  accent = colors.deepRed,
}: {
  item: { id: string; name: string; description: string; price: number; tags?: string[]; image: string };
  accent?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: colors.warmWhite,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isHovered
          ? "0 12px 32px rgba(34, 31, 31, 0.15)"
          : "0 4px 16px rgba(34, 31, 31, 0.08)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        border: `1px solid ${colors.lightGray}`,
      }}
    >
      <div style={{ height: "160px", overflow: "hidden", position: "relative" }}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          style={{
            objectFit: "cover",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}
        />
      </div>
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          <h4
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: colors.charcoal,
              margin: 0,
            }}
          >
            {item.name}
          </h4>
          {item.tags?.map((tag) => <Tag key={tag} label={tag} />)}
        </div>
        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.5,
            color: colors.textMuted,
            margin: "0 0 12px 0",
          }}
        >
          {item.description}
        </p>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: accent,
          }}
        >
          ${item.price}
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  category,
}: {
  category: MenuData["categories"][number] & { icon?: React.JSX.Element };
}) {
  return (
    <section
      id={category.id}
      style={{
        marginBottom: "48px",
        scrollMarginTop: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <span className="text-xl text-[var(--menu-charcoal)]">{category.icon ?? <UtensilsCrossed className="h-5 w-5" />}</span>
        <h3
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: colors.charcoal,
            margin: 0,
          }}
        >
          {category.name}
        </h3>
      </div>
      {category.description && (
        <p
          style={{
            fontSize: "14px",
            color: colors.burntOrange,
            fontStyle: "italic",
            margin: "0 0 20px 0",
            paddingLeft: "42px",
          }}
        >
          {category.description}
        </p>
      )}
      <div
        style={{
          background: colors.warmWhite,
          borderRadius: "16px",
          padding: "8px 24px",
          border: `1px solid ${colors.lightGray}`,
        }}
      >
        {category.items.map((item) => (
          <MenuItem
            key={item.id}
            item={{
              ...item,
              tags: item.dietaryTags ?? [],
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default function MenuPage() {
  const sortedCategories = [...menuData.categories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const iconMap: Record<string, React.JSX.Element> = {
    starters: <UtensilsCrossed className="h-5 w-5" />,
    greens: <Leaf className="h-5 w-5" />,
    "big-plates": <Drumstick className="h-5 w-5" />,
    pizza: <Pizza className="h-5 w-5" />,
    dessert: <Star className="h-5 w-5" />,
    sides: <UtensilsCrossed className="h-5 w-5" />,
    "kids-menu": <Star className="h-5 w-5" />,
  };

  const menuCategories = sortedCategories.map((category) => ({
    ...category,
    icon: iconMap[category.id] ?? <UtensilsCrossed className="h-5 w-5" />,
  }));

  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuCategories.map((cat) => ({
        id: cat.id,
        element: document.getElementById(cat.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveCategory(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuCategories]);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.cream,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.charcoal} 0%, #3a3535 100%)`,
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h1
          className="font-serif text-[clamp(48px,10vw,80px)] font-bold leading-[1.05]"
          style={{
            color: "#fff",
            margin: "0 0 20px 0",
          }}
        >
          Our Menu
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.7)",
            maxWidth: "500px",
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Mountain comfort food made with care. Smoked BBQ on weekends, stone-fired pizzas, craft burgers & more.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: colors.deepRed,
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          BBQ available Saturdays & Sundays only
        </div>
      </div>

      {/* Category Navigation */}
      <nav
        ref={navRef}
        style={{
          background: colors.warmWhite,
          borderBottom: `1px solid ${colors.lightGray}`,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            gap: "8px",
          }}
        >
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              style={{
                padding: "16px 20px",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeCategory === category.id
                    ? `3px solid ${colors.burntOrange}`
                    : "3px solid transparent",
                fontSize: "14px",
                fontWeight: activeCategory === category.id ? 600 : 500,
                color: activeCategory === category.id ? colors.charcoal : colors.textMuted,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* Monthly Special Banner */}
        <section
          style={{
            background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.burntOrange} 100%)`,
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "48px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0,0,0,0.2)",
                padding: "6px 14px",
                borderRadius: "20px",
                marginBottom: "12px",
              }}
            >
              <Star className="h-4 w-4" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {monthlySpecial.title}
              </span>
            </div>

            <h3
              style={{
                fontSize: "28px",
                fontWeight: 600,
                margin: "0 0 12px 0",
              }}
            >
              {monthlySpecial.name}
            </h3>

            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                opacity: 0.9,
                margin: "0 0 16px 0",
                maxWidth: "600px",
              }}
            >
              {monthlySpecial.description}
            </p>

            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              ${monthlySpecial.price}
            </div>
          </div>
        </section>

        {/* Seasonal Items */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6B8CAE 0%, #9BB5D0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Snowflake className="h-4 w-4" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: colors.charcoal,
                  margin: 0,
                }}
              >
                {seasonalItems.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: colors.textMuted,
                  margin: 0,
                }}
              >
                {seasonalItems.subtitle}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {seasonalItems.items.map((item) => (
              <FeaturedCard key={item.id} item={item} accent="#6B8CAE" />
            ))}
          </div>
        </section>

        {/* Menu Categories */}
        {menuCategories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

        {/* Bottom CTA */}
        <section
          style={{
            background: colors.charcoal,
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h3
            style={{
              fontSize: "28px",
              fontWeight: 600,
              margin: "0 0 12px 0",
            }}
          >
            Ready to order?
          </h3>
          <p
            style={{
              fontSize: "15px",
              opacity: 0.7,
              margin: "0 0 24px 0",
            }}
          >
            Order ahead for pickup or dine-in at the restaurant.
          </p>
          <a
            href="https://www.toasttab.com/the-outpost"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: `linear-gradient(135deg, ${colors.brightGold} 0%, ${colors.goldenAmber} 100%)`,
              color: colors.charcoal,
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Order on Toast <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </main>
    </div>
  );
}
