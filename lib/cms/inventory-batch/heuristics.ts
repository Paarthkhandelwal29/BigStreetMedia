import { inventoryCities, mediaTypes } from "@/data/inventory";
import type {
  BatchInventoryField,
  InventoryAnalysisResult,
  InventorySourceUnit,
} from "./types";

type Candidate = {
  value: string;
  confidence: number;
};

const COMMON_CITIES = Array.from(
  new Set([
    ...inventoryCities,
    "Agra",
    "Ahmedabad",
    "Amritsar",
    "Bareilly",
    "Bengaluru",
    "Bhopal",
    "Bhubaneswar",
    "Chandigarh",
    "Chennai",
    "Dehradun",
    "Faridabad",
    "Ghaziabad",
    "Gorakhpur",
    "Gurugram",
    "Guwahati",
    "Hyderabad",
    "Indore",
    "Jammu",
    "Jodhpur",
    "Kochi",
    "Kolkata",
    "Lucknow",
    "Ludhiana",
    "Meerut",
    "Mumbai",
    "Mysuru",
    "Nagpur",
    "Noida",
    "Patna",
    "Prayagraj",
    "Pune",
    "Raipur",
    "Ranchi",
    "Surat",
    "Udaipur",
    "Vadodara",
    "Varanasi",
    "Vijayawada",
  ]),
);

const CITY_SYNONYMS: Record<string, string[]> = {
  Delhi: ["New Delhi", "Dilli", "Del"],
  Mumbai: ["Bombay", "Mumb"],
  Bengaluru: ["Bangalore", "Bengalur"],
  Chennai: ["Madras", "Chenn"],
  Kolkata: ["Calcutta", "Kolkat"],
  Pune: ["Poona"],
  Kochi: ["Cochin"],
  Varanasi: ["Banaras", "Kashi", "Varanas"],
  Prayagraj: ["Allahabad"],
  Gurugram: ["Gurgaon", "Gurg", "Gurugr"],
  Mysuru: ["Mysore"],
  Bhubaneswar: ["Bhubaneshwar", "Bhuban"],
  Chandigarh: ["Chand"],
  Ahmedabad: ["Ahemdabad", "Ahmadabad", "Ahmed"],
  Hyderabad: ["Hyd", "Hyder"],
  Lucknow: ["Luck", "Lukhnow"],
  Kanpur: ["Cawnpore", "Kanp"],
  Patna: ["Patn"],
  Jaipur: ["Jaip", "Jaypur"],
  Indore: ["Indor"],
};

function levenshtein(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  const matrix: number[] = [];
  for (let i = 0; i <= bn; i++) matrix[i] = i;
  for (let i = 1; i <= an; i++) {
    let prev = i;
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(
        matrix[j - 1] + cost,
        matrix[j] + 1,
        prev + 1,
      );
      matrix[j - 1] = prev;
      prev = val;
    }
    matrix[bn] = prev;
  }
  return matrix[bn];
}

function fuzzyFindCity(text: string): string | null {
  const words = text.split(/[\s,;()]+/).filter((w) => w.length >= 3);
  let best: { city: string; dist: number } | null = null;

  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (clean.length < 3) continue;
    for (const city of COMMON_CITIES) {
      if (city.toLowerCase() === clean) return city;
      const dist = levenshtein(clean, city.toLowerCase());
      const maxLen = Math.max(clean.length, city.length);
      if (dist <= 2 && dist / maxLen < 0.35) {
        if (!best || dist < best.dist) {
          best = { city, dist };
        }
      }
    }
  }
  return best?.city || null;
}

const MEDIA_TYPE_MATCHERS: Array<{ value: string; patterns: RegExp[] }> = [
  {
    value: "Hoardings",
    patterns: [/\bhoarding\b/i, /\bhoardings\b/i, /\bbillboard\b/i],
  },
  {
    value: "Bus Shelters",
    patterns: [/\bbus\s+shelter\b/i, /\bbus\s+shelters\b/i, /\bbus\s+stop\b/i],
  },
  {
    value: "Unipoles",
    patterns: [/\bunipole\b/i, /\bunipoles\b/i],
  },
  {
    value: "Mall Branding",
    patterns: [/\bmall\s+branding\b/i, /\bmall\b/i, /\batrium\b/i],
  },
  {
    value: "Metro Stations",
    patterns: [/\bmetro\s+station\b/i, /\bmetro\s+stations\b/i],
  },
  {
    value: "Airport Media",
    patterns: [/\bairport\b/i, /\bterminal\b/i],
  },
  {
    value: "Railway Stations",
    patterns: [
      /\brailway\s+station\b/i,
      /\brailway\s+stations\b/i,
      /\bjunction\b/i,
    ],
  },
  {
    value: "Boat Media",
    patterns: [/\bboat\b/i, /\bcruise\b/i, /\bferry\b/i],
  },
];

const NON_LOCATION_LABELS = [
  "city",
  "media type",
  "format",
  "size",
  "dimension",
  "featured",
  "confidence",
  "location",
  "address",
  "site",
  "inventory",
  "slide",
  "page",
  "big street media",
  "advertisers",
];

const ADDRESS_KEYWORDS = [
  "road", "rd", "nagar", "colony", "chauraha", "square", "chowk",
  "crossing", "tiraha", "marg", "street", "lane", "complex", "plaza",
  "tower", "building", "sector", "phase", "block", "near", "opposite",
  "opp", "beside", "adjacent", "gate", "toll", "flyover", "bridge",
  "bypass", "highway", "nh-", "nh ", "sh-", "sh ", "district",
];

export function normalizeWhitespace(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeMultilineText(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .join("\n");
}

function getTextLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function findLabeledValue(text: string, labels: string[]): Candidate | null {
  const lines = getTextLines(text);

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const label of labels) {
      const normalizedLabel = label.toLowerCase();
      if (
        lowerLine.startsWith(`${normalizedLabel}:`) ||
        lowerLine.startsWith(`${normalizedLabel} -`) ||
        lowerLine.startsWith(`${normalizedLabel}–`) ||
        lowerLine.startsWith(`${normalizedLabel} —`) ||
        lowerLine.startsWith(`${normalizedLabel} `)
      ) {
        const value = normalizeWhitespace(
          line.slice(normalizedLabel.length).replace(/^[:\-–—\s]+/, ""),
        );
        if (value) return { value, confidence: 0.96 };
      }
    }
  }

  for (const label of labels) {
    const matcher = new RegExp(
      `${label.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\s*[:\-–—]\\s*([^\\n]+)`,
      "i",
    );
    const match = text.match(matcher);
    if (match?.[1]) {
      return {
        value: normalizeWhitespace(match[1]),
        confidence: 0.92,
      };
    }
  }

  return null;
}

function findMentionedCities(text: string) {
  const found: string[] = [];

  for (const city of COMMON_CITIES) {
    const pattern = new RegExp(
      `\\b${city.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`,
      "i",
    );
    if (pattern.test(text)) {
      found.push(city);
    }
  }

  for (const [canonical, synonyms] of Object.entries(CITY_SYNONYMS)) {
    if (found.includes(canonical)) continue;
    for (const synonym of synonyms) {
      const pattern = new RegExp(
        `\\b${synonym.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`,
        "i",
      );
      if (pattern.test(text)) {
        found.push(canonical);
        break;
      }
    }
  }

  const fuzzy = fuzzyFindCity(text);
  if (fuzzy && !found.includes(fuzzy)) {
    found.push(fuzzy);
  }

  return [...new Set(found)];
}

function sanitizeCityValue(value: string) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;

  const exactSegments = normalized
    .split(/[|,;/]+/)
    .map((segment) => normalizeWhitespace(segment))
    .filter(Boolean);

  for (const segment of exactSegments) {
    const exactCity = COMMON_CITIES.find(
      (city) => city.toLowerCase() === segment.toLowerCase(),
    );
    if (exactCity) return exactCity;
  }

  const mentionedCities = findMentionedCities(normalized);
  if (mentionedCities.length > 0) {
    return mentionedCities[mentionedCities.length - 1];
  }

  const firstSegment = exactSegments[0] || normalized;
  const wordCount = firstSegment.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 3) {
    return toTitleCase(firstSegment);
  }

  return null;
}

function extractCity(text: string): Candidate | null {
  const labeled = findLabeledValue(text, ["city", "market", "site city"]);
  if (labeled) {
    const sanitized = sanitizeCityValue(labeled.value);
    if (sanitized) {
      const exactCityMatch = COMMON_CITIES.some(
        (city) => city.toLowerCase() === sanitized.toLowerCase(),
      );
      return {
        value: sanitized,
        confidence: exactCityMatch ? 0.98 : labeled.confidence,
      };
    }
  }

  const mentionedCities = findMentionedCities(text);
  if (mentionedCities.length > 0) {
    return { value: mentionedCities[0], confidence: 0.84 };
  }

  return null;
}

function extractMediaType(text: string): Candidate | null {
  const labeled = findLabeledValue(text, [
    "media type",
    "media",
    "format",
    "type",
    "inventory type",
  ]);

  if (labeled) {
    const normalized = labeled.value.toLowerCase();
    for (const item of mediaTypes) {
      if (normalized.includes(item.toLowerCase())) {
        return { value: item, confidence: labeled.confidence };
      }
    }
  }

  for (const matcher of MEDIA_TYPE_MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(text))) {
      return { value: matcher.value, confidence: 0.86 };
    }
  }

  return null;
}

function extractSize(text: string): Candidate | null {
  const labeled = findLabeledValue(text, ["size", "dimension", "dimensions"]);
  if (labeled) {
    const normalized = normalizeWhitespace(labeled.value);
    return { value: normalized, confidence: labeled.confidence };
  }

  const sizePatterns = [
    /\b\d{1,3}(?:\.\d{1,2})?\s*(?:x|×|X|by|BY|\*)\s*\d{1,3}(?:\.\d{1,2})?(?:\s*(?:ft|feet|foot|m|meter|meters|sqm|sq\s*ft|sq\.\s*ft|\"|'|inches|inch|h|w|hgt|wdth))?/i,
    /\b\d{1,3}\s*['"]?\s*(?:x|×|X|\*)\s*\d{1,3}\s*['"]?\b/i,
    /\b\d{1,3}\s*(?:ft|feet|foot|m|meter)\s*(?:x|×|X|by|\*)\s*\d{1,3}\s*(?:ft|feet|foot|m|meter)?/i,
    /\b\d{1,3}\s*[WwHh]?\s*(?:x|×|X|\*)\s*\d{1,3}\s*[HhWw]?\b/i,
  ];

  for (const pattern of sizePatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        value: normalizeWhitespace(match[0].replace(/\s*(?:x|X|by|BY|\*)\s*/i, " × ")),
        confidence: 0.9,
      };
    }
  }

  return null;
}

function sanitizeLocationValue(value: string, cityValue?: string) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  if (cityValue && normalized.toLowerCase() === cityValue.toLowerCase()) {
    return null;
  }
  return normalized;
}

function hasAddressKeywords(text: string) {
  const lower = text.toLowerCase();
  return ADDRESS_KEYWORDS.some((kw) => lower.includes(kw));
}

function extractLocation(text: string, cityValue?: string): Candidate | null {
  const labeled = findLabeledValue(text, [
    "location",
    "address",
    "site",
    "landmark",
    "place",
  ]);
  if (labeled) {
    const sanitized = sanitizeLocationValue(labeled.value, cityValue);
    if (sanitized) {
      return {
        value: sanitized,
        confidence: labeled.confidence,
      };
    }
  }

  const lines = getTextLines(text);

  const addressLines = lines.filter(
    (line) => line.length >= 8 && hasAddressKeywords(line),
  );
  if (addressLines.length > 0) {
    const best = addressLines.sort((a, b) => b.length - a.length)[0];
    const sanitized = sanitizeLocationValue(best, cityValue);
    if (sanitized) {
      const cityMentioned = cityValue
        ? findMentionedCities(best).length > 0
        : false;
      return { value: sanitized, confidence: cityMentioned ? 0.88 : 0.82 };
    }
  }

  const meaningfulLine = lines
    .filter((line) => line.length >= 8)
    .filter((line) => !/^\d+(?:\.|\))/.test(line))
    .filter((line) =>
      NON_LOCATION_LABELS.every(
        (label) => !line.toLowerCase().startsWith(label),
      ),
    )
    .filter((line) => !extractSize(line))
    .filter(
      (line) =>
        !MEDIA_TYPE_MATCHERS.some((item) =>
          item.patterns.some((pattern) => pattern.test(line)),
        ),
    )
    .filter(
      (line) =>
        !COMMON_CITIES.some(
          (city) => city.toLowerCase() === line.toLowerCase(),
        ),
    )
    .filter(
      (line) => !cityValue || line.toLowerCase() !== cityValue.toLowerCase(),
    )
    .sort((a, b) => b.length - a.length)[0];

  if (!meaningfulLine) return null;

  return { value: meaningfulLine, confidence: 0.72 };
}

function isLowQualityOcrText(text: string): boolean {
  if (text.length < 10) return true;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 2) return true;
  const alphaWords = words.filter((w) => /[a-zA-Z]{3,}/.test(w));
  return alphaWords.length / words.length < 0.2;
}

export function analyzeInventorySource(
  unit: InventorySourceUnit,
): InventoryAnalysisResult {
  const rawText = normalizeMultilineText(unit.text || "");

  const ocrText = unit.ocrText
    ? normalizeMultilineText(unit.ocrText)
    : "";

  const useOcr = ocrText && !isLowQualityOcrText(ocrText);
  const mergedText = [rawText, useOcr ? ocrText : ""]
    .filter(Boolean)
    .join("\n");

  const city = extractCity(mergedText);
  const mediaType = extractMediaType(mergedText);
  const size = extractSize(mergedText);
  const location = extractLocation(mergedText, city?.value);

  const fields: Record<BatchInventoryField, Candidate | null> = {
    city,
    mediaType,
    size,
    location,
  };

  const unknownFields = (
    Object.entries(fields) as Array<[BatchInventoryField, Candidate | null]>
  )
    .filter(([, candidate]) => !candidate?.value)
    .map(([field]) => field);

  const confidenceValues = (
    Object.values(fields) as Array<Candidate | null>
  ).map((candidate) => candidate?.confidence ?? 0.35);

  const baseConfidence =
    confidenceValues.reduce((total, value) => total + value, 0) /
    confidenceValues.length;

  const textPenalty = unit.text.trim().length < 20 && !unit.ocrText ? 0.08 : 0;
  const overallConfidence = Math.max(
    0.35,
    Math.min(0.99, baseConfidence - textPenalty),
  );

  return {
    city: city?.value || "Unknown",
    mediaType: mediaType?.value || "Unknown",
    size: size?.value || "Unknown",
    location: location?.value || "Unknown",
    unknownFields,
    confidence: Math.round(overallConfidence * 100),
  };
}
