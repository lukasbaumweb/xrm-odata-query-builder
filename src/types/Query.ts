export type OrderByDirection = "asc" | "desc";
export interface OrderBy<Column> {
  column: Column;
  direction: OrderByDirection;
}

export interface Query<Column> {
  logicalName?: string;
  select?: Set<Column>;
  filter?: Set<string>;
  orderBy?: Set<OrderBy<Column>>;
  groupBy?: Set<string>;
}
