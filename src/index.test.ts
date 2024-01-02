import { QueryBuilder } from "./index";

test("select columns are added", () => {
  const queryBuilder = new QueryBuilder("account");
  queryBuilder.select("accountid", "name");
  expect(queryBuilder.build()).toBe("/account?$select=accountid,name");
});

test("should throw error when trying to build the query without valid logicalname is missing", () => {
  try {
    const queryBuilder = new QueryBuilder("");
    queryBuilder.build();
  } catch (e) {
    expect((e as { message: string }).message).toBe("Invalid query: logicalName is required");
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
  expect(queryBuilder.build()).toBe("/account?$select=accountid,name,description,revenue");
});

test("should return full URL if Instance API URL is provided", () => {
  const queryBuilder = new QueryBuilder("account", {
    includeFullAPIPath: true,
    apiVersion: "9.2",
    orgURL: "https://example.api.crm4.dynamics.com",
  });
  queryBuilder.select("revenue", "name");
  queryBuilder.build();
  expect(queryBuilder.build()).toBe("https://example.api.crm4.dynamics.com/api/data/9.2/account?$select=revenue,name");
});
