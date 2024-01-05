import { QueryBuilder } from "../query/QueryBuilder";

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
  expand?: Set<QueryBuilder<Column>>;
  groupBy?: Set<string>;
}
