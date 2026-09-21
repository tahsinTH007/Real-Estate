/**
 * Location search. Resolves a free-text query to [lng, lat].
 *
 * A small local gazetteer covers the cities in the demo data (so the mock
 * works offline); anything else falls back to OpenStreetMap's Nominatim,
 * which needs no API key.
 */

export interface GeocodeResult {
  label: string;
  coordinates: [number, number]; // [lng, lat]
}

interface Place {
  name: string;
  aliases?: string[];
  lng: number;
  lat: number;
}

const GAZETTEER: Place[] = [
  { name: "Los Angeles, CA", aliases: ["la", "los angeles", "downtown la", "dtla", "silver lake", "los feliz", "echo park", "hollywood"], lng: -118.2437, lat: 34.0522 },
  { name: "Santa Monica, CA", aliases: ["santa monica"], lng: -118.4912, lat: 34.0195 },
  { name: "Venice, CA", aliases: ["venice", "venice beach"], lng: -118.4695, lat: 33.985 },
  { name: "Pasadena, CA", aliases: ["pasadena"], lng: -118.1445, lat: 34.1478 },
  { name: "Long Beach, CA", aliases: ["long beach"], lng: -118.1937, lat: 33.7701 },
  { name: "Culver City, CA", aliases: ["culver city"], lng: -118.3965, lat: 34.0211 },
  { name: "San Diego, CA", aliases: ["san diego", "north park"], lng: -117.1611, lat: 32.7157 },
  { name: "San Francisco, CA", aliases: ["sf", "san francisco", "mission district", "hayes valley", "noe valley"], lng: -122.4194, lat: 37.7749 },
  { name: "Oakland, CA", aliases: ["oakland", "temescal"], lng: -122.2712, lat: 37.8044 },
  { name: "New York, NY", aliases: ["nyc", "new york", "manhattan", "new york city", "upper west side"], lng: -73.9857, lat: 40.7484 },
  { name: "Brooklyn, NY", aliases: ["brooklyn", "williamsburg"], lng: -73.9442, lat: 40.6782 },
  { name: "Astoria, NY", aliases: ["astoria", "queens"], lng: -73.9235, lat: 40.7644 },
  { name: "Boston, MA", aliases: ["boston", "cambridge"], lng: -71.0589, lat: 42.3601 },
  { name: "Chicago, IL", aliases: ["chicago", "wicker park"], lng: -87.6298, lat: 41.8781 },
  { name: "Austin, TX", aliases: ["austin", "east austin", "south congress"], lng: -97.7431, lat: 30.2672 },
  { name: "Seattle, WA", aliases: ["seattle", "capitol hill", "fremont"], lng: -122.3321, lat: 47.6062 },
  { name: "Miami, FL", aliases: ["miami", "wynwood", "brickell"], lng: -80.1918, lat: 25.7617 },
  { name: "Denver, CO", aliases: ["denver", "rino"], lng: -104.9903, lat: 39.7392 },
  { name: "Portland, OR", aliases: ["portland", "pearl district"], lng: -122.6765, lat: 45.5231 },
];

export const POPULAR_LOCATIONS = [
  "Los Angeles",
  "San Francisco",
  "New York",
  "Austin",
  "Seattle",
  "Miami",
];

function localLookup(query: string): GeocodeResult | null {
  const q = query.trim().toLowerCase().replace(/,.*$/, "");
  if (!q) return null;
  for (const place of GAZETTEER) {
    const candidates = [place.name.toLowerCase(), ...(place.aliases ?? [])];
    if (candidates.some((c) => c === q || c.startsWith(q) || q.startsWith(c))) {
      return { label: place.name, coordinates: [place.lng, place.lat] };
    }
  }
  return null;
}

export async function geocode(query: string): Promise<GeocodeResult | null> {
  const local = localLookup(query);
  if (local) return local;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: query,
        format: "json",
        limit: "1",
      })}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { lat: string; lon: string; display_name: string }[];
    if (!data.length) return null;
    const [first] = data;
    const label = first.display_name.split(",").slice(0, 2).join(",").trim();
    return {
      label: label || query,
      coordinates: [parseFloat(first.lon), parseFloat(first.lat)],
    };
  } catch {
    return null;
  }
}
