export const assets = {
  homeHero: "/images/event-ballroom.webp",
  aboutHero: "/images/room-penthouse.webp",
  restaurantHero: "/images/restaurant-private-dining.webp",
  gardenKing: "/images/room-garden-king.webp",
  harborSuite: "/images/room-harbor-suite.webp",
  terraceResidence: "/images/room-terrace-residence.webp",
  citrusSalmon: "/images/dish-citrus-salmon.webp",
  wildMushroomPasta: "/images/dish-wild-mushroom-pasta.webp",
  gardenBreakfast: "/images/dish-garden-breakfast.webp",
  privateDining: "/images/restaurant-private-dining.webp",
  chefDish: "/images/restaurant-chef-dish.webp",
  ballroom: "/images/event-ballroom.webp",
  cocktailReception: "/images/event-cocktail-reception.webp",
  orangerie: "/images/event-orangerie.webp",
  library: "/images/venue-library.webp",
  gardenSuite: "/images/room-garden-suite.webp",
  penthouse: "/images/room-penthouse.webp",
};

export const site = {
  name: "Aurelia House",
  shortName: "Aurelia",
  tagline: "A considered stay, beautifully hosted.",
  description:
    "A premium, configurable hotel and hospitality website template for boutique hotels, resorts, lodges, restaurants, and venues.",
  currency: "USD",
  locale: "en-US",
  email: "hello@aureliahouse.example",
  reservationsEmail: "stay@aureliahouse.example",
  phone: "+1 555 014 8800",
  address: ["28 Willow Quay", "Harbor District, Example City"],
  mapEmbedUrl: "https://www.google.com/maps?q=New%20York&output=embed",
  social: { instagram: "", facebook: "", tiktok: "", youtube: "" },
  booking: {
    checkIn: "15:00",
    checkOut: "11:00",
    serviceFeeRate: 0.1,
    breakfastPerAdult: 22,
    airportTransfer: 65,
  },
  restaurant: {
    name: "The Conservatory",
    description:
      "Seasonal cooking, quietly confident service, and a room made for lingering.",
    hours: [
      "Breakfast · 07:00–10:30",
      "Lunch · 12:30–15:00",
      "Dinner · 18:00–22:30",
    ],
  },
};

export const money = (value) =>
  new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);

export const rooms = [
  {
    id: "garden-king",
    name: "Garden King",
    category: "Rooms",
    price: 245,
    capacity: 2,
    bed: "One king bed",
    size: "34 m²",
    featured: true,
    availability: true,
    image: assets.gardenKing,
    description:
      "An unhurried retreat with soft linen, warm oak, and garden light.",
    amenities: ["King bed", "Rain shower", "Wi‑Fi", "Nespresso"],
  },
  {
    id: "harbor-suite",
    name: "Harbor Suite",
    category: "Suites",
    price: 395,
    capacity: 3,
    bed: "One king + daybed",
    size: "54 m²",
    featured: true,
    availability: true,
    image: assets.harborSuite,
    description:
      "A generous suite with a separate salon and an outlook over the water.",
    amenities: ["Separate salon", "Soaking tub", "Wi‑Fi", "Breakfast option"],
  },
  {
    id: "terrace-residence",
    name: "Terrace Residence",
    category: "Residences",
    price: 620,
    capacity: 4,
    bed: "Two bedrooms",
    size: "92 m²",
    featured: false,
    availability: true,
    image: assets.terraceResidence,
    description:
      "A private two-bedroom residence for families and longer stays.",
    amenities: [
      "Private terrace",
      "Two bathrooms",
      "Kitchenette",
      "Dining table",
    ],
  },
];

export const menu = [
  {
    id: "citrus-salmon",
    category: "Dinner",
    name: "Citrus salmon",
    price: 34,
    featured: true,
    image: assets.citrusSalmon,
    description: "Charred citrus, fennel, and olive oil potatoes.",
  },
  {
    id: "wild-mushroom",
    category: "Dinner",
    name: "Wild mushroom pappardelle",
    price: 28,
    image: assets.wildMushroomPasta,
    description: "Hand-cut pasta, woodland mushrooms, aged pecorino.",
  },
  {
    id: "garden-breakfast",
    category: "Breakfast",
    name: "Garden breakfast",
    price: 22,
    image: assets.gardenBreakfast,
    description: "Eggs, baked sourdough, fruit, and pressed juice.",
  },
  {
    id: "chef-selection",
    category: "Dinner",
    name: "Chef's seasonal selection",
    price: 38,
    image: assets.chefDish,
    description: "A considered seasonal plate, prepared to order.",
  },
];

export const roomServiceMenu = menu.map((item) => ({
  ...item,
  category: item.category === "Dinner" ? "Meals" : item.category,
}));

export const events = [
  {
    id: "orangerie",
    name: "The Orangerie",
    category: "Celebrations",
    capacity: "Up to 130 guests",
    price: 1800,
    image: assets.orangerie,
    description:
      "A light-filled room for weddings, gala dinners, and unforgettable tables.",
  },
  {
    id: "library",
    name: "The Library",
    category: "Meetings",
    capacity: "Up to 24 guests",
    price: 650,
    image: assets.library,
    description:
      "A focused, intimate setting for teams that need to think clearly.",
  },
  {
    id: "ballroom",
    name: "The Grand Ballroom",
    category: "Celebrations",
    capacity: "Up to 180 guests",
    price: 1800,
    image: assets.ballroom,
    description:
      "A chandelier-lit ballroom for grand receptions, gala dinners, and celebrations.",
  },
];

export const gallery = [
  {
    id: "gallery-1",
    category: "Stay",
    alt: "A calm, light-filled guest room",
    image: rooms[0].image,
  },
  {
    id: "gallery-2",
    category: "Dining",
    alt: "A considered dinner setting",
    image: assets.privateDining,
  },
  {
    id: "gallery-3",
    category: "Spaces",
    alt: "An elegant event setting",
    image: events[0].image,
  },
  {
    id: "gallery-4",
    category: "Stay",
    alt: "A spacious suite",
    image: assets.penthouse,
  },
  {
    id: "gallery-5",
    category: "Dining",
    alt: "A chef prepared dish",
    image: menu[0].image,
  },
  {
    id: "gallery-6",
    category: "Spaces",
    alt: "Outdoor celebration details",
    image: assets.cocktailReception,
  },
  {
    id: "gallery-7",
    category: "Stay",
    alt: "A bright, relaxed suite",
    image: assets.gardenSuite,
  },
];

export const testimonials = [
  {
    quote:
      "The pace feels deliberate in the best possible way—nothing was overlooked.",
    name: "M. Ellis",
    context: "Weekend guest",
  },
  {
    quote:
      "A beautiful place to host a small off-site. The team made it effortless.",
    name: "T. Morgan",
    context: "Event host",
  },
  {
    quote: "Dinner was wonderful and the room was exceptionally calm.",
    name: "A. Reed",
    context: "Restaurant guest",
  },
];

export const policies = {
  cancellation:
    "Cancellation terms are set by the property. Replace this demo policy with your own booking policy before launch.",
  privacy:
    "This Ethiopia-oriented starter is for a property that uses Firebase to receive reservations, orders and enquiries. Publish property-specific privacy text, retention periods and contact details after review by qualified Ethiopian counsel.",
  terms:
    "All reservations are subject to the property’s published terms, availability, prices and cancellation conditions. Have qualified Ethiopian counsel review the completed terms before publication.",
};
