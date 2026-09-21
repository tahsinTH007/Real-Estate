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
  { name: "Dhaka, Bangladesh", aliases: ["dhaka", "dhanmondi", "gulshan", "banani", "uttara", "mirpur", "bashundhara"], lng: 90.4125, lat: 23.8103 },
  { name: "Chattogram, Bangladesh", aliases: ["chittagong", "chattogram", "agrabad", "khulshi", "panchlaish"], lng: 91.7832, lat: 22.3569 },
  { name: "Sylhet, Bangladesh", aliases: ["sylhet", "zindabazar", "upashahar"], lng: 91.8716, lat: 24.8949 },
  { name: "Rajshahi, Bangladesh", aliases: ["rajshahi", "boalia", "kazla"], lng: 88.6042, lat: 24.3745 },
  { name: "Khulna, Bangladesh", aliases: ["khulna", "sonadanga", "nirala"], lng: 89.5481, lat: 22.8456 },
  { name: "Cox's Bazar, Bangladesh", aliases: ["cox's bazar", "coxs bazar", "kolatoli"], lng: 91.9737, lat: 21.4272 },
  { name: "Mymensingh, Bangladesh", aliases: ["mymensingh"], lng: 90.3988, lat: 24.7471 },
  { name: "Rangpur, Bangladesh", aliases: ["rangpur"], lng: 89.2442, lat: 25.7439 },
];

export const POPULAR_LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Cox's Bazar",
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
