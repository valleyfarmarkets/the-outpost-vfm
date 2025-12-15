# Cabin Image Placeholders

## Current Status

All 5 cabins currently use **duplicate images** as placeholders in the photo gallery. Each cabin's `images` array contains 5 references to the same hero image.

## Images Required

Each cabin needs **4 additional unique images** to complete the 5-image photo gallery:

### Image Types Needed

For optimal cabin detail page display, each cabin should have:

1. **Hero/Exterior** (already exists) - Main cabin exterior shot
2. **Interior Living Space** - Living room, fireplace, general interior
3. **Bedroom** - Primary sleeping area
4. **Kitchen/Kitchenette** - Cooking and dining area
5. **Outdoor/Amenity** - Deck, fire pit, outdoor seating, or unique cabin feature

### Image Specifications

- **Aspect Ratio**: 16:9 or 4:3 recommended
- **Minimum Resolution**: 1920x1080 (1080p)
- **Format**: JPG (optimized for web)
- **File Size**: < 500KB per image (use compression)

### Current Placeholder Pattern

```json
"images": [
  "/images/cabins/{cabin-id}/{cabin-id}-hero.jpg",
  "/images/cabins/{cabin-id}/{cabin-id}-hero.jpg",  // DUPLICATE - Replace
  "/images/cabins/{cabin-id}/{cabin-id}-hero.jpg",  // DUPLICATE - Replace
  "/images/cabins/{cabin-id}/{cabin-id}-hero.jpg",  // DUPLICATE - Replace
  "/images/cabins/{cabin-id}/{cabin-id}-hero.jpg"   // DUPLICATE - Replace
]
```

### Recommended Image Naming

When adding new images, use this naming convention:

```
/images/cabins/{cabin-id}/{cabin-id}-hero.jpg       (existing)
/images/cabins/{cabin-id}/{cabin-id}-interior-1.jpg  (new)
/images/cabins/{cabin-id}/{cabin-id}-bedroom-1.jpg   (new)
/images/cabins/{cabin-id}/{cabin-id}-kitchen.jpg     (new)
/images/cabins/{cabin-id}/{cabin-id}-exterior-2.jpg  (new)
```

## Cabins Requiring Images

### 1. Hunter's Lair (hunters-lair)
- ✅ Hero image exists
- ❌ Needs 4 additional images
- Suggested: Rustic interior with stone fireplace, master bedroom, full kitchen, deck with BBQ

### 2. Fisherman's Landing (fishermans-landing)
- ✅ Hero image exists
- ❌ Needs 4 additional images
- Suggested: Nautical interior, sleeping loft, kitchenette, lakeside deck

### 3. Hiker's Haven (hikers-haven)
- ✅ Hero image exists
- ❌ Needs 4 additional images
- Suggested: Cozy interior, California King bedroom, kitchen, trail access view

### 4. Stargazer (stargazer)
- ✅ Hero image exists
- ❌ Needs 4 additional images
- Suggested: Romantic interior, dark sky viewing area, queen bedroom, telescope setup

### 5. Wildlife Lookout (wildlife-lookout)
- ✅ Hero image exists
- ❌ Needs 4 additional images
- Suggested: Secluded interior, wildlife viewing window, king bedroom, nature trail

## Total Images Needed

- **Current**: 5 cabins × 1 unique image = 5 images
- **Target**: 5 cabins × 5 unique images = 25 images
- **To Add**: 20 new images

## Implementation Steps

1. Gather or capture 4 additional photos per cabin (20 total)
2. Optimize images for web (compress to < 500KB)
3. Save images to `/public/images/cabins/{cabin-id}/` directory
4. Update `/data/cabins.json` to reference new image paths
5. Test photo gallery on all cabin detail pages

## Photo Gallery Layout

The 5 images are displayed in a CSS grid:

```
[Main Image - 2fr]  [Image 2 - 1fr]
                    [Image 3 - 1fr]
[Image 4 - 1fr]     [Image 5 - 1fr]
```

The first image (index 0) is the largest and most prominent, so ensure it's the best representation of the cabin.

---

**Created**: 2024-12-15
**Status**: All cabins use placeholder duplicates
**Priority**: Medium - Gallery works but shows duplicate images
