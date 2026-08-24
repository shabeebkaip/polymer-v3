"use client";
import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import MultiSelect from "@/components/shared/MultiSelect";
import { HelpCircle, CircleAlert, X } from "lucide-react";
import type { ProductFormData } from "@/types/product";
import type { AiFilledFields, TaxonomyReviewItem } from "@/types/ai";
import { AVAILABILITY_OPTIONS } from "./QuickAddProduct";

// ─── DESIGN_SPEC §14 — "Found in Your Catalogue" + "Needs Your Attention" ──────
// Layers a review surface between the compact source bar and the Required
// Information card. Renders only when the caller has aiFillCount > 0 (guarded
// by AddEditProduct.tsx, not here).

type FieldKind = "text" | "textarea" | "number" | "boolean" | "multiselect" | "chip";

type GroupName =
  | "Product Identity" | "Technical Properties" | "Packaging & Logistics"
  | "Certifications & Compliance" | "Other";

interface FieldCardConfig {
  key: string;
  label: string;
  group: GroupName;
  kind: FieldKind;
  unit?: string; // static SI unit label, reused from TechnicalProperties.tsx (§14.3 — no live `_unit` read needed)
  chipOptions?: { value: string; label: string }[];
}

// §14.4 grouping table + §21.9 point 3's confirmed safe list. Taxonomy fields
// that already live in the Required card (chemicalFamily/physicalForm/
// polymerType/industry) are excluded — they surface via §14.2 instead, never here.
const FIELD_CARDS: FieldCardConfig[] = [
  { key: "tradeName", label: "Trade Name", group: "Product Identity", kind: "text" },
  { key: "description", label: "Description", group: "Product Identity", kind: "textarea" },
  { key: "manufacturingMethod", label: "Manufacturing Method", group: "Product Identity", kind: "text" },
  { key: "countryOfOrigin", label: "Country of Origin", group: "Product Identity", kind: "text" },
  { key: "color", label: "Color", group: "Product Identity", kind: "text" },
  { key: "materialType", label: "Material Type", group: "Product Identity", kind: "chip", chipOptions: [{ value: "Virgin", label: "Virgin" }, { value: "Recycled", label: "Recycled" }] },
  { key: "form", label: "Form", group: "Product Identity", kind: "chip", chipOptions: [{ value: "Pellets", label: "Pellets" }, { value: "Powder", label: "Powder" }, { value: "Flakes", label: "Flakes" }, { value: "Regrind", label: "Regrind" }] },
  { key: "supplierType", label: "Supplier Type", group: "Product Identity", kind: "chip", chipOptions: [{ value: "Manufacturer", label: "Manufacturer" }, { value: "Distributor", label: "Distributor" }, { value: "Trader", label: "Trader" }] },

  { key: "density", label: "Density", group: "Technical Properties", kind: "number", unit: "g/cm³" },
  { key: "mfi", label: "MFI", group: "Technical Properties", kind: "number", unit: "g/10 min" },
  { key: "tensileStrength", label: "Tensile Strength", group: "Technical Properties", kind: "number", unit: "MPa" },
  { key: "elongationAtBreak", label: "Elongation at Break", group: "Technical Properties", kind: "number", unit: "%" },
  { key: "flexuralModulus", label: "Flexural Modulus", group: "Technical Properties", kind: "number", unit: "MPa" },
  { key: "shoreHardness", label: "Shore Hardness", group: "Technical Properties", kind: "number", unit: "Shore A/D" },
  { key: "waterAbsorption", label: "Water Absorption", group: "Technical Properties", kind: "number", unit: "%" },
  { key: "additives", label: "Additives", group: "Technical Properties", kind: "text" },
  { key: "grade", label: "Grade", group: "Technical Properties", kind: "multiselect" },

  { key: "packagingWeight", label: "Packaging Weight", group: "Packaging & Logistics", kind: "text" },
  { key: "storageConditions", label: "Storage Conditions", group: "Packaging & Logistics", kind: "text" },
  { key: "shelfLife", label: "Shelf Life", group: "Packaging & Logistics", kind: "text" },
  { key: "leadTime", label: "Lead Time", group: "Packaging & Logistics", kind: "text" },

  { key: "recyclable", label: "Recyclable", group: "Certifications & Compliance", kind: "boolean" },
  { key: "bioDegradable", label: "Bio-Degradable", group: "Certifications & Compliance", kind: "boolean" },
  { key: "fdaApproved", label: "FDA Approved", group: "Certifications & Compliance", kind: "boolean" },
  { key: "medicalGrade", label: "Medical Grade", group: "Certifications & Compliance", kind: "boolean" },

  { key: "priceTerms", label: "Price Terms", group: "Other", kind: "chip", chipOptions: [{ value: "fixed", label: "Fixed" }, { value: "negotiable", label: "Negotiable" }] },
  { key: "availability", label: "Availability", group: "Other", kind: "chip", chipOptions: AVAILABILITY_OPTIONS.map(o => ({ value: o.value, label: o.label })) },
];

// Documents & Images intentionally has zero entries (§14.4) — the extractor
// never returns document/image data; the heading is named for forward
// compatibility only and must never render.
const GROUP_ORDER: GroupName[] = ["Product Identity", "Technical Properties", "Packaging & Logistics", "Certifications & Compliance", "Other"];

// Live-visibility rule (§14.2): confirm-tier rows are removed from state on
// resolve; manual-tier rows passively disappear once the seller fills the
// real field through any path (its own dropdown, or "Use this" elsewhere).
export function getVisibleTaxonomyReview(items: TaxonomyReviewItem[], data: ProductFormData): TaxonomyReviewItem[] {
  return items.filter(item => {
    if (item.tier !== "manual") return true;
    const v = (data as Record<string, unknown>)[item.formKey];
    return item.isArray ? !(Array.isArray(v) && v.length > 0) : !(v != null && v !== "");
  });
}

function truncate(text: string, max = 120) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function ChipGroup({ id, labelledBy, options, value, onChange }: { id: string; labelledBy: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div id={id} className="flex flex-wrap gap-1.5" role="group" aria-labelledby={labelledBy}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors min-h-[36px] ${
              active ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function AiChip() {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
      ✦ AI
    </span>
  );
}

interface CatalogFindingsProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | number | boolean | string[] | undefined) => void;
  aiFilledFields: AiFilledFields;
  clearAiField: (field: string) => void;
  dismissAiField: (field: string) => void;
  taxonomyReview: TaxonomyReviewItem[];
  onResolveTaxonomy: (item: TaxonomyReviewItem, action: "use" | "reject") => void;
  onPickFromList: (item: TaxonomyReviewItem) => void;
  grades: Array<{ _id: string; name: string }>;
  completedRequired: number;
  totalRequired: number;
  needsAttentionHeadingId: string;
  foundHeadingId: string;
}

const CatalogFindings: React.FC<CatalogFindingsProps> = ({
  data, onFieldChange, aiFilledFields, clearAiField, dismissAiField,
  taxonomyReview, onResolveTaxonomy, onPickFromList, grades,
  completedRequired, totalRequired,
  needsAttentionHeadingId, foundHeadingId,
}) => {
  const instanceId = React.useId().replace(/:/g, "");
  const visibleReview = getVisibleTaxonomyReview(taxonomyReview, data);
  const confirmRows = visibleReview.filter(i => i.tier === "confirm");
  const manualRows = visibleReview.filter(i => i.tier === "manual");
  const showMissingLine = completedRequired < totalRequired && visibleReview.length > 0;
  const missingCount = totalRequired - completedRequired;
  const hasNeedsAttention = confirmRows.length > 0 || manualRows.length > 0 || showMissingLine;

  const groupsWithCards = GROUP_ORDER.map(group => ({
    group,
    fields: FIELD_CARDS.filter(f => f.group === group && !!aiFilledFields[f.key]),
  })).filter(g => g.fields.length > 0);

  let firstGroupHeadingAssigned = false;

  const renderValue = (cfg: FieldCardConfig) => {
    const raw = (data as Record<string, unknown>)[cfg.key];
    const controlId = `${instanceId}-${cfg.key}`;
    const labelId = `${controlId}-label`;
    const commonInputCls = "h-9 text-sm border-teal-200 focus:border-teal-400";

    const handleChange = (value: string | number | boolean | string[]) => {
      clearAiField(cfg.key);
      onFieldChange(cfg.key as keyof ProductFormData, value);
    };

    switch (cfg.kind) {
      case "textarea":
        return (
          <Textarea
            id={controlId}
            value={(raw as string) || ""}
            onChange={e => handleChange(e.target.value)}
            className={`min-h-[70px] text-sm resize-y border-teal-200 focus:border-teal-400`}
            rows={2}
          />
        );
      case "number":
        return (
          <div className="relative">
            <Input
              id={controlId}
              type="number"
              step="0.01"
              value={(raw as string | number) ?? ""}
              onChange={e => handleChange(e.target.value)}
              className={cfg.unit ? `pr-20 ${commonInputCls}` : commonInputCls}
            />
            {cfg.unit && (
              <div className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">
                {cfg.unit}
                {cfg.key === "mfi" && aiFilledFields.mfi?.conditions && ` (${aiFilledFields.mfi.conditions})`}
              </div>
            )}
          </div>
        );
      case "boolean":
        return (
          <div className="flex items-center gap-2 w-fit" role="group" aria-labelledby={labelId}>
            <Checkbox id={controlId} checked={!!raw} onCheckedChange={v => handleChange(Boolean(v))} className="w-4 h-4" />
            <span className="text-sm text-gray-700">{raw ? "Yes" : "No"}</span>
          </div>
        );
      case "multiselect":
        return (
          <MultiSelect
            id={controlId}
            ariaLabelledby={labelId}
            label=""
            placeholder="Select applicable grades"
            options={grades}
            selected={(raw as string[]) || []}
            onChange={selected => handleChange(selected)}
          />
        );
      case "chip":
        return (
          <ChipGroup
            id={controlId}
            labelledBy={labelId}
            options={cfg.chipOptions ?? []}
            value={(raw as string) || ""}
            onChange={v => handleChange(v)}
          />
        );
      default:
        return (
          <Input
            id={controlId}
            value={(raw as string) || ""}
            onChange={e => handleChange(e.target.value)}
            className={commonInputCls}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Needs Your Attention (§14.2) ── */}
      {hasNeedsAttention && (
        <div className="flex flex-col gap-2 mb-1">
          <h2
            id={needsAttentionHeadingId}
            tabIndex={-1}
            className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1 outline-none"
          >
            Needs Your Attention
          </h2>

          {confirmRows.map(item => (
            <div key={item.key} className="bg-white rounded-xl border border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-medium text-amber-700">Plausible match — please confirm</span>
                </div>
                <p className="text-xs text-gray-500 italic truncate">
                  {item.label}: &ldquo;{truncate(item.query)}&rdquo;
                </p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  → {item.suggestedName ?? "Unknown"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onResolveTaxonomy(item, "use")}
                  style={{ minHeight: "44px", minWidth: "44px" }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                >
                  Use this
                </button>
                <button
                  type="button"
                  onClick={() => onResolveTaxonomy(item, "reject")}
                  style={{ minHeight: "44px", minWidth: "44px" }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Not this
                </button>
              </div>
            </div>
          ))}

          {manualRows.map(item => (
            <div key={item.key} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <CircleAlert className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-xs font-medium text-gray-600">No confident match — pick manually</span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {item.label} — Catalogue said: &ldquo;{truncate(item.query)}&rdquo;
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPickFromList(item)}
                style={{ minHeight: "44px" }}
                className="shrink-0 text-sm font-medium text-teal-700 hover:text-teal-800 underline text-left sm:text-center"
              >
                Pick from list
              </button>
            </div>
          ))}

          {showMissingLine && (
            <a
              href="#completion-tracker"
              className="text-xs text-gray-500 underline text-teal-700 hover:text-teal-800 sm:no-underline sm:text-gray-500 sm:pointer-events-none sm:hover:text-gray-500"
            >
              {missingCount} required field{missingCount !== 1 ? "s" : ""} still need attention — see the checklist in the sidebar.
            </a>
          )}
        </div>
      )}

      {/* ── Found in Your Catalogue (§14.3/§14.4) ── */}
      {groupsWithCards.map(({ group, fields }) => {
        const isFirstGroup = !firstGroupHeadingAssigned;
        if (isFirstGroup) firstGroupHeadingAssigned = true;
        return (
          <div key={group}>
            <h2
              id={isFirstGroup ? foundHeadingId : undefined}
              tabIndex={isFirstGroup ? -1 : undefined}
              className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 outline-none"
            >
              {group}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(cfg => (
                <div key={cfg.key} className="bg-white rounded-xl border border-teal-200 bg-teal-50/20 px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Label
                      id={`${instanceId}-${cfg.key}-label`}
                      htmlFor={`${instanceId}-${cfg.key}`}
                      className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                    >
                      {cfg.label}
                      <AiChip />
                    </Label>
                    <button
                      type="button"
                      onClick={() => dismissAiField(cfg.key)}
                      aria-label={`Remove ${cfg.label} from catalogue`}
                      style={{ minHeight: "44px", minWidth: "44px" }}
                      className="text-gray-400 hover:text-gray-600 flex items-center justify-center rounded shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {renderValue(cfg)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CatalogFindings;
