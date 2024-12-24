import { Table } from "@src/types/book.types";

export const ensureDefaults = (table: Table): Table => ({
  ...table,
  itemsPerPage: table.itemsPerPage || 5,
  columnCount: table.columnCount || 3,
}); 