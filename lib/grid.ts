/**
 * Bento grid geometry: the projects section is a 12-column CSS grid with
 * implicit rows. These helpers are shared by the admin form and the API
 * routes so client and server enforce the same placement rules.
 */

export interface GridRect {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
}

export const GRID_COLS = 12;
export const GRID_MAX_ROW_SPAN = 5;

export function overlaps(a: GridRect, b: GridRect): boolean {
  return (
    a.col < b.col + b.colSpan &&
    a.col + a.colSpan > b.col &&
    a.row < b.row + b.rowSpan &&
    a.row + a.rowSpan > b.row
  );
}

export function clampRect(r: Partial<GridRect>): GridRect {
  const colSpan = Math.max(1, Math.min(GRID_COLS, Math.floor(r.colSpan ?? 1)));
  const rowSpan = Math.max(
    1,
    Math.min(GRID_MAX_ROW_SPAN, Math.floor(r.rowSpan ?? 1)),
  );
  return {
    colSpan,
    rowSpan,
    col: Math.max(1, Math.min(GRID_COLS - colSpan + 1, Math.floor(r.col ?? 1))),
    row: Math.max(1, Math.floor(r.row ?? 1)),
  };
}

/**
 * First-fit scan for a free slot, row by row. Always returns a position
 * that does not overlap any rect in `others`, appending a new row when
 * the existing rows are full.
 */
export function findFreeSlot(
  others: GridRect[],
  colSpan: number,
  rowSpan: number,
): { col: number; row: number } {
  const maxRow = Math.max(
    3,
    ...others.map((p) => p.row + p.rowSpan),
    0,
  );
  for (let r = 1; r <= maxRow; r++) {
    for (let c = 1; c <= GRID_COLS - colSpan + 1; c++) {
      const candidate = { col: c, row: r, colSpan, rowSpan };
      if (!others.some((p) => overlaps(candidate, p))) return { col: c, row: r };
    }
  }
  return { col: 1, row: maxRow + 1 };
}
