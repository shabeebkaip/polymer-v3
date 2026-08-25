"use client";
import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import MultiSelect from "@/components/shared/MultiSelect";
import { HelpCircle, CircleAlert, TriangleAlert, X } from "lucide-react";
import type { ProductFormData } from "@/types/product";
import type { AiFilledFields, ConflictItem, TaxonomyReviewItem } from "@/types/ai";
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

const CONFLICT_UNITS: Record<string, string> = {
  density: "g/cm³", mfi: "g/10 min", tensileStrength: "MPa",
  elongationAtBreak: "%", flexuralModulus: "MPa",
  shoreHardness: "Shore A/D", waterAbsorption: "%",
};

function formatConflictValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return String(value ?? "");
}

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
            className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none ${
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
  conflicts: ConflictItem[];
  onResolveConflict: (conflict: ConflictItem, action: "keep" | "use") => void;
  onResolveTaxonomy: (item: TaxonomyReviewItem, action: "use" | "reject") => void;
  onPickFromList: (item: TaxonomyReviewItem) => void;
  grades: Array<{ _id: string; name: string }>;
  completedRequired: number;
  totalRequired: number;
  needsAttentionHeadingId: string;
  foundHeadingId: string;
  requiredHeadingId: string;
  completionTrackerId: string;
  onFocusCompletion: () => void;
}

const CatalogFindings: React.FC<CatalogFindingsProps> = ({
  data, onFieldChange, aiFilledFields, clearAiField, dismissAiField,
  taxonomyReview, conflicts, onResolveConflict, onResolveTaxonomy, onPickFromList, grades,
  completedRequired, totalRequired,
  needsAttentionHeadingId, foundHeadingId, requiredHeadingId,
  completionTrackerId, onFocusCompletion,
}) => {
  const instanceId = React.useId().replace(/:/g, "");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const visibleReview = getVisibleTaxonomyReview(taxonomyReview, data);
  const confirmRows = visibleReview.filter(i => i.tier === "confirm");
  const manualRows = visibleReview.filter(i => i.tier === "manual");
  const showMissingLine = completedRequired < totalRequired && (conflicts.length > 0 || visibleReview.length > 0);
  const missingCount = totalRequired - completedRequired;
  const hasNeedsAttention = conflicts.length > 0 || confirmRows.length > 0 || manualRows.length > 0 || showMissingLine;

  const groupsWithCards = GROUP_ORDER.map(group => ({
    group,
    fields: FIELD_CARDS.filter(f => f.group === group && !!aiFilledFields[f.key]),
  })).filter(g => g.fields.length > 0);

  let firstGroupHeadingAssigned = false;

  const conflictRowId = (conflict: ConflictItem) => `${instanceId}-${conflict.id}`;

  const resolveConflictAndFocus = (conflict: ConflictItem, action: "keep" | "use") => {
    const currentIndex = conflicts.findIndex(item => item.id === conflict.id);
    const nextConflict = currentIndex >= 0 ? conflicts[currentIndex + 1] : undefined;
    onResolveConflict(conflict, action);
    requestAnimationFrame(() => {
      const target = nextConflict
        ? document.getElementById(conflictRowId(nextConflict))
        : rootRef.current?.querySelector<HTMLElement>("[data-taxonomy-review-row]")
          ?? document.getElementById(foundHeadingId)
          ?? document.getElementById(requiredHeadingId);
      if (!target) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
      target.focus();
    });
  };

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
              className={cfg.unit ? `pe-20 ${commonInputCls}` : commonInputCls}
            />
            {cfg.unit && (
              <div dir="ltr" className="absolute end-3 top-2 text-xs text-gray-400 pointer-events-none">
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
    <div ref={rootRef} className="flex flex-col gap-4">
      {/* ── Needs Your Attention (§14.2) ── */}
      {hasNeedsAttention && (
        <div className="flex flex-col gap-2 mb-1">
          <h2
            id={needsAttentionHeadingId}
            tabIndex={-1}
            className="scroll-mt-24 rounded text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1 outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
          >
            Needs Your Attention
          </h2>

          {conflicts.length > 0 && (
            <ul className="flex flex-col gap-2" aria-label="Existing value conflicts">
              {conflicts.map(conflict => {
                const currentValue = (data as Record<string, unknown>)[conflict.fieldKey];
                const unit = CONFLICT_UNITS[conflict.fieldKey];
                const currentLabelId = `${conflictRowId(conflict)}-current-label`;
                const catalogueLabelId = `${conflictRowId(conflict)}-catalogue-label`;
                return (
                  <li key={conflict.id}>
                    <fieldset
                      id={conflictRowId(conflict)}
                      tabIndex={-1}
                      className="scroll-mt-24 min-w-0 rounded-xl border border-amber-200 bg-white px-4 py-4 outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
                    >
                      <legend className="px-1 text-sm font-semibold text-gray-900">
                        {conflict.label}: Different value found
                      </legend>
                      <div className="mt-2 flex items-start gap-2 text-amber-700">
                        <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                        <p className="text-xs">Choose which value to keep.</p>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div role="group" aria-labelledby={currentLabelId} className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <p id={currentLabelId} className="text-xs font-semibold text-gray-600">Your current value</p>
                          <p className="mt-1 break-words text-sm font-medium tabular-nums text-gray-900">
                            <bdi>{formatConflictValue(currentValue)}</bdi>{unit ? <span dir="ltr"> {unit}</span> : null}
                          </p>
                        </div>
                        <div role="group" aria-labelledby={catalogueLabelId} className="min-w-0 rounded-lg border border-teal-200 bg-teal-50/40 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <p id={catalogueLabelId} className="text-xs font-semibold text-gray-600">Catalogue value</p>
                            <span className="rounded border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-xs font-semibold text-teal-700">From catalogue</span>
                          </div>
                          <p className="mt-1 break-words text-sm font-medium tabular-nums text-gray-900">
                            <bdi>{conflict.displayValue}</bdi>{unit ? <span dir="ltr"> {unit}</span> : null}
                            {conflict.conditions ? <span dir="ltr"> ({conflict.conditions})</span> : null}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          aria-label={`Keep current value for ${conflict.label}`}
                          onClick={() => resolveConflictAndFocus(conflict, "keep")}
                          className="min-h-[44px] w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 sm:w-auto"
                        >
                          Keep current
                        </button>
                        <button
                          type="button"
                          aria-label={`Use catalogue value for ${conflict.label}`}
                          onClick={() => resolveConflictAndFocus(conflict, "use")}
                          className="min-h-[44px] w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 sm:w-auto"
                        >
                          Use catalogue value
                        </button>
                      </div>
                    </fieldset>
                  </li>
                );
              })}
            </ul>
          )}

          {confirmRows.map(item => (
            <div key={item.key} data-taxonomy-review-row tabIndex={-1} className="scroll-mt-24 bg-white rounded-xl border border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle aria-hidden="true" className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-medium text-amber-700">Plausible match — please confirm</span>
                </div>
                <p className="text-xs text-gray-500 italic break-words">
                  {item.label}: &ldquo;<bdi>{truncate(item.query)}</bdi>&rdquo;
                </p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  <span aria-hidden="true" className="inline-block rtl:rotate-180">→</span>{" "}<bdi>{item.suggestedName ?? "Unknown"}</bdi>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onResolveTaxonomy(item, "use")}
                  style={{ minHeight: "44px", minWidth: "44px" }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Use this
                </button>
                <button
                  type="button"
                  onClick={() => onResolveTaxonomy(item, "reject")}
                  style={{ minHeight: "44px", minWidth: "44px" }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Not this
                </button>
              </div>
            </div>
          ))}

          {manualRows.map(item => (
            <div key={item.key} data-taxonomy-review-row tabIndex={-1} className="scroll-mt-24 bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <CircleAlert aria-hidden="true" className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-xs font-medium text-gray-600">No confident match — pick manually</span>
                </div>
                <p className="text-xs text-gray-500 break-words">
                  {item.label} — Catalogue said: &ldquo;<bdi>{truncate(item.query)}</bdi>&rdquo;
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPickFromList(item)}
                style={{ minHeight: "44px" }}
                className="shrink-0 min-w-[44px] rounded text-sm font-medium text-teal-700 hover:text-teal-800 underline text-start sm:text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
              >
                Pick from list
              </button>
            </div>
          ))}

          {showMissingLine && (
            <button
              type="button"
              aria-controls={completionTrackerId}
              onClick={onFocusCompletion}
              className="min-h-[44px] rounded text-start text-xs text-teal-700 underline hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              {missingCount} required field{missingCount !== 1 ? "s" : ""} still need attention — see the checklist in the sidebar.
            </button>
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
              className="scroll-mt-24 rounded text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              {group}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(cfg => (
                <div key={cfg.key} className="min-w-0 bg-white rounded-xl border border-teal-200 bg-teal-50/20 px-4 py-3">
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
                      className="text-gray-400 hover:text-gray-600 flex items-center justify-center rounded shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                    >
                      <X aria-hidden="true" className="w-3.5 h-3.5" />
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
