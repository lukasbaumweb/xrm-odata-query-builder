
# XRM OData Querybuilder

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

The Dynamics365QueryBuilder is a specialized TypeScript library tailored for building OData queries specifically designed for Microsoft Dynamics 365 APIs.  
Dynamics 365, a suite of business applications, utilizes OData as its underlying protocol, and this library streamlines the process of constructing queries for Dynamics 365 services.


## Important Notice

This project is currently work in progress and should not be used in production. You can use this library for pre building your queries

## Features

**### WORK IN PROGRESS ###**
<!--

- Dynamics 365 Compatibility: Exclusively tailored for Microsoft Dynamics 365 APIs, guaranteeing queries meet the specific requirements of Dynamics 365 OData implementation.
- Entity-aware Query Building: Designed with Dynamics 365 entity awareness, facilitating intuitive construction of queries for entities, attributes, and relationships within the Dynamics 365 ecosystem.
- Type-Safe Dynamics 365 Entities: Utilizes TypeScript's static typing for type safety, providing developers with compile-time feedback and IntelliSense support during query construction.
- 
- -->


## Installation

Install xrm-odata-query-builder with npm

```bash
  npm install xrm-odata-query-builder
```
    
## Usage/Examples

### Build simple query

```typescript
import { QueryBuilder } from "xrm-odata-query-builder";

const simpleSelectQuery = new QueryBuilder("account");
simpleSelectQuery.select("revenue", "name");
simpleSelectQuery.build() 
// /accounts?$select=accountid,name
```

### Add your entity as type

```typescript
import { QueryBuilder } from "xrm-odata-query-builder";

type accountColumns = {
  accountid: string;
  name?: string;
  description?: string;
  revenue?: number;
  processid?: string | null;
};

const strictColumnNamesQuery = new QueryBuilder<keyof accountColumns>("account");
strictColumnNamesQuery.select("accountid", "description", "revenue", "name");
strictColumnNamesQuery.build() 
// /accounts?$select=accountid,name,description,revenue
```

### Add Organization and API Details

```typescript
import { QueryBuilder } from "xrm-odata-query-builder";

const fullURLQuery = new QueryBuilder("account", {
  includeFullAPIPath: true,
  apiVersion: "9.2",
  orgURL: "https://example.api.crm4.dynamics.com",
});
fullURLQuery.select("revenue", "name");
fullURLQuery.build(); 
// https://example.api.crm4.dynamics.com/api/data/9.2/accounts?select=revenue,name
```

### Expand Query

```typescript
import { QueryBuilder } from "xrm-odata-query-builder";

 const queryBuilder = new QueryBuilder("account");
  queryBuilder.select("accountid", "name", "description", "revenue");

  queryBuilder.expand(
    new InnerQuery("transactioncurrencyid").select("transactioncurrencyid", "currencyname").orderBy("transactioncurrencyid", "asc")
  );

  queryBuilder.build();
// /accounts?$select=accountid,name,description,revenue&$expand=transactioncurrencyid($select=transactioncurrencyid,currencyname;$orderby=transactioncurrencyid asc)
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Roadmap

### Must have
- [x] Selecting
- [x] Ordering
- [x] Expanding
- [ ] Filtering
- [ ] Pagination
- [ ] Counting
- [ ] Compilation (Add Option for building queries during compilation)
- [ ] Transform OData Queries to human readable format
- [ ] browser support

### Nice to have

- [ ] Check for semantic errors like "Only $select and $filter clause can be provided while doing $expand on many-to-one relationship or nested one-to-many relationship."

## Related

Here are some related projects and sources

### Projects

- [odata-query](https://www.npmjs.com/package/odata-query)
- [more-xrm](https://www.npmjs.com/package/more-xrm)

### Sources

- [Microsoft Learn](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-data-web-api)

## Authors

- [@lukasbaumweb](https://github.com/lukasbaumweb)


## Contributing

Coming Soon

<!--- 

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

-->


## License

MIT License

Copyright (c) 2024 Lukas Baum

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

