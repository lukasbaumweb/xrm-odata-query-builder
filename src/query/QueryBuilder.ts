import { OrderBy, OrderByDirection, Query } from "../types/Query";
import { QueryOptions } from "../types/QueryOptions";

/**
 * Regular expression pattern for characters that are not allowed in a column name
 */
const unallowedRegex = /^[a-zA-Z0-9_]+$/;

/**
 * Represents a query builder for constructing OData queries.
 * @template Column The type of columns to be selected in the query
 */
export class QueryBuilder<Column> {
  private query: Query<Column> = {};
  private options: QueryOptions = {};

  /**
   * Creates a new instance of the QueryBuilder class.
   * @param logicalName The logical name of the entity.
   */
  constructor(logicalName: string, options?: QueryOptions) {
    this.query.logicalName = logicalName.trim().length > 0 ? logicalName.trim() : undefined;
    if (this.query.logicalName === undefined) {
      throw new Error("Invalid query: logicalName is required");
    }

    // Make sure the logical name is plural
    if (!options?.ignorePluralization && this.query.logicalName.charAt(-1) !== "s") this.query.logicalName += "s";

    this.options = options ?? {};
  }

  /**
   * Selects columns to be queried
   * @param columns to be selected
   * @returns current query builder
   * @throws Error if column name is not allowed
   * @example
   * const queryBuilder = new QueryBuilder("test");
   * queryBuilder.select("id", "name");
   */
  select(...columns: Column[]): QueryBuilder<Column> {
    if (!this.query.select) this.query.select = new Set<Column>();

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];

      if (unallowedRegex.test(col as string)) {
        this.query.select?.add(col);
        continue;
      } else {
        throw new Error(`Column "${col}" is not allowed`);
      }
    }

    return this;
  }

  orderBy(column: Column, direction: OrderByDirection = "asc"): QueryBuilder<Column> {
    if (!this.query.orderBy) this.query.orderBy = new Set<OrderBy<Column>>();
    this.query.orderBy.add({ column, direction });
    return this;
  }

  private validateAndThrow(): void {
    if (!this.query.logicalName) throw new Error("Invalid query: logicalName is invalid or missing");
  }

  // private removeTrailingQuestionMark = (query: string): string => {
  //   return query.indexOf("?") === query.length - 1 ? query.slice(0, -1) : query;
  // };

  /**
   * Builds the query
   * @returns the query
   * @throws Error if query is invalid
   * @example
   * const queryBuilder = new QueryBuilder("test");
   * queryBuilder.select("id", "name");
   * const query = queryBuilder.build();
   */
  build(): string {
    this.validateAndThrow();

    const urlPath: string[] = [];

    const finalQuery: string[] = [];

    if (this.options.includeFullAPIPath)
      urlPath.push(`${this.options.orgURL ?? "https://example.api.crm4.dynamics.com"}/api/data/${this.options.apiVersion ?? "v9.1"}`);

    urlPath.push(`/${this.query.logicalName}?`);

    if (this.query.select !== undefined) {
      finalQuery.push(`$select=${Array.from(this.query.select)?.join(",")}`);
    }

    if (this.query.orderBy !== undefined) {
      finalQuery.push(
        `$orderby=${Array.from(this.query.orderBy)
          ?.map((o) => `${o.column} ${o.direction}`)
          ?.join(",")}`
      );
    }

    const query = `${urlPath.join("")}${finalQuery.join("&")}`;
    console.debug(query);

    return this.options.encodeURI ? encodeURI(query) : query;
  }
}
