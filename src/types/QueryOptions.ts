/**
 * Represents the options for a query.
 */
export type QueryOptions = {
  encodeURI?: boolean;
  ignorePluralization?: boolean;
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

/**
 * Represents the options for a inner/expanded query.
 */
export type InnerQueryOptions = {
  ignorePluralization?: boolean;
};
