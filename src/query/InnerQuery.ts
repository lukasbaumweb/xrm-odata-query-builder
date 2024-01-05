import { QueryBuilder } from "./QueryBuilder";
import { InnerQueryOptions } from "../types/QueryOptions";

export class InnerQuery<Column> extends QueryBuilder<Column> {
  constructor(logicalName: string) {
    super(logicalName, {
      ignorePluralization: true,
    } satisfies InnerQueryOptions);
  }

  build(): string {
    this.validateAndThrow();

    const finalQuery: string[] = [];

    if (this.query.select) {
      finalQuery.push(`$select=${Array.from(this.query.select)?.join(",")}`);
    }

    if (this.query.orderBy) {
      finalQuery.push(
        `$orderby=${Array.from(this.query.orderBy)
          ?.map((o) => `${o.column} ${o.direction}`)
          ?.join(",")}`
      );
    }

    if (this.query.expand) {
      finalQuery.push(
        `$expand=${Array.from(this.query.expand)
          ?.map((e) => `${e.query.logicalName}(${e.build()})`)
          ?.join(",")}`
      );
    }

    const expandedQuery = `${this.query.logicalName}${finalQuery.length > 0 ? `(${finalQuery.join(";")})` : ""}`;
    return expandedQuery;
  }
}
