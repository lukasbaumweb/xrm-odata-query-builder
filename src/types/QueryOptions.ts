/**
 * Represents the options for a query.
 */
export type QueryOptions = {
  // TODO: Add support for this option
  includeAnnotations?: boolean;
} & (
  | {
      includeFullAPIPath: true;
      apiVersion: string;
      orgURL: string;
    }
  | {
      includeFullAPIPath?: false;
      apiVersion?: string;
      orgURL?: string;
    }
);
