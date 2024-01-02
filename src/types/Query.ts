export interface Query<Column> {
  logicalName?: string;
  select?: Set<Column>;
  filter?: Set<string>;
  orderBy?: Set<string>;
  groupBy?: Set<string>;
}
