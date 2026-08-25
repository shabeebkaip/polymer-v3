import type { ConflictItem, ConflictValue, DiffRow } from "@/types/ai";

const NUMERIC_FIELDS = new Set([
  "density", "mfi", "tensileStrength", "elongationAtBreak",
  "flexuralModulus", "shoreHardness", "waterAbsorption",
  "minimum_order_quantity", "stock", "price",
]);

const TAXONOMY_FIELDS = new Set([
  "chemicalFamily", "physicalForm", "polymerTypes", "polymerType",
  "industry", "grade",
]);

export function isAiValueEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  return typeof value === "string" && value.trim() === "";
}

function normalizedArray(value: unknown[]): string[] {
  return [...new Set(value.map(item => String(item).trim()).filter(Boolean))].sort();
}

export function areAiValuesEqual(fieldKey: string, current: unknown, catalogue: unknown): boolean {
  if (Array.isArray(current) || Array.isArray(catalogue)) {
    if (!Array.isArray(current) || !Array.isArray(catalogue)) return false;
    return JSON.stringify(normalizedArray(current)) === JSON.stringify(normalizedArray(catalogue));
  }

  if (NUMERIC_FIELDS.has(fieldKey)) {
    const currentNumber = Number(current);
    const catalogueNumber = Number(catalogue);
    if (Number.isFinite(currentNumber) && Number.isFinite(catalogueNumber)) {
      return currentNumber === catalogueNumber;
    }
  }

  if (typeof current === "boolean" || typeof catalogue === "boolean") {
    return typeof current === "boolean" && typeof catalogue === "boolean" && current === catalogue;
  }

  return String(current).trim() === String(catalogue).trim();
}

export function conflictSuppressionKey(fieldKey: string, catalogueValue: ConflictValue): string {
  if (Array.isArray(catalogueValue)) {
    return `${fieldKey}:array:${JSON.stringify(normalizedArray(catalogueValue))}`;
  }
  if (NUMERIC_FIELDS.has(fieldKey)) {
    const numeric = Number(catalogueValue);
    if (Number.isFinite(numeric)) return `${fieldKey}:number:${numeric}`;
  }
  if (typeof catalogueValue === "boolean") return `${fieldKey}:boolean:${catalogueValue}`;
  return `${fieldKey}:string:${String(catalogueValue).trim()}`;
}

function currentValueForRow(existingData: Record<string, unknown>, rowKey: string): unknown {
  return rowKey === "polymerTypes" ? existingData.polymerType : existingData[rowKey];
}

export function partitionAiRows({
  rows,
  fields,
  existingData,
  suppressed,
}: {
  rows: DiffRow[];
  fields: Record<string, unknown>;
  existingData?: Record<string, unknown>;
  suppressed: ReadonlySet<string>;
}): { rows: DiffRow[]; conflicts: ConflictItem[] } {
  if (!existingData) return { rows, conflicts: [] };

  const conflicts: ConflictItem[] = [];
  const partitionedRows = rows.map(row => {
    const currentValue = currentValueForRow(existingData, row.key);
    if (isAiValueEmpty(currentValue)) return row;

    const skippedRow = { ...row, skipped: true };
    if (TAXONOMY_FIELDS.has(row.key)) return skippedRow;

    const catalogueValue = fields[row.key] as ConflictValue | undefined;
    if (catalogueValue === undefined || areAiValuesEqual(row.key, currentValue, catalogueValue)) {
      return skippedRow;
    }

    if (!suppressed.has(conflictSuppressionKey(row.key, catalogueValue))) {
      conflicts.push({
        id: `conflict-${row.key}`,
        fieldKey: row.key,
        label: row.label,
        catalogueValue,
        displayValue: row.displayValue,
        confidence: row.confidence,
        conditions: row.conditions,
      });
    }
    return skippedRow;
  });

  return { rows: partitionedRows, conflicts };
}
