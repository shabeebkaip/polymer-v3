import { expect, test } from "@playwright/test";
import {
  areAiValuesEqual,
  conflictSuppressionKey,
  isAiValueEmpty,
  partitionAiRows,
} from "../lib/aiConflicts";
import type { DiffRow } from "../types/ai";

const row = (key: string, displayValue: string, label = key): DiffRow => ({
  key,
  label,
  displayValue,
  confidence: "high",
});

test("M-B normalization: numeric representations compare by finite numeric value", () => {
  expect(areAiValuesEqual("flexuralModulus", 2100, "2100")).toBe(true);
  expect(areAiValuesEqual("flexuralModulus", "2100", "2100.0")).toBe(true);
  expect(areAiValuesEqual("density", "not-a-number", 0)).toBe(false);
});

test("M-B normalization: strings trim case-sensitively, arrays compare as sets, booleans compare strictly", () => {
  expect(areAiValuesEqual("leadTime", " 15-20 days ", "15-20 days")).toBe(true);
  expect(areAiValuesEqual("leadTime", "Days", "days")).toBe(false);
  expect(areAiValuesEqual("nonTaxonomyArray", [" B ", "A", "A"], ["A", "B"])).toBe(true);
  expect(areAiValuesEqual("recyclable", false, false)).toBe(true);
  expect(areAiValuesEqual("recyclable", false, true)).toBe(false);
  expect(isAiValueEmpty(false)).toBe(false);
  expect(isAiValueEmpty(0)).toBe(false);
});

test("M-B partition: empty values stay on the M-A path and taxonomy values never become conflicts", () => {
  const rows = [
    row("density", "0.92", "Density"),
    row("chemicalFamily", "Polyolefin", "Chemical Family"),
    row("polymerTypes", "Polypropylene", "Polymer Type"),
    row("industry", "Packaging", "Industry"),
    row("grade", "Grade A", "Grade"),
  ];
  const result = partitionAiRows({
    rows,
    fields: {
      density: 0.92,
      chemicalFamily: "family-new",
      polymerTypes: ["polymer-new"],
      industry: ["industry-new"],
      grade: ["grade-new"],
    },
    existingData: {
      density: "",
      chemicalFamily: "family-current",
      polymerType: "polymer-current",
      industry: ["industry-current"],
      grade: ["grade-current"],
    },
    suppressed: new Set(),
  });

  expect(result.conflicts).toEqual([]);
  expect(result.rows.find(item => item.key === "density")?.skipped).not.toBe(true);
  expect(result.rows.filter(item => item.key !== "density").every(item => item.skipped)).toBe(true);
});

test("M-B partition: false is populated, canonical values are separate from display text", () => {
  const result = partitionAiRows({
    rows: [
      row("recyclable", "Yes", "Recyclable"),
      row("density", "0.92 g/cm³", "Density"),
    ],
    fields: { recyclable: true, density: 0.92 },
    existingData: { recyclable: false, density: "0.95" },
    suppressed: new Set(),
  });

  expect(result.conflicts).toHaveLength(2);
  expect(result.conflicts[0]).toMatchObject({ catalogueValue: true, displayValue: "Yes" });
  expect(result.conflicts[1]).toMatchObject({ catalogueValue: 0.92, displayValue: "0.92 g/cm³" });
});

test("M-B anti-nag and generation replacement: same normalized proposal stays suppressed, a different proposal replaces it", () => {
  const suppressed = new Set([conflictSuppressionKey("density", 0.92)]);
  const first = partitionAiRows({
    rows: [row("density", "0.92", "Density")],
    fields: { density: "0.920" },
    existingData: { density: "0.95" },
    suppressed,
  });
  expect(first.conflicts).toEqual([]);

  const second = partitionAiRows({
    rows: [row("leadTime", "30 days", "Lead Time")],
    fields: { leadTime: "30 days" },
    existingData: { leadTime: "15 days" },
    suppressed,
  });
  expect(second.conflicts.map(item => item.fieldKey)).toEqual(["leadTime"]);
  expect(second.conflicts.some(item => item.fieldKey === "density")).toBe(false);
});
