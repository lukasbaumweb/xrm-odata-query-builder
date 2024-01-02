import { Query } from "../types/Query";
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

  validate(): boolean {
    if (!this.query.logicalName) return false;
    return true;
  }

  private validateAndThrow(): void {
    if (!this.query.logicalName) throw new Error("Invalid query: logicalName is invalid or missing");
  }

  private removeTrailingQuestionMark = (query: string): string => {
    return query.indexOf("?") === query.length - 1 ? query.slice(0, -1) : query;
  };

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

    const finalQuery: string[] = [];

    if (this.options.includeFullAPIPath)
      finalQuery.push(`${this.options.orgURL ?? "https://example.api.crm4.dynamics.com"}/api/data/${this.options.apiVersion ?? "v9.1"}`);

    finalQuery.push(`/${this.query.logicalName}?`);

    if (this.query.select !== undefined) {
      finalQuery.push(`$select=${Array.from(this.query.select)?.join(",")}`);
    }

    const query = `${this.removeTrailingQuestionMark(finalQuery.join(""))}`;
    console.debug(query);

    return query;
  }
}
