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
  private _query: Query<Column> = {};

  get query(): Query<Column> {
    return this._query;
  }

  protected options: QueryOptions = {};

  /**
   * Creates a new instance of the QueryBuilder class.
   * @param logicalName The logical name of the entity.
   */
  constructor(logicalName: string, options?: QueryOptions) {
    this._query.logicalName = logicalName.trim().length > 0 ? logicalName.trim() : undefined;
    if (this._query.logicalName === undefined) {
      throw new Error("Invalid query: logicalName is required");
    }

    // Make sure the logical name is plural
    if (!options?.ignorePluralization && this._query.logicalName.charAt(-1) !== "s") this._query.logicalName += "s";

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
    if (!this._query.select) this._query.select = new Set<Column>();

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];

      if (unallowedRegex.test(col as string)) {
        this._query.select?.add(col);
        continue;
      } else {
        throw new Error(`Column "${col}" is not allowed`);
      }
    }

    return this;
  }

  /**
   * Adds an order by clause to the query.
   * @param column The column to order by.
   * @param direction The direction of the ordering. Default is "asc".
   * @returns The QueryBuilder instance.
   * @example
   * const queryBuilder = new QueryBuilder("test");
   * queryBuilder.orderBy("id", "desc");
   * queryBuilder.orderBy("name");
   */
  orderBy(column: Column, direction: OrderByDirection = "asc"): QueryBuilder<Column> {
    if (!this._query.orderBy) this._query.orderBy = new Set<OrderBy<Column>>();

    if (Array.from(this._query.orderBy).some((o) => o.column === column)) {
      throw new Error(`Column "${column}" is already in the order by clause`);
    }

    this._query.orderBy.add({ column, direction });
    return this;
  }

  expand(expandedQuery: QueryBuilder<Column>): QueryBuilder<Column> {
    if (!this._query.expand) this._query.expand = new Set<QueryBuilder<Column>>();

    if (Array.from(this._query.expand).some((e) => e._query.logicalName === expandedQuery._query.logicalName)) {
      throw new Error(`Logical name "${expandedQuery._query.logicalName}" is already in the expand clause`);
    }

    this._query.expand.add(expandedQuery);

    return this;
  }

  protected validateAndThrow(): void {
    if (!this._query.logicalName) throw new Error("Invalid query: logicalName is invalid or missing");
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

    urlPath.push(`/${this._query.logicalName}?`);

    if (this._query.select) {
      finalQuery.push(`$select=${Array.from(this._query.select)?.join(",")}`);
    }

    if (this._query.orderBy) {
      finalQuery.push(
        `$orderby=${Array.from(this._query.orderBy)
          ?.map((o) => `${o.column} ${o.direction}`)
          ?.join(",")}`
      );
    }

    if (this._query.expand) {
      finalQuery.push(
        `$expand=${Array.from(this._query.expand)
          ?.map((e) => e.build())
          ?.join(",")}`
      );
    }

    const query = `${urlPath.join("")}${finalQuery.join("&")}`;
    console.debug(query);

    return this.options.encodeURI ? encodeURI(query) : query;
  }
}
