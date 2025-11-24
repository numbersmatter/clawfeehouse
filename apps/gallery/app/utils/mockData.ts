export interface Image {
  id: string;
  url: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
}

export const MOCK_IMAGES: Image[] = [
  {
    id: "1",
    url: "https://picsum.photos/id/10/1200/800",
    title: "Forest Path",
    author: "Paul Jarvis",
    date: "2023-11-01",
    tags: ["nature", "forest", "green"],
  },
  {
    id: "2",
    url: "https://picsum.photos/id/11/1200/800",
    title: "Mountain Lake",
    author: "Paul Jarvis",
    date: "2023-11-02",
    tags: ["nature", "mountain", "water"],
  },
  {
    id: "3",
    url: "https://picsum.photos/id/12/1200/800",
    title: "Beach Sunset",
    author: "Paul Jarvis",
    date: "2023-11-03",
    tags: ["nature", "beach", "sunset"],
  },
  {
    id: "4",
    url: "https://picsum.photos/id/13/1200/800",
    title: "City Skyline",
    author: "Paul Jarvis",
    date: "2023-11-04",
    tags: ["city", "urban", "architecture"],
  },
  {
    id: "5",
    url: "https://picsum.photos/id/14/1200/800",
    title: "Abstract Shapes",
    author: "Paul Jarvis",
    date: "2023-11-05",
    tags: ["abstract", "art", "colorful"],
  },
  {
    id: "6",
    url: "https://picsum.photos/id/15/1200/800",
    title: "Waterfall",
    author: "Paul Jarvis",
    date: "2023-11-06",
    tags: ["nature", "water", "waterfall"],
  },
  {
    id: "7",
    url: "https://picsum.photos/id/16/1200/800",
    title: "Desert Dunes",
    author: "Paul Jarvis",
    date: "2023-11-07",
    tags: ["nature", "desert", "sand"],
  },
  {
    id: "8",
    url: "https://picsum.photos/id/17/1200/800",
    title: "Snowy Peaks",
    author: "Paul Jarvis",
    date: "2023-11-08",
    tags: ["nature", "snow", "mountain"],
  },
];

export const ALL_TAGS = Array.from(
  new Set(MOCK_IMAGES.flatMap((img) => img.tags))
).sort();

export const sampleImage = {
  id: "1",
  url: "https://picsum.photos/id/10/1200/800",
  title: "Forest Path",
  author: "Paul Jarvis",
  date: "2023-11-01",
  tags: ["nature", "forest", "green"],
};
