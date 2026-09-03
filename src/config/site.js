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
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80",
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
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
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
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
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
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=80",
    description: "Charred citrus, fennel, and olive oil potatoes.",
  },
  {
    id: "wild-mushroom",
    category: "Dinner",
    name: "Wild mushroom pappardelle",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1000&q=80",
    description: "Hand-cut pasta, woodland mushrooms, aged pecorino.",
  },
  {
    id: "garden-breakfast",
    category: "Breakfast",
    name: "Garden breakfast",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=80",
    description: "Eggs, baked sourdough, fruit, and pressed juice.",
  },
  {
    id: "spiced-coffee",
    category: "Drinks",
    name: "Spiced house coffee",
    price: 7,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
    description: "Small-batch roast with warm spices and orange peel.",
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
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80",
    description:
      "A light-filled room for weddings, gala dinners, and unforgettable tables.",
  },
  {
    id: "library",
    name: "The Library",
    category: "Meetings",
    capacity: "Up to 24 guests",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1400&q=80",
    description:
      "A focused, intimate setting for teams that need to think clearly.",
  },
  {
    id: "courtyard",
    name: "The Courtyard",
    category: "Open air",
    capacity: "Up to 90 guests",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80",
    description:
      "An atmospheric outdoor venue for sunset receptions and social occasions.",
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
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
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
    image: rooms[1].image,
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
    image: events[2].image,
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
