import { FilterOperator } from "./Operator";

export type FilterValue = string | number | boolean | null | undefined;

export interface Filter {
  attribute: string;
  operator: FilterOperator;
  value: FilterValue;
}
