// Structure of the Homeowner Resources hub at /homeowner-resources/.
//
// Published guides live in src/content/resources and appear automatically in
// their category. `planned` topics are shown as "guide in progress" rows with
// a link to the closest existing service page, so the hub never links to a
// page that does not exist yet. When a planned guide is published, remove it
// from `planned` here.

export type ResourceCategoryId = "bathroom" | "kitchen" | "maintenance" | "houston";

export type ResourceLink = { label: string; href: string };

export type ResourceCategory = {
  id: ResourceCategoryId;
  /** Short label used on cards and filter chips. */
  label: string;
  /** H2 on the hub page. */
  heading: string;
  intro: string;
  image?: { base: string; alt: string };
  services: ResourceLink[];
  planned: { title: string; description: string; link: ResourceLink }[];
};

export const resourceCategories: ResourceCategory[] = [
  {
    id: "bathroom",
    label: "Bathroom Remodeling",
    heading: "Bathroom Remodeling Resources",
    intro:
      "Showers, tile, vanities and the moisture problems that hide behind them. Start here before you replace a surround or chase a leak.",
    image: {
      base: "bathroom-demolition-houston-01",
      alt: "Houston bathroom during demolition with shower walls opened to framing",
    },
    services: [
      { label: "Bathroom remodeling", href: "/bathroom-remodeling-houston/" },
      { label: "Drywall repair", href: "/drywall-installation-repair-houston/" },
    ],
    planned: [
      {
        title: "How Much Does a Bathroom Remodel Cost in Houston?",
        description:
          "The decisions that move the price: plumbing locations, shower size, tile and the condition behind the walls.",
        link: { label: "See bathroom cost factors", href: "/bathroom-remodeling-houston/" },
      },
      {
        title: "Shower Replacement: What to Expect",
        description:
          "Demolition, waterproofing and tile preparation, and why the parts you never see decide how long a shower lasts.",
        link: { label: "Bathroom remodeling", href: "/bathroom-remodeling-houston/" },
      },
      {
        title: "Choosing Bathroom Tile and Flooring",
        description:
          "Large-format, mosaic and patterned tile each need different preparation. How to choose before the scope is set.",
        link: { label: "Bathroom remodeling", href: "/bathroom-remodeling-houston/" },
      },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen Remodeling",
    heading: "Kitchen Remodeling Resources",
    intro:
      "Plan the layout, cabinets and surfaces in the right order so the decisions you make early do not limit the ones you make later.",
    services: [
      { label: "Kitchen remodeling", href: "/kitchen-remodeling-houston/" },
      { label: "Interior painting", href: "/interior-exterior-painting-houston/" },
    ],
    planned: [
      {
        title: "Planning a Kitchen Renovation in Houston",
        description:
          "What to decide first, what can wait, and how to keep a kitchen usable for as long as possible during the work.",
        link: { label: "Kitchen remodeling", href: "/kitchen-remodeling-houston/" },
      },
      {
        title: "Cabinet Guide: Refinish, Reface or Replace",
        description:
          "How the condition of the boxes, the layout and your budget point to one option over the others.",
        link: { label: "Kitchen remodeling", href: "/kitchen-remodeling-houston/" },
      },
      {
        title: "Countertop Comparison for Busy Kitchens",
        description:
          "Quartz, granite, solid surface and laminate compared on care, heat, seams and how each is templated.",
        link: { label: "Kitchen remodeling", href: "/kitchen-remodeling-houston/" },
      },
      {
        title: "Kitchen Layout Ideas That Work Day to Day",
        description:
          "Work zones, walkway clearances and when moving plumbing or walls is worth the added scope.",
        link: { label: "Kitchen remodeling", href: "/kitchen-remodeling-houston/" },
      },
    ],
  },
  {
    id: "maintenance",
    label: "Home Repairs & Maintenance",
    heading: "Home Maintenance Guides",
    intro:
      "Catch water, flooring and structural warning signs while the repair is still small, and know which ones should not wait.",
    image: {
      base: "utility-room-drywall-access-houston-02",
      alt: "Utility room drywall opened around washer drain and supply connections",
    },
    services: [
      { label: "Ceiling repair", href: "/ceiling-repair-houston/" },
      { label: "Drywall repair", href: "/drywall-installation-repair-houston/" },
      { label: "Interior & exterior painting", href: "/interior-exterior-painting-houston/" },
    ],
    planned: [
      {
        title: "Signs Your Home Needs Attention Before Small Problems Become Expensive Repairs",
        description:
          "Stains, cracks, soft spots and smells that are worth a closer look, and what each one usually points to.",
        link: { label: "Ceiling repair", href: "/ceiling-repair-houston/" },
      },
      {
        title: "Preventing Water Damage Inside the House",
        description:
          "Caulk, grout, supply lines and ventilation: the maintenance that keeps small leaks from reaching drywall.",
        link: { label: "Drywall repair", href: "/drywall-installation-repair-houston/" },
      },
      {
        title: "Flooring Problems and What They Mean",
        description:
          "Cupping, lifting and hollow tile, and how to tell a surface problem from one underneath.",
        link: { label: "Talk with our team", href: "/contact/" },
      },
      {
        title: "Structural Warning Signs: Cracks, Doors and Ceilings",
        description:
          "Which drywall cracks are cosmetic, which follow movement, and when to bring in an engineer.",
        link: { label: "Drywall repair", href: "/drywall-installation-repair-houston/" },
      },
      {
        title: "Seasonal Home Maintenance Checklist",
        description:
          "A spring, summer, fall and winter list written for Gulf Coast weather.",
        link: { label: "Exterior painting", href: "/interior-exterior-painting-houston/" },
      },
    ],
  },
  {
    id: "houston",
    label: "Houston Homeowner Guides",
    heading: "Houston Homeowner Guides",
    intro:
      "Humidity, storms and shifting soil shape how Houston houses wear. Local guides for local conditions.",
    image: {
      base: "stone-walkway-houston-02",
      alt: "Completed double-row stone walkway set in dark gravel beside a backyard patio",
    },
    services: [
      { label: "Stone walkways & hardscaping", href: "/stone-walkways-hardscaping-houston/" },
      { label: "Service areas", href: "/service-areas/" },
    ],
    planned: [
      {
        title: "Houston Humidity and Your Home",
        description:
          "How Gulf Coast moisture affects paint, drywall, bathrooms and trim, and what helps.",
        link: { label: "Interior & exterior painting", href: "/interior-exterior-painting-houston/" },
      },
      {
        title: "Storm Preparation for Houston Homeowners",
        description:
          "What to check before hurricane season and what to document after a storm.",
        link: { label: "Talk with our team", href: "/contact/" },
      },
      {
        title: "Common Houston Home Problems by Decade Built",
        description:
          "What tends to show up in 1970s, 1980s and 2000s houses across southwest Houston.",
        link: { label: "Service areas", href: "/service-areas/" },
      },
    ],
  },
];

export const categoryById = Object.fromEntries(
  resourceCategories.map((category) => [category.id, category]),
) as Record<ResourceCategoryId, ResourceCategory>;
