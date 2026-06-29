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

const MEDIA_TYPE_MATCHERS: Array<{ value: string; patterns: RegExp[] }> = [
  {
    value: "Hoardings",
    patterns: [/\bhoarding\b/i, /\bhoardings\b/i, /\bbillboard\b/i],
  },
  {
    value: "Bus Shelters",
    patterns: [/\bbus\s+shelter\b/i, /\bbus\s+shelters\b/i],
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
  return COMMON_CITIES.filter((city) => {
    const pattern = new RegExp(
      `\\b${city.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`,
      "i",
    );
    return pattern.test(text);
  });
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
  if (labeled) return labeled;

  const match = text.match(
    /\b\d{1,3}(?:\.\d{1,2})?\s*(?:x|×|by)\s*\d{1,3}(?:\.\d{1,2})?(?:\s*(?:ft|feet|m|meter|meters|sqm|sq ft|sq\.ft|\"|'))?/i,
  );

  if (!match) return null;

  return {
    value: normalizeWhitespace(match[0].replace(/\s*(?:x|by)\s*/i, " × ")),
    confidence: 0.9,
  };
}

function sanitizeLocationValue(value: string, cityValue?: string) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  if (cityValue && normalized.toLowerCase() === cityValue.toLowerCase()) {
    return null;
  }
  return normalized;
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

export function analyzeInventorySource(
  unit: InventorySourceUnit,
): InventoryAnalysisResult {
  const mergedText = [unit.text, unit.ocrText || ""]
    .filter(Boolean)
    .map((part) => normalizeMultilineText(part))
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
