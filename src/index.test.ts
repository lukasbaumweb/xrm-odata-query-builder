import { QueryBuilder } from "./index";

test("select columns are added", () => {
  const queryBuilder = new QueryBuilder("account");
  queryBuilder.select("accountid", "name");
  expect(queryBuilder.build()).toBe("/accounts?$select=accountid,name");
});

test("should throw error when trying to build the query without valid logicalname is missing", () => {
  try {
    const queryBuilder = new QueryBuilder("");
    queryBuilder.build();
  } catch (e) {
    expect((e as { message: string }).message).toBe("Invalid query: logicalName is required");
  }
});

test("should throw error when trying to build the query with invalid column names", () => {
  const invalidColumnName = ".invalid";
  try {
    const queryBuilder = new QueryBuilder("account");
    queryBuilder.select(invalidColumnName);
    queryBuilder.build();
  } catch (e) {
    expect((e as { message: string }).message).toBe(`Column "${invalidColumnName}" is not allowed`);
  }
});

type accountColumns = {
  accountid: string;
  name?: string;
  description?: string;
  revenue?: number;
  processid?: string | null;
};

test("should only accept provided column names", () => {
  const queryBuilder = new QueryBuilder<keyof accountColumns>("account");
  queryBuilder.select("accountid", "name", "description", "revenue");
  expect(queryBuilder.build()).toBe("/accounts?$select=accountid,name,description,revenue");
});

test("should return full URL if Instance API URL is provided", () => {
  const queryBuilder = new QueryBuilder("account", {
    includeFullAPIPath: true,
    apiVersion: "9.2",
    orgURL: "https://example.api.crm4.dynamics.com",
  });
  queryBuilder.select("revenue", "name");
  queryBuilder.build();
  expect(queryBuilder.build()).toBe("https://example.api.crm4.dynamics.com/api/data/9.2/accounts?$select=revenue,name");
});

test("should add orderby query", () => {
  const queryBuilder = new QueryBuilder("account");
  queryBuilder.select("accountid", "name", "description", "revenue");
  queryBuilder.orderBy("name", "asc");
  expect(queryBuilder.build()).toBe("/accounts?$select=accountid,name,description,revenue&$orderby=name asc");

  queryBuilder.orderBy("revenue", "desc");
  expect(queryBuilder.build()).toBe("/accounts?$select=accountid,name,description,revenue&$orderby=name asc,revenue desc");
});

test("should throw error if user tries to add the same column twice as orderBy clause", () => {
  try {
    const queryBuilder = new QueryBuilder("account");
    queryBuilder.select("accountid", "name", "description", "revenue");
    queryBuilder.orderBy("name", "asc");
    expect(queryBuilder.build()).toBe("/accounts?$select=accountid,name,description,revenue&$orderby=name asc");

    queryBuilder.orderBy("name", "desc");
    expect(queryBuilder.build()).toBe("/accounts?$select=accountid,name,description,revenue&$orderby=name asc,revenue desc");
  } catch (e) {
    expect((e as { message: string }).message).toBe(`Column "name" is already in the order by clause`);
  }
});

test("should encode query", () => {
  const queryBuilder = new QueryBuilder("account", { encodeURI: true });
  queryBuilder.select("accountid", "name", "description", "revenue");
  queryBuilder.orderBy("name", "asc");
  expect(queryBuilder.build()).toBe("/accounts?$select=accountid,name,description,revenue&$orderby=name%20asc");
});
