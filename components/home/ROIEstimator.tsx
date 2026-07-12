"use client";

import { useMemo, useState } from "react";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { whatsappLink } from "@/lib/site";

const campaignTypes = [
  "Outdoor Hoardings",
  "Transit Media",
  "Events",
  "Combined 360°",
] as const;

const budgets = [
  { value: 5, label: "₹5L" },
  { value: 10, label: "₹10L" },
  { value: 25, label: "₹25L" },
  { value: 50, label: "₹50L" },
  { value: 100, label: "₹1Cr+" },
] as const;

const cityTiers = ["Tier 1", "Tier 2", "Tier 3", "PAN India"] as const;
const durations = ["1 Week", "1 Month", "3 Months"] as const;

type CampaignType = (typeof campaignTypes)[number];
type Budget = (typeof budgets)[number]["value"];
type CityTier = (typeof cityTiers)[number];
type Duration = (typeof durations)[number];

type EstimateInput = {
  campaignType: CampaignType;
  budget: Budget;
  cityTier: CityTier;
  duration: Duration;
};

type EstimateOutput = {
  impressions: number;
  cities: number;
  reach: number;
  mediaMix: string;
};

const impressionsPerLakh: Record<CampaignType, number> = {
  "Outdoor Hoardings": 180000,
  "Transit Media": 220000,
  Events: 60000,
  "Combined 360°": 150000,
};

const durationFactors: Record<Duration, number> = {
  "1 Week": 0.5,
  "1 Month": 1,
  "3 Months": 2.6,
};

const baseCities: Record<CityTier, number> = {
  "Tier 1": 8,
  "Tier 2": 25,
  "Tier 3": 60,
  "PAN India": 120,
};

const mediaMixes: Record<CampaignType, string> = {
  "Outdoor Hoardings": "80% OOH · 15% Transit · 5% Digital",
  "Transit Media": "70% Transit · 20% OOH · 10% Digital",
  Events: "60% Events · 25% OOH · 15% Digital",
  "Combined 360°": "45% OOH · 30% Transit · 15% Digital · 10% Events",
};

function formatIndianNumber(value: number) {
  return Math.round(value).toLocaleString("en-IN");
}

function estimateCampaignROI({
  campaignType,
  budget,
  cityTier,
  duration,
}: EstimateInput): EstimateOutput {
  const impressions =
    impressionsPerLakh[campaignType] * budget * durationFactors[duration];
  const budgetScale = Math.floor(budget / 25) * 5;
  const scaledCities = baseCities[cityTier] + budgetScale;
  const cities = cityTier === "PAN India" ? Math.min(scaledCities, 400) : scaledCities;

  return {
    impressions: Math.round(impressions),
    cities,
    reach: Math.round(impressions * 0.42),
    mediaMix: mediaMixes[campaignType],
  };
}

function toggleClass(isActive: boolean) {
  const base =
    "min-h-9 md:min-h-11 cursor-pointer rounded-full border px-3 py-1.5 md:px-4 md:py-2 text-[12px] md:text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 active:scale-[0.98]";

  return isActive
    ? `${base} border-amber bg-amber text-ink shadow-[inset_0_-1px_0_rgba(17,17,17,0.12)] hover:bg-amber-deep`
    : `${base} border-[#f0f0f0] bg-surface text-body hover:border-ink/20 hover:text-ink`;
}

type ToggleOption<T extends string | number> = {
  value: T;
  label: string;
};

type ToggleGroupProps<T extends string | number> = {
  id: string;
  label: string;
  options: readonly ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

function ToggleGroup<T extends string | number>({
  id,
  label,
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="space-y-2">
      <div
        id={id}
        className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted"
      >
        {label}
      </div>
      <div
        aria-labelledby={id}
        className="flex flex-wrap gap-2"
        role="group"
      >
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={isActive}
              className={toggleClass(isActive)}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="border-l border-[#f0f0f0] pl-2.5 md:border-l-0 md:pl-0 md:border-t md:pt-5 first:border-l-0 first:pl-0 first:md:border-t-0 first:md:pt-0">
      <p className="text-[9px] md:text-[0.68rem] font-semibold uppercase tracking-[0.06em] md:tracking-[0.18em] text-muted leading-tight">
        {label}
      </p>
      <div className="mt-1 md:mt-2 flex items-end gap-1 md:gap-2">
        <AnimatedCounter
          value={value}
          className="font-mono text-xs sm:text-sm md:text-4xl font-semibold leading-none text-ink"
        />
        {suffix ? (
          <span className="pb-0.5 text-[9px] sm:text-sm font-medium text-muted">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}

export function ROIEstimator() {
  const [campaignType, setCampaignType] = useState<CampaignType>("Outdoor Hoardings");
  const [budget, setBudget] = useState<Budget>(10);
  const [cityTier, setCityTier] = useState<CityTier>("Tier 1");
  const [duration, setDuration] = useState<Duration>("1 Month");

  const estimate = useMemo(
    () =>
      estimateCampaignROI({
        campaignType,
        budget,
        cityTier,
        duration,
      }),
    [campaignType, budget, cityTier, duration]
  );

  const whatsappHref = whatsappLink(
    `Hi, I'd like a precise media plan for a ${campaignType} campaign with a ₹${budget}L budget.`
  );

  return (
    <section id="roi-estimator" className="bg-surface-2 py-6 md:py-16">
      <div className="container-bsm">
        <Reveal className="max-w-3xl">
          <h2 className="mt-3 md:mt-5 max-w-2xl font-display text-2xl md:text-6xl font-semibold leading-tight tracking-tight text-ink">
            Estimate Your Campaign Reach
          </h2>
          <p className="mt-2 md:mt-5 max-w-2xl text-[13px] md:text-lg leading-relaxed md:leading-8 text-body">
            Get a rough sense of what your budget can achieve across India.
          </p>
        </Reveal>

        <Reveal
          delay={0.12}
          className="mt-6 md:mt-12 rounded-[1.6rem] bg-surface-2 p-1.5 md:p-2 ring-1 ring-black/5"
        >
          <div className="grid gap-5 rounded-[1.25rem] bg-surface p-4 md:grid-cols-[1.08fr_0.92fr] md:gap-10 md:p-10">
            <div className="space-y-5 md:space-y-8">
              <ToggleGroup
                id="roi-campaign-type"
                label="Campaign type"
                options={campaignTypes.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={campaignType}
                onChange={setCampaignType}
              />

              <ToggleGroup
                id="roi-budget"
                label="Budget"
                options={budgets}
                value={budget}
                onChange={setBudget}
              />

              <ToggleGroup
                id="roi-city-tier"
                label="Target cities"
                options={cityTiers.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={cityTier}
                onChange={setCityTier}
              />

              <ToggleGroup
                id="roi-duration"
                label="Duration"
                options={durations.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={duration}
                onChange={setDuration}
              />
            </div>

            <aside className="rounded-[1rem] border border-[#f0f0f0] bg-surface-2 p-4 md:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4 md:pb-5">
                <div>
                  <p className="text-[10px] md:text-[0.68rem] font-semibold uppercase tracking-[0.12em] md:tracking-[0.18em] text-muted">
                    Live estimate
                  </p>
                  <p className="mt-1 md:mt-2 text-xs md:text-sm leading-normal md:leading-6 text-body">
                    Based on Indian OOH planning benchmarks.
                  </p>
                </div>
                <div
                  aria-hidden
                  className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_6px_rgba(255,193,7,0.16)]"
                />
              </div>

              <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:block md:space-y-5">
                <Metric
                  label="Est. Impressions"
                  value={`${formatIndianNumber(estimate.impressions)}+`}
                />
                <Metric
                  label="Cities Covered"
                  value={formatIndianNumber(estimate.cities)}
                />
                <Metric
                  label="Estimated Reach"
                  value={`${formatIndianNumber(estimate.reach)}+`}
                />

                <div className="border-t border-[#f0f0f0] pt-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted mb-2.5">
                    Recommended Media Mix
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {estimate.mediaMix.split("·").map((item) => {
                      const trimmed = item.trim();
                      const parts = trimmed.split(" ");
                      const percentage = parts[0];
                      const label = parts.slice(1).join(" ");
                      return (
                        <span
                          key={trimmed}
                          className="inline-flex shrink-0 items-center rounded-lg bg-surface border border-[#e5e5e5] px-2 py-1 text-[11px] shadow-sm"
                        >
                          <span className="font-mono font-extrabold text-ink mr-1">{percentage}</span>
                          <span className="text-[10px] text-muted">{label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[#f0f0f0] pt-6">
                <p className="text-sm leading-6 text-muted">
                  Want a precise media plan with actual rates?
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ButtonLink href="/contact" variant="primary">
                    Get Free Media Plan
                  </ButtonLink>
                  <a
                    href={whatsappHref}
                    className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-ink transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
                  >
                    Discuss on WhatsApp
                  </a>
                </div>
                <p className="mt-4 text-xs leading-5 text-muted">
                  *Estimates are indicative. Actual reach depends on location, season, and creative quality.
                </p>
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
