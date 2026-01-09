# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListCareLevels*](#listcarelevels)
  - [*ListVisitReasons*](#listvisitreasons)
  - [*ListServiceTypes*](#listservicetypes)
  - [*ListServiceItems*](#listserviceitems)
  - [*GetStaffByFirebaseUid*](#getstaffbyfirebaseuid)
  - [*ListStaff*](#liststaff)
  - [*ListClients*](#listclients)
  - [*GetClient*](#getclient)
  - [*ListSchedulesByDateRange*](#listschedulesbydaterange)
  - [*ListSchedulesByStaff*](#listschedulesbystaff)
  - [*ListVisitRecordsByClient*](#listvisitrecordsbyclient)
  - [*ListVisitRecordsByDateRange*](#listvisitrecordsbydaterange)
  - [*GetVisitRecord*](#getvisitrecord)
  - [*ListReportsByClient*](#listreportsbyclient)
  - [*ListReportsByFacility*](#listreportsbyfacility)
  - [*ListCarePlansByClient*](#listcareplansbyclient)
- [**Mutations**](#mutations)
  - [*CreateClient*](#createclient)
  - [*UpdateClient*](#updateclient)
  - [*DeleteClient*](#deleteclient)
  - [*CreateSchedule*](#createschedule)
  - [*UpdateSchedule*](#updateschedule)
  - [*DeleteSchedule*](#deleteschedule)
  - [*CancelSchedule*](#cancelschedule)
  - [*CompleteSchedule*](#completeschedule)
  - [*CreateVisitRecord*](#createvisitrecord)
  - [*UpdateVisitRecord*](#updatevisitrecord)
  - [*DeleteVisitRecord*](#deletevisitrecord)
  - [*CreateReport*](#createreport)
  - [*UpdateReportPdf*](#updatereportpdf)
  - [*CreateCarePlan*](#createcareplan)
  - [*SeedCareLevel*](#seedcarelevel)
  - [*SeedVisitReason*](#seedvisitreason)
  - [*CreateFacility*](#createfacility)
  - [*CreateStaff*](#createstaff)
  - [*CreateServiceType*](#createservicetype)
  - [*CreateServiceItem*](#createserviceitem)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@sanwa-houkai-app/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@sanwa-houkai-app/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@sanwa-houkai-app/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListCareLevels
You can execute the `ListCareLevels` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCareLevels(): QueryPromise<ListCareLevelsData, undefined>;

interface ListCareLevelsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCareLevelsData, undefined>;
}
export const listCareLevelsRef: ListCareLevelsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCareLevels(dc: DataConnect): QueryPromise<ListCareLevelsData, undefined>;

interface ListCareLevelsRef {
  ...
  (dc: DataConnect): QueryRef<ListCareLevelsData, undefined>;
}
export const listCareLevelsRef: ListCareLevelsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCareLevelsRef:
```typescript
const name = listCareLevelsRef.operationName;
console.log(name);
```

### Variables
The `ListCareLevels` query has no variables.
### Return Type
Recall that executing the `ListCareLevels` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCareLevelsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCareLevelsData {
  careLevels: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & CareLevel_Key)[];
}
```
### Using `ListCareLevels`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCareLevels } from '@sanwa-houkai-app/dataconnect';


// Call the `listCareLevels()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCareLevels();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCareLevels(dataConnect);

console.log(data.careLevels);

// Or, you can use the `Promise` API.
listCareLevels().then((response) => {
  const data = response.data;
  console.log(data.careLevels);
});
```

### Using `ListCareLevels`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCareLevelsRef } from '@sanwa-houkai-app/dataconnect';


// Call the `listCareLevelsRef()` function to get a reference to the query.
const ref = listCareLevelsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCareLevelsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.careLevels);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.careLevels);
});
```

## ListVisitReasons
You can execute the `ListVisitReasons` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listVisitReasons(): QueryPromise<ListVisitReasonsData, undefined>;

interface ListVisitReasonsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVisitReasonsData, undefined>;
}
export const listVisitReasonsRef: ListVisitReasonsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVisitReasons(dc: DataConnect): QueryPromise<ListVisitReasonsData, undefined>;

interface ListVisitReasonsRef {
  ...
  (dc: DataConnect): QueryRef<ListVisitReasonsData, undefined>;
}
export const listVisitReasonsRef: ListVisitReasonsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVisitReasonsRef:
```typescript
const name = listVisitReasonsRef.operationName;
console.log(name);
```

### Variables
The `ListVisitReasons` query has no variables.
### Return Type
Recall that executing the `ListVisitReasons` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVisitReasonsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListVisitReasonsData {
  visitReasons: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & VisitReason_Key)[];
}
```
### Using `ListVisitReasons`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVisitReasons } from '@sanwa-houkai-app/dataconnect';


// Call the `listVisitReasons()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVisitReasons();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVisitReasons(dataConnect);

console.log(data.visitReasons);

// Or, you can use the `Promise` API.
listVisitReasons().then((response) => {
  const data = response.data;
  console.log(data.visitReasons);
});
```

### Using `ListVisitReasons`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVisitReasonsRef } from '@sanwa-houkai-app/dataconnect';


// Call the `listVisitReasonsRef()` function to get a reference to the query.
const ref = listVisitReasonsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVisitReasonsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.visitReasons);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.visitReasons);
});
```

## ListServiceTypes
You can execute the `ListServiceTypes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listServiceTypes(vars: ListServiceTypesVariables): QueryPromise<ListServiceTypesData, ListServiceTypesVariables>;

interface ListServiceTypesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServiceTypesVariables): QueryRef<ListServiceTypesData, ListServiceTypesVariables>;
}
export const listServiceTypesRef: ListServiceTypesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServiceTypes(dc: DataConnect, vars: ListServiceTypesVariables): QueryPromise<ListServiceTypesData, ListServiceTypesVariables>;

interface ListServiceTypesRef {
  ...
  (dc: DataConnect, vars: ListServiceTypesVariables): QueryRef<ListServiceTypesData, ListServiceTypesVariables>;
}
export const listServiceTypesRef: ListServiceTypesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServiceTypesRef:
```typescript
const name = listServiceTypesRef.operationName;
console.log(name);
```

### Variables
The `ListServiceTypes` query requires an argument of type `ListServiceTypesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListServiceTypesVariables {
  facilityId: UUIDString;
}
```
### Return Type
Recall that executing the `ListServiceTypes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServiceTypesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListServiceTypesData {
  serviceTypes: ({
    id: UUIDString;
    code?: string | null;
    name: string;
    category: string;
    color?: string | null;
    sortOrder?: number | null;
  } & ServiceType_Key)[];
}
```
### Using `ListServiceTypes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServiceTypes, ListServiceTypesVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListServiceTypes` query requires an argument of type `ListServiceTypesVariables`:
const listServiceTypesVars: ListServiceTypesVariables = {
  facilityId: ..., 
};

// Call the `listServiceTypes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServiceTypes(listServiceTypesVars);
// Variables can be defined inline as well.
const { data } = await listServiceTypes({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServiceTypes(dataConnect, listServiceTypesVars);

console.log(data.serviceTypes);

// Or, you can use the `Promise` API.
listServiceTypes(listServiceTypesVars).then((response) => {
  const data = response.data;
  console.log(data.serviceTypes);
});
```

### Using `ListServiceTypes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServiceTypesRef, ListServiceTypesVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListServiceTypes` query requires an argument of type `ListServiceTypesVariables`:
const listServiceTypesVars: ListServiceTypesVariables = {
  facilityId: ..., 
};

// Call the `listServiceTypesRef()` function to get a reference to the query.
const ref = listServiceTypesRef(listServiceTypesVars);
// Variables can be defined inline as well.
const ref = listServiceTypesRef({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServiceTypesRef(dataConnect, listServiceTypesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceTypes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceTypes);
});
```

## ListServiceItems
You can execute the `ListServiceItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listServiceItems(vars: ListServiceItemsVariables): QueryPromise<ListServiceItemsData, ListServiceItemsVariables>;

interface ListServiceItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServiceItemsVariables): QueryRef<ListServiceItemsData, ListServiceItemsVariables>;
}
export const listServiceItemsRef: ListServiceItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServiceItems(dc: DataConnect, vars: ListServiceItemsVariables): QueryPromise<ListServiceItemsData, ListServiceItemsVariables>;

interface ListServiceItemsRef {
  ...
  (dc: DataConnect, vars: ListServiceItemsVariables): QueryRef<ListServiceItemsData, ListServiceItemsVariables>;
}
export const listServiceItemsRef: ListServiceItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServiceItemsRef:
```typescript
const name = listServiceItemsRef.operationName;
console.log(name);
```

### Variables
The `ListServiceItems` query requires an argument of type `ListServiceItemsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListServiceItemsVariables {
  serviceTypeId: UUIDString;
}
```
### Return Type
Recall that executing the `ListServiceItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServiceItemsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListServiceItemsData {
  serviceItems: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & ServiceItem_Key)[];
}
```
### Using `ListServiceItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServiceItems, ListServiceItemsVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListServiceItems` query requires an argument of type `ListServiceItemsVariables`:
const listServiceItemsVars: ListServiceItemsVariables = {
  serviceTypeId: ..., 
};

// Call the `listServiceItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServiceItems(listServiceItemsVars);
// Variables can be defined inline as well.
const { data } = await listServiceItems({ serviceTypeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServiceItems(dataConnect, listServiceItemsVars);

console.log(data.serviceItems);

// Or, you can use the `Promise` API.
listServiceItems(listServiceItemsVars).then((response) => {
  const data = response.data;
  console.log(data.serviceItems);
});
```

### Using `ListServiceItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServiceItemsRef, ListServiceItemsVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListServiceItems` query requires an argument of type `ListServiceItemsVariables`:
const listServiceItemsVars: ListServiceItemsVariables = {
  serviceTypeId: ..., 
};

// Call the `listServiceItemsRef()` function to get a reference to the query.
const ref = listServiceItemsRef(listServiceItemsVars);
// Variables can be defined inline as well.
const ref = listServiceItemsRef({ serviceTypeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServiceItemsRef(dataConnect, listServiceItemsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceItems);
});
```

## GetStaffByFirebaseUid
You can execute the `GetStaffByFirebaseUid` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getStaffByFirebaseUid(vars: GetStaffByFirebaseUidVariables): QueryPromise<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;

interface GetStaffByFirebaseUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByFirebaseUidVariables): QueryRef<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;
}
export const getStaffByFirebaseUidRef: GetStaffByFirebaseUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffByFirebaseUid(dc: DataConnect, vars: GetStaffByFirebaseUidVariables): QueryPromise<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;

interface GetStaffByFirebaseUidRef {
  ...
  (dc: DataConnect, vars: GetStaffByFirebaseUidVariables): QueryRef<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;
}
export const getStaffByFirebaseUidRef: GetStaffByFirebaseUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffByFirebaseUidRef:
```typescript
const name = getStaffByFirebaseUidRef.operationName;
console.log(name);
```

### Variables
The `GetStaffByFirebaseUid` query requires an argument of type `GetStaffByFirebaseUidVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffByFirebaseUidVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetStaffByFirebaseUid` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffByFirebaseUidData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStaffByFirebaseUidData {
  staffs: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    role?: string | null;
    facility: {
      id: UUIDString;
      name: string;
    } & Facility_Key;
  } & Staff_Key)[];
}
```
### Using `GetStaffByFirebaseUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffByFirebaseUid, GetStaffByFirebaseUidVariables } from '@sanwa-houkai-app/dataconnect';

// The `GetStaffByFirebaseUid` query requires an argument of type `GetStaffByFirebaseUidVariables`:
const getStaffByFirebaseUidVars: GetStaffByFirebaseUidVariables = {
  uid: ..., 
};

// Call the `getStaffByFirebaseUid()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffByFirebaseUid(getStaffByFirebaseUidVars);
// Variables can be defined inline as well.
const { data } = await getStaffByFirebaseUid({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffByFirebaseUid(dataConnect, getStaffByFirebaseUidVars);

console.log(data.staffs);

// Or, you can use the `Promise` API.
getStaffByFirebaseUid(getStaffByFirebaseUidVars).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

### Using `GetStaffByFirebaseUid`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffByFirebaseUidRef, GetStaffByFirebaseUidVariables } from '@sanwa-houkai-app/dataconnect';

// The `GetStaffByFirebaseUid` query requires an argument of type `GetStaffByFirebaseUidVariables`:
const getStaffByFirebaseUidVars: GetStaffByFirebaseUidVariables = {
  uid: ..., 
};

// Call the `getStaffByFirebaseUidRef()` function to get a reference to the query.
const ref = getStaffByFirebaseUidRef(getStaffByFirebaseUidVars);
// Variables can be defined inline as well.
const ref = getStaffByFirebaseUidRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffByFirebaseUidRef(dataConnect, getStaffByFirebaseUidVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

## ListStaff
You can execute the `ListStaff` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listStaff(vars: ListStaffVariables): QueryPromise<ListStaffData, ListStaffVariables>;

interface ListStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStaffVariables): QueryRef<ListStaffData, ListStaffVariables>;
}
export const listStaffRef: ListStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStaff(dc: DataConnect, vars: ListStaffVariables): QueryPromise<ListStaffData, ListStaffVariables>;

interface ListStaffRef {
  ...
  (dc: DataConnect, vars: ListStaffVariables): QueryRef<ListStaffData, ListStaffVariables>;
}
export const listStaffRef: ListStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStaffRef:
```typescript
const name = listStaffRef.operationName;
console.log(name);
```

### Variables
The `ListStaff` query requires an argument of type `ListStaffVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListStaffVariables {
  facilityId: UUIDString;
}
```
### Return Type
Recall that executing the `ListStaff` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStaffData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListStaffData {
  staffs: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    role?: string | null;
  } & Staff_Key)[];
}
```
### Using `ListStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStaff, ListStaffVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListStaff` query requires an argument of type `ListStaffVariables`:
const listStaffVars: ListStaffVariables = {
  facilityId: ..., 
};

// Call the `listStaff()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStaff(listStaffVars);
// Variables can be defined inline as well.
const { data } = await listStaff({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStaff(dataConnect, listStaffVars);

console.log(data.staffs);

// Or, you can use the `Promise` API.
listStaff(listStaffVars).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

### Using `ListStaff`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStaffRef, ListStaffVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListStaff` query requires an argument of type `ListStaffVariables`:
const listStaffVars: ListStaffVariables = {
  facilityId: ..., 
};

// Call the `listStaffRef()` function to get a reference to the query.
const ref = listStaffRef(listStaffVars);
// Variables can be defined inline as well.
const ref = listStaffRef({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStaffRef(dataConnect, listStaffVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

## ListClients
You can execute the `ListClients` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listClients(vars: ListClientsVariables): QueryPromise<ListClientsData, ListClientsVariables>;

interface ListClientsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListClientsVariables): QueryRef<ListClientsData, ListClientsVariables>;
}
export const listClientsRef: ListClientsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listClients(dc: DataConnect, vars: ListClientsVariables): QueryPromise<ListClientsData, ListClientsVariables>;

interface ListClientsRef {
  ...
  (dc: DataConnect, vars: ListClientsVariables): QueryRef<ListClientsData, ListClientsVariables>;
}
export const listClientsRef: ListClientsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listClientsRef:
```typescript
const name = listClientsRef.operationName;
console.log(name);
```

### Variables
The `ListClients` query requires an argument of type `ListClientsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListClientsVariables {
  facilityId: UUIDString;
}
```
### Return Type
Recall that executing the `ListClients` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListClientsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListClientsData {
  clients: ({
    id: UUIDString;
    name: string;
    nameKana?: string | null;
    gender?: string | null;
    careLevel?: {
      name: string;
    };
      phone?: string | null;
      addressPrefecture?: string | null;
      addressCity?: string | null;
  } & Client_Key)[];
}
```
### Using `ListClients`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listClients, ListClientsVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListClients` query requires an argument of type `ListClientsVariables`:
const listClientsVars: ListClientsVariables = {
  facilityId: ..., 
};

// Call the `listClients()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listClients(listClientsVars);
// Variables can be defined inline as well.
const { data } = await listClients({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listClients(dataConnect, listClientsVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
listClients(listClientsVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `ListClients`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listClientsRef, ListClientsVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListClients` query requires an argument of type `ListClientsVariables`:
const listClientsVars: ListClientsVariables = {
  facilityId: ..., 
};

// Call the `listClientsRef()` function to get a reference to the query.
const ref = listClientsRef(listClientsVars);
// Variables can be defined inline as well.
const ref = listClientsRef({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listClientsRef(dataConnect, listClientsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clients);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

## GetClient
You can execute the `GetClient` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getClient(vars: GetClientVariables): QueryPromise<GetClientData, GetClientVariables>;

interface GetClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
}
export const getClientRef: GetClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClient(dc: DataConnect, vars: GetClientVariables): QueryPromise<GetClientData, GetClientVariables>;

interface GetClientRef {
  ...
  (dc: DataConnect, vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
}
export const getClientRef: GetClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientRef:
```typescript
const name = getClientRef.operationName;
console.log(name);
```

### Variables
The `GetClient` query requires an argument of type `GetClientVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetClient` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientData {
  client?: {
    id: UUIDString;
    name: string;
    nameKana?: string | null;
    gender?: string | null;
    birthDate?: DateString | null;
    careLevel?: {
      id: UUIDString;
      name: string;
    } & CareLevel_Key;
      addressPrefecture?: string | null;
      addressCity?: string | null;
      phone?: string | null;
      careManager?: string | null;
      careOffice?: string | null;
      emergencyPhone?: string | null;
      emergencyName?: string | null;
      emergencyRelation?: string | null;
      assessment?: unknown | null;
      lastAssessmentDate?: DateString | null;
      regularServices?: unknown | null;
      notes?: string | null;
      isActive: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & Client_Key;
}
```
### Using `GetClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClient, GetClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `GetClient` query requires an argument of type `GetClientVariables`:
const getClientVars: GetClientVariables = {
  id: ..., 
};

// Call the `getClient()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClient(getClientVars);
// Variables can be defined inline as well.
const { data } = await getClient({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClient(dataConnect, getClientVars);

console.log(data.client);

// Or, you can use the `Promise` API.
getClient(getClientVars).then((response) => {
  const data = response.data;
  console.log(data.client);
});
```

### Using `GetClient`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientRef, GetClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `GetClient` query requires an argument of type `GetClientVariables`:
const getClientVars: GetClientVariables = {
  id: ..., 
};

// Call the `getClientRef()` function to get a reference to the query.
const ref = getClientRef(getClientVars);
// Variables can be defined inline as well.
const ref = getClientRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientRef(dataConnect, getClientVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.client);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.client);
});
```

## ListSchedulesByDateRange
You can execute the `ListSchedulesByDateRange` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listSchedulesByDateRange(vars: ListSchedulesByDateRangeVariables): QueryPromise<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;

interface ListSchedulesByDateRangeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSchedulesByDateRangeVariables): QueryRef<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;
}
export const listSchedulesByDateRangeRef: ListSchedulesByDateRangeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSchedulesByDateRange(dc: DataConnect, vars: ListSchedulesByDateRangeVariables): QueryPromise<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;

interface ListSchedulesByDateRangeRef {
  ...
  (dc: DataConnect, vars: ListSchedulesByDateRangeVariables): QueryRef<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;
}
export const listSchedulesByDateRangeRef: ListSchedulesByDateRangeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSchedulesByDateRangeRef:
```typescript
const name = listSchedulesByDateRangeRef.operationName;
console.log(name);
```

### Variables
The `ListSchedulesByDateRange` query requires an argument of type `ListSchedulesByDateRangeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSchedulesByDateRangeVariables {
  facilityId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}
```
### Return Type
Recall that executing the `ListSchedulesByDateRange` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSchedulesByDateRangeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSchedulesByDateRangeData {
  schedules: ({
    id: UUIDString;
    scheduledDate: DateString;
    startTime: string;
    endTime: string;
    status?: string | null;
    notes?: string | null;
    client: {
      id: UUIDString;
      name: string;
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
        serviceType?: {
          id: UUIDString;
          name: string;
          category: string;
          color?: string | null;
        } & ServiceType_Key;
  } & Schedule_Key)[];
}
```
### Using `ListSchedulesByDateRange`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSchedulesByDateRange, ListSchedulesByDateRangeVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListSchedulesByDateRange` query requires an argument of type `ListSchedulesByDateRangeVariables`:
const listSchedulesByDateRangeVars: ListSchedulesByDateRangeVariables = {
  facilityId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `listSchedulesByDateRange()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSchedulesByDateRange(listSchedulesByDateRangeVars);
// Variables can be defined inline as well.
const { data } = await listSchedulesByDateRange({ facilityId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSchedulesByDateRange(dataConnect, listSchedulesByDateRangeVars);

console.log(data.schedules);

// Or, you can use the `Promise` API.
listSchedulesByDateRange(listSchedulesByDateRangeVars).then((response) => {
  const data = response.data;
  console.log(data.schedules);
});
```

### Using `ListSchedulesByDateRange`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSchedulesByDateRangeRef, ListSchedulesByDateRangeVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListSchedulesByDateRange` query requires an argument of type `ListSchedulesByDateRangeVariables`:
const listSchedulesByDateRangeVars: ListSchedulesByDateRangeVariables = {
  facilityId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `listSchedulesByDateRangeRef()` function to get a reference to the query.
const ref = listSchedulesByDateRangeRef(listSchedulesByDateRangeVars);
// Variables can be defined inline as well.
const ref = listSchedulesByDateRangeRef({ facilityId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSchedulesByDateRangeRef(dataConnect, listSchedulesByDateRangeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.schedules);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.schedules);
});
```

## ListSchedulesByStaff
You can execute the `ListSchedulesByStaff` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listSchedulesByStaff(vars: ListSchedulesByStaffVariables): QueryPromise<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;

interface ListSchedulesByStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSchedulesByStaffVariables): QueryRef<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;
}
export const listSchedulesByStaffRef: ListSchedulesByStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSchedulesByStaff(dc: DataConnect, vars: ListSchedulesByStaffVariables): QueryPromise<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;

interface ListSchedulesByStaffRef {
  ...
  (dc: DataConnect, vars: ListSchedulesByStaffVariables): QueryRef<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;
}
export const listSchedulesByStaffRef: ListSchedulesByStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSchedulesByStaffRef:
```typescript
const name = listSchedulesByStaffRef.operationName;
console.log(name);
```

### Variables
The `ListSchedulesByStaff` query requires an argument of type `ListSchedulesByStaffVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSchedulesByStaffVariables {
  staffId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}
```
### Return Type
Recall that executing the `ListSchedulesByStaff` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSchedulesByStaffData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSchedulesByStaffData {
  schedules: ({
    id: UUIDString;
    scheduledDate: DateString;
    startTime: string;
    endTime: string;
    status?: string | null;
    notes?: string | null;
    client: {
      id: UUIDString;
      name: string;
    } & Client_Key;
      serviceType?: {
        id: UUIDString;
        name: string;
        category: string;
        color?: string | null;
      } & ServiceType_Key;
  } & Schedule_Key)[];
}
```
### Using `ListSchedulesByStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSchedulesByStaff, ListSchedulesByStaffVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListSchedulesByStaff` query requires an argument of type `ListSchedulesByStaffVariables`:
const listSchedulesByStaffVars: ListSchedulesByStaffVariables = {
  staffId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `listSchedulesByStaff()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSchedulesByStaff(listSchedulesByStaffVars);
// Variables can be defined inline as well.
const { data } = await listSchedulesByStaff({ staffId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSchedulesByStaff(dataConnect, listSchedulesByStaffVars);

console.log(data.schedules);

// Or, you can use the `Promise` API.
listSchedulesByStaff(listSchedulesByStaffVars).then((response) => {
  const data = response.data;
  console.log(data.schedules);
});
```

### Using `ListSchedulesByStaff`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSchedulesByStaffRef, ListSchedulesByStaffVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListSchedulesByStaff` query requires an argument of type `ListSchedulesByStaffVariables`:
const listSchedulesByStaffVars: ListSchedulesByStaffVariables = {
  staffId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `listSchedulesByStaffRef()` function to get a reference to the query.
const ref = listSchedulesByStaffRef(listSchedulesByStaffVars);
// Variables can be defined inline as well.
const ref = listSchedulesByStaffRef({ staffId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSchedulesByStaffRef(dataConnect, listSchedulesByStaffVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.schedules);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.schedules);
});
```

## ListVisitRecordsByClient
You can execute the `ListVisitRecordsByClient` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listVisitRecordsByClient(vars: ListVisitRecordsByClientVariables): QueryPromise<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;

interface ListVisitRecordsByClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVisitRecordsByClientVariables): QueryRef<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;
}
export const listVisitRecordsByClientRef: ListVisitRecordsByClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVisitRecordsByClient(dc: DataConnect, vars: ListVisitRecordsByClientVariables): QueryPromise<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;

interface ListVisitRecordsByClientRef {
  ...
  (dc: DataConnect, vars: ListVisitRecordsByClientVariables): QueryRef<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;
}
export const listVisitRecordsByClientRef: ListVisitRecordsByClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVisitRecordsByClientRef:
```typescript
const name = listVisitRecordsByClientRef.operationName;
console.log(name);
```

### Variables
The `ListVisitRecordsByClient` query requires an argument of type `ListVisitRecordsByClientVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListVisitRecordsByClientVariables {
  clientId: UUIDString;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `ListVisitRecordsByClient` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVisitRecordsByClientData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListVisitRecordsByClientData {
  visitRecords: ({
    id: UUIDString;
    visitDate: DateString;
    startTime: string;
    endTime: string;
    vitals?: unknown | null;
    services: unknown;
    notes?: string | null;
    staff: {
      id: UUIDString;
      name: string;
    } & Staff_Key;
      visitReason?: {
        name: string;
      };
  } & VisitRecord_Key)[];
}
```
### Using `ListVisitRecordsByClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVisitRecordsByClient, ListVisitRecordsByClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListVisitRecordsByClient` query requires an argument of type `ListVisitRecordsByClientVariables`:
const listVisitRecordsByClientVars: ListVisitRecordsByClientVariables = {
  clientId: ..., 
  limit: ..., // optional
};

// Call the `listVisitRecordsByClient()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVisitRecordsByClient(listVisitRecordsByClientVars);
// Variables can be defined inline as well.
const { data } = await listVisitRecordsByClient({ clientId: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVisitRecordsByClient(dataConnect, listVisitRecordsByClientVars);

console.log(data.visitRecords);

// Or, you can use the `Promise` API.
listVisitRecordsByClient(listVisitRecordsByClientVars).then((response) => {
  const data = response.data;
  console.log(data.visitRecords);
});
```

### Using `ListVisitRecordsByClient`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVisitRecordsByClientRef, ListVisitRecordsByClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListVisitRecordsByClient` query requires an argument of type `ListVisitRecordsByClientVariables`:
const listVisitRecordsByClientVars: ListVisitRecordsByClientVariables = {
  clientId: ..., 
  limit: ..., // optional
};

// Call the `listVisitRecordsByClientRef()` function to get a reference to the query.
const ref = listVisitRecordsByClientRef(listVisitRecordsByClientVars);
// Variables can be defined inline as well.
const ref = listVisitRecordsByClientRef({ clientId: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVisitRecordsByClientRef(dataConnect, listVisitRecordsByClientVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.visitRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.visitRecords);
});
```

## ListVisitRecordsByDateRange
You can execute the `ListVisitRecordsByDateRange` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listVisitRecordsByDateRange(vars: ListVisitRecordsByDateRangeVariables): QueryPromise<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;

interface ListVisitRecordsByDateRangeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVisitRecordsByDateRangeVariables): QueryRef<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;
}
export const listVisitRecordsByDateRangeRef: ListVisitRecordsByDateRangeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVisitRecordsByDateRange(dc: DataConnect, vars: ListVisitRecordsByDateRangeVariables): QueryPromise<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;

interface ListVisitRecordsByDateRangeRef {
  ...
  (dc: DataConnect, vars: ListVisitRecordsByDateRangeVariables): QueryRef<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;
}
export const listVisitRecordsByDateRangeRef: ListVisitRecordsByDateRangeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVisitRecordsByDateRangeRef:
```typescript
const name = listVisitRecordsByDateRangeRef.operationName;
console.log(name);
```

### Variables
The `ListVisitRecordsByDateRange` query requires an argument of type `ListVisitRecordsByDateRangeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListVisitRecordsByDateRangeVariables {
  facilityId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}
```
### Return Type
Recall that executing the `ListVisitRecordsByDateRange` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVisitRecordsByDateRangeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListVisitRecordsByDateRangeData {
  visitRecords: ({
    id: UUIDString;
    visitDate: DateString;
    startTime: string;
    endTime: string;
    vitals?: unknown | null;
    services: unknown;
    notes?: string | null;
    client: {
      id: UUIDString;
      name: string;
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
  } & VisitRecord_Key)[];
}
```
### Using `ListVisitRecordsByDateRange`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVisitRecordsByDateRange, ListVisitRecordsByDateRangeVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListVisitRecordsByDateRange` query requires an argument of type `ListVisitRecordsByDateRangeVariables`:
const listVisitRecordsByDateRangeVars: ListVisitRecordsByDateRangeVariables = {
  facilityId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `listVisitRecordsByDateRange()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVisitRecordsByDateRange(listVisitRecordsByDateRangeVars);
// Variables can be defined inline as well.
const { data } = await listVisitRecordsByDateRange({ facilityId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVisitRecordsByDateRange(dataConnect, listVisitRecordsByDateRangeVars);

console.log(data.visitRecords);

// Or, you can use the `Promise` API.
listVisitRecordsByDateRange(listVisitRecordsByDateRangeVars).then((response) => {
  const data = response.data;
  console.log(data.visitRecords);
});
```

### Using `ListVisitRecordsByDateRange`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVisitRecordsByDateRangeRef, ListVisitRecordsByDateRangeVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListVisitRecordsByDateRange` query requires an argument of type `ListVisitRecordsByDateRangeVariables`:
const listVisitRecordsByDateRangeVars: ListVisitRecordsByDateRangeVariables = {
  facilityId: ..., 
  startDate: ..., 
  endDate: ..., 
};

// Call the `listVisitRecordsByDateRangeRef()` function to get a reference to the query.
const ref = listVisitRecordsByDateRangeRef(listVisitRecordsByDateRangeVars);
// Variables can be defined inline as well.
const ref = listVisitRecordsByDateRangeRef({ facilityId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVisitRecordsByDateRangeRef(dataConnect, listVisitRecordsByDateRangeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.visitRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.visitRecords);
});
```

## GetVisitRecord
You can execute the `GetVisitRecord` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getVisitRecord(vars: GetVisitRecordVariables): QueryPromise<GetVisitRecordData, GetVisitRecordVariables>;

interface GetVisitRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVisitRecordVariables): QueryRef<GetVisitRecordData, GetVisitRecordVariables>;
}
export const getVisitRecordRef: GetVisitRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVisitRecord(dc: DataConnect, vars: GetVisitRecordVariables): QueryPromise<GetVisitRecordData, GetVisitRecordVariables>;

interface GetVisitRecordRef {
  ...
  (dc: DataConnect, vars: GetVisitRecordVariables): QueryRef<GetVisitRecordData, GetVisitRecordVariables>;
}
export const getVisitRecordRef: GetVisitRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVisitRecordRef:
```typescript
const name = getVisitRecordRef.operationName;
console.log(name);
```

### Variables
The `GetVisitRecord` query requires an argument of type `GetVisitRecordVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVisitRecordVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetVisitRecord` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVisitRecordData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVisitRecordData {
  visitRecord?: {
    id: UUIDString;
    visitDate: DateString;
    startTime: string;
    endTime: string;
    vitals?: unknown | null;
    services: unknown;
    notes?: string | null;
    aiGenerated?: boolean | null;
    aiInput?: string | null;
    satisfaction?: string | null;
    satisfactionReason?: string | null;
    conditionChange?: string | null;
    conditionChangeDetail?: string | null;
    serviceChangeNeeded?: string | null;
    serviceChangeDetail?: string | null;
    attachments?: string[] | null;
    client: {
      id: UUIDString;
      name: string;
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
        visitReason?: {
          id: UUIDString;
          name: string;
        } & VisitReason_Key;
          schedule?: {
            id: UUIDString;
          } & Schedule_Key;
            createdAt: TimestampString;
            updatedAt: TimestampString;
  } & VisitRecord_Key;
}
```
### Using `GetVisitRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVisitRecord, GetVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `GetVisitRecord` query requires an argument of type `GetVisitRecordVariables`:
const getVisitRecordVars: GetVisitRecordVariables = {
  id: ..., 
};

// Call the `getVisitRecord()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVisitRecord(getVisitRecordVars);
// Variables can be defined inline as well.
const { data } = await getVisitRecord({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVisitRecord(dataConnect, getVisitRecordVars);

console.log(data.visitRecord);

// Or, you can use the `Promise` API.
getVisitRecord(getVisitRecordVars).then((response) => {
  const data = response.data;
  console.log(data.visitRecord);
});
```

### Using `GetVisitRecord`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVisitRecordRef, GetVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `GetVisitRecord` query requires an argument of type `GetVisitRecordVariables`:
const getVisitRecordVars: GetVisitRecordVariables = {
  id: ..., 
};

// Call the `getVisitRecordRef()` function to get a reference to the query.
const ref = getVisitRecordRef(getVisitRecordVars);
// Variables can be defined inline as well.
const ref = getVisitRecordRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVisitRecordRef(dataConnect, getVisitRecordVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.visitRecord);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.visitRecord);
});
```

## ListReportsByClient
You can execute the `ListReportsByClient` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listReportsByClient(vars: ListReportsByClientVariables): QueryPromise<ListReportsByClientData, ListReportsByClientVariables>;

interface ListReportsByClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReportsByClientVariables): QueryRef<ListReportsByClientData, ListReportsByClientVariables>;
}
export const listReportsByClientRef: ListReportsByClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReportsByClient(dc: DataConnect, vars: ListReportsByClientVariables): QueryPromise<ListReportsByClientData, ListReportsByClientVariables>;

interface ListReportsByClientRef {
  ...
  (dc: DataConnect, vars: ListReportsByClientVariables): QueryRef<ListReportsByClientData, ListReportsByClientVariables>;
}
export const listReportsByClientRef: ListReportsByClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReportsByClientRef:
```typescript
const name = listReportsByClientRef.operationName;
console.log(name);
```

### Variables
The `ListReportsByClient` query requires an argument of type `ListReportsByClientVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReportsByClientVariables {
  clientId: UUIDString;
}
```
### Return Type
Recall that executing the `ListReportsByClient` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReportsByClientData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReportsByClientData {
  reports: ({
    id: UUIDString;
    targetYear: number;
    targetMonth: number;
    summary?: string | null;
    pdfGenerated?: boolean | null;
    pdfUrl?: string | null;
    createdAt: TimestampString;
  } & Report_Key)[];
}
```
### Using `ListReportsByClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReportsByClient, ListReportsByClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListReportsByClient` query requires an argument of type `ListReportsByClientVariables`:
const listReportsByClientVars: ListReportsByClientVariables = {
  clientId: ..., 
};

// Call the `listReportsByClient()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReportsByClient(listReportsByClientVars);
// Variables can be defined inline as well.
const { data } = await listReportsByClient({ clientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReportsByClient(dataConnect, listReportsByClientVars);

console.log(data.reports);

// Or, you can use the `Promise` API.
listReportsByClient(listReportsByClientVars).then((response) => {
  const data = response.data;
  console.log(data.reports);
});
```

### Using `ListReportsByClient`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReportsByClientRef, ListReportsByClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListReportsByClient` query requires an argument of type `ListReportsByClientVariables`:
const listReportsByClientVars: ListReportsByClientVariables = {
  clientId: ..., 
};

// Call the `listReportsByClientRef()` function to get a reference to the query.
const ref = listReportsByClientRef(listReportsByClientVars);
// Variables can be defined inline as well.
const ref = listReportsByClientRef({ clientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReportsByClientRef(dataConnect, listReportsByClientVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reports);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reports);
});
```

## ListReportsByFacility
You can execute the `ListReportsByFacility` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listReportsByFacility(vars: ListReportsByFacilityVariables): QueryPromise<ListReportsByFacilityData, ListReportsByFacilityVariables>;

interface ListReportsByFacilityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReportsByFacilityVariables): QueryRef<ListReportsByFacilityData, ListReportsByFacilityVariables>;
}
export const listReportsByFacilityRef: ListReportsByFacilityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReportsByFacility(dc: DataConnect, vars: ListReportsByFacilityVariables): QueryPromise<ListReportsByFacilityData, ListReportsByFacilityVariables>;

interface ListReportsByFacilityRef {
  ...
  (dc: DataConnect, vars: ListReportsByFacilityVariables): QueryRef<ListReportsByFacilityData, ListReportsByFacilityVariables>;
}
export const listReportsByFacilityRef: ListReportsByFacilityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReportsByFacilityRef:
```typescript
const name = listReportsByFacilityRef.operationName;
console.log(name);
```

### Variables
The `ListReportsByFacility` query requires an argument of type `ListReportsByFacilityVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReportsByFacilityVariables {
  facilityId: UUIDString;
}
```
### Return Type
Recall that executing the `ListReportsByFacility` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReportsByFacilityData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReportsByFacilityData {
  reports: ({
    id: UUIDString;
    targetYear: number;
    targetMonth: number;
    summary?: string | null;
    aiGenerated?: boolean | null;
    pdfGenerated?: boolean | null;
    pdfUrl?: string | null;
    createdAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
  } & Report_Key)[];
}
```
### Using `ListReportsByFacility`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReportsByFacility, ListReportsByFacilityVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListReportsByFacility` query requires an argument of type `ListReportsByFacilityVariables`:
const listReportsByFacilityVars: ListReportsByFacilityVariables = {
  facilityId: ..., 
};

// Call the `listReportsByFacility()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReportsByFacility(listReportsByFacilityVars);
// Variables can be defined inline as well.
const { data } = await listReportsByFacility({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReportsByFacility(dataConnect, listReportsByFacilityVars);

console.log(data.reports);

// Or, you can use the `Promise` API.
listReportsByFacility(listReportsByFacilityVars).then((response) => {
  const data = response.data;
  console.log(data.reports);
});
```

### Using `ListReportsByFacility`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReportsByFacilityRef, ListReportsByFacilityVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListReportsByFacility` query requires an argument of type `ListReportsByFacilityVariables`:
const listReportsByFacilityVars: ListReportsByFacilityVariables = {
  facilityId: ..., 
};

// Call the `listReportsByFacilityRef()` function to get a reference to the query.
const ref = listReportsByFacilityRef(listReportsByFacilityVars);
// Variables can be defined inline as well.
const ref = listReportsByFacilityRef({ facilityId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReportsByFacilityRef(dataConnect, listReportsByFacilityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reports);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reports);
});
```

## ListCarePlansByClient
You can execute the `ListCarePlansByClient` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCarePlansByClient(vars: ListCarePlansByClientVariables): QueryPromise<ListCarePlansByClientData, ListCarePlansByClientVariables>;

interface ListCarePlansByClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCarePlansByClientVariables): QueryRef<ListCarePlansByClientData, ListCarePlansByClientVariables>;
}
export const listCarePlansByClientRef: ListCarePlansByClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCarePlansByClient(dc: DataConnect, vars: ListCarePlansByClientVariables): QueryPromise<ListCarePlansByClientData, ListCarePlansByClientVariables>;

interface ListCarePlansByClientRef {
  ...
  (dc: DataConnect, vars: ListCarePlansByClientVariables): QueryRef<ListCarePlansByClientData, ListCarePlansByClientVariables>;
}
export const listCarePlansByClientRef: ListCarePlansByClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCarePlansByClientRef:
```typescript
const name = listCarePlansByClientRef.operationName;
console.log(name);
```

### Variables
The `ListCarePlansByClient` query requires an argument of type `ListCarePlansByClientVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCarePlansByClientVariables {
  clientId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCarePlansByClient` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCarePlansByClientData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCarePlansByClientData {
  carePlans: ({
    id: UUIDString;
    currentSituation?: string | null;
    familyWishes?: string | null;
    mainSupport?: string | null;
    longTermGoals?: unknown | null;
    shortTermGoals?: unknown | null;
    pdfUrl?: string | null;
    createdAt: TimestampString;
  } & CarePlan_Key)[];
}
```
### Using `ListCarePlansByClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCarePlansByClient, ListCarePlansByClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListCarePlansByClient` query requires an argument of type `ListCarePlansByClientVariables`:
const listCarePlansByClientVars: ListCarePlansByClientVariables = {
  clientId: ..., 
};

// Call the `listCarePlansByClient()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCarePlansByClient(listCarePlansByClientVars);
// Variables can be defined inline as well.
const { data } = await listCarePlansByClient({ clientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCarePlansByClient(dataConnect, listCarePlansByClientVars);

console.log(data.carePlans);

// Or, you can use the `Promise` API.
listCarePlansByClient(listCarePlansByClientVars).then((response) => {
  const data = response.data;
  console.log(data.carePlans);
});
```

### Using `ListCarePlansByClient`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCarePlansByClientRef, ListCarePlansByClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `ListCarePlansByClient` query requires an argument of type `ListCarePlansByClientVariables`:
const listCarePlansByClientVars: ListCarePlansByClientVariables = {
  clientId: ..., 
};

// Call the `listCarePlansByClientRef()` function to get a reference to the query.
const ref = listCarePlansByClientRef(listCarePlansByClientVars);
// Variables can be defined inline as well.
const ref = listCarePlansByClientRef({ clientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCarePlansByClientRef(dataConnect, listCarePlansByClientVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.carePlans);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.carePlans);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateClient
You can execute the `CreateClient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createClient(vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface CreateClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
}
export const createClientRef: CreateClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createClient(dc: DataConnect, vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface CreateClientRef {
  ...
  (dc: DataConnect, vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
}
export const createClientRef: CreateClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createClientRef:
```typescript
const name = createClientRef.operationName;
console.log(name);
```

### Variables
The `CreateClient` mutation requires an argument of type `CreateClientVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateClientVariables {
  facilityId: UUIDString;
  name: string;
  nameKana?: string | null;
  gender?: string | null;
  birthDate?: DateString | null;
  careLevelId?: UUIDString | null;
  addressPrefecture?: string | null;
  addressCity?: string | null;
  phone?: string | null;
  careManager?: string | null;
  careOffice?: string | null;
  emergencyPhone?: string | null;
  emergencyName?: string | null;
  emergencyRelation?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateClient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateClientData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateClientData {
  client_insert: Client_Key;
}
```
### Using `CreateClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createClient, CreateClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateClient` mutation requires an argument of type `CreateClientVariables`:
const createClientVars: CreateClientVariables = {
  facilityId: ..., 
  name: ..., 
  nameKana: ..., // optional
  gender: ..., // optional
  birthDate: ..., // optional
  careLevelId: ..., // optional
  addressPrefecture: ..., // optional
  addressCity: ..., // optional
  phone: ..., // optional
  careManager: ..., // optional
  careOffice: ..., // optional
  emergencyPhone: ..., // optional
  emergencyName: ..., // optional
  emergencyRelation: ..., // optional
  notes: ..., // optional
};

// Call the `createClient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createClient(createClientVars);
// Variables can be defined inline as well.
const { data } = await createClient({ facilityId: ..., name: ..., nameKana: ..., gender: ..., birthDate: ..., careLevelId: ..., addressPrefecture: ..., addressCity: ..., phone: ..., careManager: ..., careOffice: ..., emergencyPhone: ..., emergencyName: ..., emergencyRelation: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createClient(dataConnect, createClientVars);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
createClient(createClientVars).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

### Using `CreateClient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createClientRef, CreateClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateClient` mutation requires an argument of type `CreateClientVariables`:
const createClientVars: CreateClientVariables = {
  facilityId: ..., 
  name: ..., 
  nameKana: ..., // optional
  gender: ..., // optional
  birthDate: ..., // optional
  careLevelId: ..., // optional
  addressPrefecture: ..., // optional
  addressCity: ..., // optional
  phone: ..., // optional
  careManager: ..., // optional
  careOffice: ..., // optional
  emergencyPhone: ..., // optional
  emergencyName: ..., // optional
  emergencyRelation: ..., // optional
  notes: ..., // optional
};

// Call the `createClientRef()` function to get a reference to the mutation.
const ref = createClientRef(createClientVars);
// Variables can be defined inline as well.
const ref = createClientRef({ facilityId: ..., name: ..., nameKana: ..., gender: ..., birthDate: ..., careLevelId: ..., addressPrefecture: ..., addressCity: ..., phone: ..., careManager: ..., careOffice: ..., emergencyPhone: ..., emergencyName: ..., emergencyRelation: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createClientRef(dataConnect, createClientVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

## UpdateClient
You can execute the `UpdateClient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateClient(vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;

interface UpdateClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
}
export const updateClientRef: UpdateClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClient(dc: DataConnect, vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;

interface UpdateClientRef {
  ...
  (dc: DataConnect, vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
}
export const updateClientRef: UpdateClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClientRef:
```typescript
const name = updateClientRef.operationName;
console.log(name);
```

### Variables
The `UpdateClient` mutation requires an argument of type `UpdateClientVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClientVariables {
  id: UUIDString;
  name?: string | null;
  nameKana?: string | null;
  gender?: string | null;
  birthDate?: DateString | null;
  careLevelId?: UUIDString | null;
  addressPrefecture?: string | null;
  addressCity?: string | null;
  phone?: string | null;
  careManager?: string | null;
  careOffice?: string | null;
  emergencyPhone?: string | null;
  emergencyName?: string | null;
  emergencyRelation?: string | null;
  assessment?: unknown | null;
  lastAssessmentDate?: DateString | null;
  regularServices?: unknown | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateClient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClientData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClientData {
  client_update?: Client_Key | null;
}
```
### Using `UpdateClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClient, UpdateClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateClient` mutation requires an argument of type `UpdateClientVariables`:
const updateClientVars: UpdateClientVariables = {
  id: ..., 
  name: ..., // optional
  nameKana: ..., // optional
  gender: ..., // optional
  birthDate: ..., // optional
  careLevelId: ..., // optional
  addressPrefecture: ..., // optional
  addressCity: ..., // optional
  phone: ..., // optional
  careManager: ..., // optional
  careOffice: ..., // optional
  emergencyPhone: ..., // optional
  emergencyName: ..., // optional
  emergencyRelation: ..., // optional
  assessment: ..., // optional
  lastAssessmentDate: ..., // optional
  regularServices: ..., // optional
  notes: ..., // optional
};

// Call the `updateClient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClient(updateClientVars);
// Variables can be defined inline as well.
const { data } = await updateClient({ id: ..., name: ..., nameKana: ..., gender: ..., birthDate: ..., careLevelId: ..., addressPrefecture: ..., addressCity: ..., phone: ..., careManager: ..., careOffice: ..., emergencyPhone: ..., emergencyName: ..., emergencyRelation: ..., assessment: ..., lastAssessmentDate: ..., regularServices: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClient(dataConnect, updateClientVars);

console.log(data.client_update);

// Or, you can use the `Promise` API.
updateClient(updateClientVars).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

### Using `UpdateClient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClientRef, UpdateClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateClient` mutation requires an argument of type `UpdateClientVariables`:
const updateClientVars: UpdateClientVariables = {
  id: ..., 
  name: ..., // optional
  nameKana: ..., // optional
  gender: ..., // optional
  birthDate: ..., // optional
  careLevelId: ..., // optional
  addressPrefecture: ..., // optional
  addressCity: ..., // optional
  phone: ..., // optional
  careManager: ..., // optional
  careOffice: ..., // optional
  emergencyPhone: ..., // optional
  emergencyName: ..., // optional
  emergencyRelation: ..., // optional
  assessment: ..., // optional
  lastAssessmentDate: ..., // optional
  regularServices: ..., // optional
  notes: ..., // optional
};

// Call the `updateClientRef()` function to get a reference to the mutation.
const ref = updateClientRef(updateClientVars);
// Variables can be defined inline as well.
const ref = updateClientRef({ id: ..., name: ..., nameKana: ..., gender: ..., birthDate: ..., careLevelId: ..., addressPrefecture: ..., addressCity: ..., phone: ..., careManager: ..., careOffice: ..., emergencyPhone: ..., emergencyName: ..., emergencyRelation: ..., assessment: ..., lastAssessmentDate: ..., regularServices: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClientRef(dataConnect, updateClientVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

## DeleteClient
You can execute the `DeleteClient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteClient(vars: DeleteClientVariables): MutationPromise<DeleteClientData, DeleteClientVariables>;

interface DeleteClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteClientVariables): MutationRef<DeleteClientData, DeleteClientVariables>;
}
export const deleteClientRef: DeleteClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteClient(dc: DataConnect, vars: DeleteClientVariables): MutationPromise<DeleteClientData, DeleteClientVariables>;

interface DeleteClientRef {
  ...
  (dc: DataConnect, vars: DeleteClientVariables): MutationRef<DeleteClientData, DeleteClientVariables>;
}
export const deleteClientRef: DeleteClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteClientRef:
```typescript
const name = deleteClientRef.operationName;
console.log(name);
```

### Variables
The `DeleteClient` mutation requires an argument of type `DeleteClientVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteClientVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteClient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteClientData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteClientData {
  client_update?: Client_Key | null;
}
```
### Using `DeleteClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteClient, DeleteClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `DeleteClient` mutation requires an argument of type `DeleteClientVariables`:
const deleteClientVars: DeleteClientVariables = {
  id: ..., 
};

// Call the `deleteClient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteClient(deleteClientVars);
// Variables can be defined inline as well.
const { data } = await deleteClient({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteClient(dataConnect, deleteClientVars);

console.log(data.client_update);

// Or, you can use the `Promise` API.
deleteClient(deleteClientVars).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

### Using `DeleteClient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteClientRef, DeleteClientVariables } from '@sanwa-houkai-app/dataconnect';

// The `DeleteClient` mutation requires an argument of type `DeleteClientVariables`:
const deleteClientVars: DeleteClientVariables = {
  id: ..., 
};

// Call the `deleteClientRef()` function to get a reference to the mutation.
const ref = deleteClientRef(deleteClientVars);
// Variables can be defined inline as well.
const ref = deleteClientRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteClientRef(dataConnect, deleteClientVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

## CreateSchedule
You can execute the `CreateSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSchedule(vars: CreateScheduleVariables): MutationPromise<CreateScheduleData, CreateScheduleVariables>;

interface CreateScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateScheduleVariables): MutationRef<CreateScheduleData, CreateScheduleVariables>;
}
export const createScheduleRef: CreateScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSchedule(dc: DataConnect, vars: CreateScheduleVariables): MutationPromise<CreateScheduleData, CreateScheduleVariables>;

interface CreateScheduleRef {
  ...
  (dc: DataConnect, vars: CreateScheduleVariables): MutationRef<CreateScheduleData, CreateScheduleVariables>;
}
export const createScheduleRef: CreateScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createScheduleRef:
```typescript
const name = createScheduleRef.operationName;
console.log(name);
```

### Variables
The `CreateSchedule` mutation requires an argument of type `CreateScheduleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateScheduleVariables {
  facilityId: UUIDString;
  clientId: UUIDString;
  staffId: UUIDString;
  serviceTypeId?: UUIDString | null;
  scheduledDate: DateString;
  startTime: string;
  endTime: string;
  notes?: string | null;
  recurrenceRule?: string | null;
  recurrenceId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateScheduleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateScheduleData {
  schedule_insert: Schedule_Key;
}
```
### Using `CreateSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSchedule, CreateScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateSchedule` mutation requires an argument of type `CreateScheduleVariables`:
const createScheduleVars: CreateScheduleVariables = {
  facilityId: ..., 
  clientId: ..., 
  staffId: ..., 
  serviceTypeId: ..., // optional
  scheduledDate: ..., 
  startTime: ..., 
  endTime: ..., 
  notes: ..., // optional
  recurrenceRule: ..., // optional
  recurrenceId: ..., // optional
};

// Call the `createSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSchedule(createScheduleVars);
// Variables can be defined inline as well.
const { data } = await createSchedule({ facilityId: ..., clientId: ..., staffId: ..., serviceTypeId: ..., scheduledDate: ..., startTime: ..., endTime: ..., notes: ..., recurrenceRule: ..., recurrenceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSchedule(dataConnect, createScheduleVars);

console.log(data.schedule_insert);

// Or, you can use the `Promise` API.
createSchedule(createScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.schedule_insert);
});
```

### Using `CreateSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createScheduleRef, CreateScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateSchedule` mutation requires an argument of type `CreateScheduleVariables`:
const createScheduleVars: CreateScheduleVariables = {
  facilityId: ..., 
  clientId: ..., 
  staffId: ..., 
  serviceTypeId: ..., // optional
  scheduledDate: ..., 
  startTime: ..., 
  endTime: ..., 
  notes: ..., // optional
  recurrenceRule: ..., // optional
  recurrenceId: ..., // optional
};

// Call the `createScheduleRef()` function to get a reference to the mutation.
const ref = createScheduleRef(createScheduleVars);
// Variables can be defined inline as well.
const ref = createScheduleRef({ facilityId: ..., clientId: ..., staffId: ..., serviceTypeId: ..., scheduledDate: ..., startTime: ..., endTime: ..., notes: ..., recurrenceRule: ..., recurrenceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createScheduleRef(dataConnect, createScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.schedule_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.schedule_insert);
});
```

## UpdateSchedule
You can execute the `UpdateSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateSchedule(vars: UpdateScheduleVariables): MutationPromise<UpdateScheduleData, UpdateScheduleVariables>;

interface UpdateScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateScheduleVariables): MutationRef<UpdateScheduleData, UpdateScheduleVariables>;
}
export const updateScheduleRef: UpdateScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSchedule(dc: DataConnect, vars: UpdateScheduleVariables): MutationPromise<UpdateScheduleData, UpdateScheduleVariables>;

interface UpdateScheduleRef {
  ...
  (dc: DataConnect, vars: UpdateScheduleVariables): MutationRef<UpdateScheduleData, UpdateScheduleVariables>;
}
export const updateScheduleRef: UpdateScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateScheduleRef:
```typescript
const name = updateScheduleRef.operationName;
console.log(name);
```

### Variables
The `UpdateSchedule` mutation requires an argument of type `UpdateScheduleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateScheduleVariables {
  id: UUIDString;
  clientId?: UUIDString | null;
  staffId?: UUIDString | null;
  serviceTypeId?: UUIDString | null;
  scheduledDate?: DateString | null;
  startTime?: string | null;
  endTime?: string | null;
  status?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateScheduleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateScheduleData {
  schedule_update?: Schedule_Key | null;
}
```
### Using `UpdateSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSchedule, UpdateScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateSchedule` mutation requires an argument of type `UpdateScheduleVariables`:
const updateScheduleVars: UpdateScheduleVariables = {
  id: ..., 
  clientId: ..., // optional
  staffId: ..., // optional
  serviceTypeId: ..., // optional
  scheduledDate: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
  status: ..., // optional
  notes: ..., // optional
};

// Call the `updateSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSchedule(updateScheduleVars);
// Variables can be defined inline as well.
const { data } = await updateSchedule({ id: ..., clientId: ..., staffId: ..., serviceTypeId: ..., scheduledDate: ..., startTime: ..., endTime: ..., status: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSchedule(dataConnect, updateScheduleVars);

console.log(data.schedule_update);

// Or, you can use the `Promise` API.
updateSchedule(updateScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.schedule_update);
});
```

### Using `UpdateSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateScheduleRef, UpdateScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateSchedule` mutation requires an argument of type `UpdateScheduleVariables`:
const updateScheduleVars: UpdateScheduleVariables = {
  id: ..., 
  clientId: ..., // optional
  staffId: ..., // optional
  serviceTypeId: ..., // optional
  scheduledDate: ..., // optional
  startTime: ..., // optional
  endTime: ..., // optional
  status: ..., // optional
  notes: ..., // optional
};

// Call the `updateScheduleRef()` function to get a reference to the mutation.
const ref = updateScheduleRef(updateScheduleVars);
// Variables can be defined inline as well.
const ref = updateScheduleRef({ id: ..., clientId: ..., staffId: ..., serviceTypeId: ..., scheduledDate: ..., startTime: ..., endTime: ..., status: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateScheduleRef(dataConnect, updateScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.schedule_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.schedule_update);
});
```

## DeleteSchedule
You can execute the `DeleteSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteSchedule(vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;

interface DeleteScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
}
export const deleteScheduleRef: DeleteScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSchedule(dc: DataConnect, vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;

interface DeleteScheduleRef {
  ...
  (dc: DataConnect, vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
}
export const deleteScheduleRef: DeleteScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteScheduleRef:
```typescript
const name = deleteScheduleRef.operationName;
console.log(name);
```

### Variables
The `DeleteSchedule` mutation requires an argument of type `DeleteScheduleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteScheduleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteScheduleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteScheduleData {
  schedule_delete?: Schedule_Key | null;
}
```
### Using `DeleteSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSchedule, DeleteScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `DeleteSchedule` mutation requires an argument of type `DeleteScheduleVariables`:
const deleteScheduleVars: DeleteScheduleVariables = {
  id: ..., 
};

// Call the `deleteSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSchedule(deleteScheduleVars);
// Variables can be defined inline as well.
const { data } = await deleteSchedule({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSchedule(dataConnect, deleteScheduleVars);

console.log(data.schedule_delete);

// Or, you can use the `Promise` API.
deleteSchedule(deleteScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.schedule_delete);
});
```

### Using `DeleteSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteScheduleRef, DeleteScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `DeleteSchedule` mutation requires an argument of type `DeleteScheduleVariables`:
const deleteScheduleVars: DeleteScheduleVariables = {
  id: ..., 
};

// Call the `deleteScheduleRef()` function to get a reference to the mutation.
const ref = deleteScheduleRef(deleteScheduleVars);
// Variables can be defined inline as well.
const ref = deleteScheduleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteScheduleRef(dataConnect, deleteScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.schedule_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.schedule_delete);
});
```

## CancelSchedule
You can execute the `CancelSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
cancelSchedule(vars: CancelScheduleVariables): MutationPromise<CancelScheduleData, CancelScheduleVariables>;

interface CancelScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelScheduleVariables): MutationRef<CancelScheduleData, CancelScheduleVariables>;
}
export const cancelScheduleRef: CancelScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cancelSchedule(dc: DataConnect, vars: CancelScheduleVariables): MutationPromise<CancelScheduleData, CancelScheduleVariables>;

interface CancelScheduleRef {
  ...
  (dc: DataConnect, vars: CancelScheduleVariables): MutationRef<CancelScheduleData, CancelScheduleVariables>;
}
export const cancelScheduleRef: CancelScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cancelScheduleRef:
```typescript
const name = cancelScheduleRef.operationName;
console.log(name);
```

### Variables
The `CancelSchedule` mutation requires an argument of type `CancelScheduleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CancelScheduleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `CancelSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelScheduleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CancelScheduleData {
  schedule_update?: Schedule_Key | null;
}
```
### Using `CancelSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelSchedule, CancelScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `CancelSchedule` mutation requires an argument of type `CancelScheduleVariables`:
const cancelScheduleVars: CancelScheduleVariables = {
  id: ..., 
};

// Call the `cancelSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelSchedule(cancelScheduleVars);
// Variables can be defined inline as well.
const { data } = await cancelSchedule({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelSchedule(dataConnect, cancelScheduleVars);

console.log(data.schedule_update);

// Or, you can use the `Promise` API.
cancelSchedule(cancelScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.schedule_update);
});
```

### Using `CancelSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelScheduleRef, CancelScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `CancelSchedule` mutation requires an argument of type `CancelScheduleVariables`:
const cancelScheduleVars: CancelScheduleVariables = {
  id: ..., 
};

// Call the `cancelScheduleRef()` function to get a reference to the mutation.
const ref = cancelScheduleRef(cancelScheduleVars);
// Variables can be defined inline as well.
const ref = cancelScheduleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelScheduleRef(dataConnect, cancelScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.schedule_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.schedule_update);
});
```

## CompleteSchedule
You can execute the `CompleteSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
completeSchedule(vars: CompleteScheduleVariables): MutationPromise<CompleteScheduleData, CompleteScheduleVariables>;

interface CompleteScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteScheduleVariables): MutationRef<CompleteScheduleData, CompleteScheduleVariables>;
}
export const completeScheduleRef: CompleteScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeSchedule(dc: DataConnect, vars: CompleteScheduleVariables): MutationPromise<CompleteScheduleData, CompleteScheduleVariables>;

interface CompleteScheduleRef {
  ...
  (dc: DataConnect, vars: CompleteScheduleVariables): MutationRef<CompleteScheduleData, CompleteScheduleVariables>;
}
export const completeScheduleRef: CompleteScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeScheduleRef:
```typescript
const name = completeScheduleRef.operationName;
console.log(name);
```

### Variables
The `CompleteSchedule` mutation requires an argument of type `CompleteScheduleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompleteScheduleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `CompleteSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteScheduleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteScheduleData {
  schedule_update?: Schedule_Key | null;
}
```
### Using `CompleteSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeSchedule, CompleteScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `CompleteSchedule` mutation requires an argument of type `CompleteScheduleVariables`:
const completeScheduleVars: CompleteScheduleVariables = {
  id: ..., 
};

// Call the `completeSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeSchedule(completeScheduleVars);
// Variables can be defined inline as well.
const { data } = await completeSchedule({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeSchedule(dataConnect, completeScheduleVars);

console.log(data.schedule_update);

// Or, you can use the `Promise` API.
completeSchedule(completeScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.schedule_update);
});
```

### Using `CompleteSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeScheduleRef, CompleteScheduleVariables } from '@sanwa-houkai-app/dataconnect';

// The `CompleteSchedule` mutation requires an argument of type `CompleteScheduleVariables`:
const completeScheduleVars: CompleteScheduleVariables = {
  id: ..., 
};

// Call the `completeScheduleRef()` function to get a reference to the mutation.
const ref = completeScheduleRef(completeScheduleVars);
// Variables can be defined inline as well.
const ref = completeScheduleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeScheduleRef(dataConnect, completeScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.schedule_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.schedule_update);
});
```

## CreateVisitRecord
You can execute the `CreateVisitRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createVisitRecord(vars: CreateVisitRecordVariables): MutationPromise<CreateVisitRecordData, CreateVisitRecordVariables>;

interface CreateVisitRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVisitRecordVariables): MutationRef<CreateVisitRecordData, CreateVisitRecordVariables>;
}
export const createVisitRecordRef: CreateVisitRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createVisitRecord(dc: DataConnect, vars: CreateVisitRecordVariables): MutationPromise<CreateVisitRecordData, CreateVisitRecordVariables>;

interface CreateVisitRecordRef {
  ...
  (dc: DataConnect, vars: CreateVisitRecordVariables): MutationRef<CreateVisitRecordData, CreateVisitRecordVariables>;
}
export const createVisitRecordRef: CreateVisitRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createVisitRecordRef:
```typescript
const name = createVisitRecordRef.operationName;
console.log(name);
```

### Variables
The `CreateVisitRecord` mutation requires an argument of type `CreateVisitRecordVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateVisitRecordVariables {
  scheduleId?: UUIDString | null;
  clientId: UUIDString;
  staffId: UUIDString;
  visitDate: DateString;
  visitReasonId?: UUIDString | null;
  startTime: string;
  endTime: string;
  vitals?: unknown | null;
  services: unknown;
  notes?: string | null;
  aiGenerated?: boolean | null;
  aiInput?: string | null;
  satisfaction?: string | null;
  satisfactionReason?: string | null;
  conditionChange?: string | null;
  conditionChangeDetail?: string | null;
  serviceChangeNeeded?: string | null;
  serviceChangeDetail?: string | null;
  attachments?: string[] | null;
}
```
### Return Type
Recall that executing the `CreateVisitRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateVisitRecordData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateVisitRecordData {
  visitRecord_insert: VisitRecord_Key;
}
```
### Using `CreateVisitRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createVisitRecord, CreateVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateVisitRecord` mutation requires an argument of type `CreateVisitRecordVariables`:
const createVisitRecordVars: CreateVisitRecordVariables = {
  scheduleId: ..., // optional
  clientId: ..., 
  staffId: ..., 
  visitDate: ..., 
  visitReasonId: ..., // optional
  startTime: ..., 
  endTime: ..., 
  vitals: ..., // optional
  services: ..., 
  notes: ..., // optional
  aiGenerated: ..., // optional
  aiInput: ..., // optional
  satisfaction: ..., // optional
  satisfactionReason: ..., // optional
  conditionChange: ..., // optional
  conditionChangeDetail: ..., // optional
  serviceChangeNeeded: ..., // optional
  serviceChangeDetail: ..., // optional
  attachments: ..., // optional
};

// Call the `createVisitRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createVisitRecord(createVisitRecordVars);
// Variables can be defined inline as well.
const { data } = await createVisitRecord({ scheduleId: ..., clientId: ..., staffId: ..., visitDate: ..., visitReasonId: ..., startTime: ..., endTime: ..., vitals: ..., services: ..., notes: ..., aiGenerated: ..., aiInput: ..., satisfaction: ..., satisfactionReason: ..., conditionChange: ..., conditionChangeDetail: ..., serviceChangeNeeded: ..., serviceChangeDetail: ..., attachments: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createVisitRecord(dataConnect, createVisitRecordVars);

console.log(data.visitRecord_insert);

// Or, you can use the `Promise` API.
createVisitRecord(createVisitRecordVars).then((response) => {
  const data = response.data;
  console.log(data.visitRecord_insert);
});
```

### Using `CreateVisitRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createVisitRecordRef, CreateVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateVisitRecord` mutation requires an argument of type `CreateVisitRecordVariables`:
const createVisitRecordVars: CreateVisitRecordVariables = {
  scheduleId: ..., // optional
  clientId: ..., 
  staffId: ..., 
  visitDate: ..., 
  visitReasonId: ..., // optional
  startTime: ..., 
  endTime: ..., 
  vitals: ..., // optional
  services: ..., 
  notes: ..., // optional
  aiGenerated: ..., // optional
  aiInput: ..., // optional
  satisfaction: ..., // optional
  satisfactionReason: ..., // optional
  conditionChange: ..., // optional
  conditionChangeDetail: ..., // optional
  serviceChangeNeeded: ..., // optional
  serviceChangeDetail: ..., // optional
  attachments: ..., // optional
};

// Call the `createVisitRecordRef()` function to get a reference to the mutation.
const ref = createVisitRecordRef(createVisitRecordVars);
// Variables can be defined inline as well.
const ref = createVisitRecordRef({ scheduleId: ..., clientId: ..., staffId: ..., visitDate: ..., visitReasonId: ..., startTime: ..., endTime: ..., vitals: ..., services: ..., notes: ..., aiGenerated: ..., aiInput: ..., satisfaction: ..., satisfactionReason: ..., conditionChange: ..., conditionChangeDetail: ..., serviceChangeNeeded: ..., serviceChangeDetail: ..., attachments: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createVisitRecordRef(dataConnect, createVisitRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.visitRecord_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.visitRecord_insert);
});
```

## UpdateVisitRecord
You can execute the `UpdateVisitRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateVisitRecord(vars: UpdateVisitRecordVariables): MutationPromise<UpdateVisitRecordData, UpdateVisitRecordVariables>;

interface UpdateVisitRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVisitRecordVariables): MutationRef<UpdateVisitRecordData, UpdateVisitRecordVariables>;
}
export const updateVisitRecordRef: UpdateVisitRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateVisitRecord(dc: DataConnect, vars: UpdateVisitRecordVariables): MutationPromise<UpdateVisitRecordData, UpdateVisitRecordVariables>;

interface UpdateVisitRecordRef {
  ...
  (dc: DataConnect, vars: UpdateVisitRecordVariables): MutationRef<UpdateVisitRecordData, UpdateVisitRecordVariables>;
}
export const updateVisitRecordRef: UpdateVisitRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateVisitRecordRef:
```typescript
const name = updateVisitRecordRef.operationName;
console.log(name);
```

### Variables
The `UpdateVisitRecord` mutation requires an argument of type `UpdateVisitRecordVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateVisitRecordVariables {
  id: UUIDString;
  vitals?: unknown | null;
  services?: unknown | null;
  notes?: string | null;
  aiGenerated?: boolean | null;
  aiInput?: string | null;
  satisfaction?: string | null;
  satisfactionReason?: string | null;
  conditionChange?: string | null;
  conditionChangeDetail?: string | null;
  serviceChangeNeeded?: string | null;
  serviceChangeDetail?: string | null;
  attachments?: string[] | null;
}
```
### Return Type
Recall that executing the `UpdateVisitRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateVisitRecordData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateVisitRecordData {
  visitRecord_update?: VisitRecord_Key | null;
}
```
### Using `UpdateVisitRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateVisitRecord, UpdateVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateVisitRecord` mutation requires an argument of type `UpdateVisitRecordVariables`:
const updateVisitRecordVars: UpdateVisitRecordVariables = {
  id: ..., 
  vitals: ..., // optional
  services: ..., // optional
  notes: ..., // optional
  aiGenerated: ..., // optional
  aiInput: ..., // optional
  satisfaction: ..., // optional
  satisfactionReason: ..., // optional
  conditionChange: ..., // optional
  conditionChangeDetail: ..., // optional
  serviceChangeNeeded: ..., // optional
  serviceChangeDetail: ..., // optional
  attachments: ..., // optional
};

// Call the `updateVisitRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateVisitRecord(updateVisitRecordVars);
// Variables can be defined inline as well.
const { data } = await updateVisitRecord({ id: ..., vitals: ..., services: ..., notes: ..., aiGenerated: ..., aiInput: ..., satisfaction: ..., satisfactionReason: ..., conditionChange: ..., conditionChangeDetail: ..., serviceChangeNeeded: ..., serviceChangeDetail: ..., attachments: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateVisitRecord(dataConnect, updateVisitRecordVars);

console.log(data.visitRecord_update);

// Or, you can use the `Promise` API.
updateVisitRecord(updateVisitRecordVars).then((response) => {
  const data = response.data;
  console.log(data.visitRecord_update);
});
```

### Using `UpdateVisitRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateVisitRecordRef, UpdateVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateVisitRecord` mutation requires an argument of type `UpdateVisitRecordVariables`:
const updateVisitRecordVars: UpdateVisitRecordVariables = {
  id: ..., 
  vitals: ..., // optional
  services: ..., // optional
  notes: ..., // optional
  aiGenerated: ..., // optional
  aiInput: ..., // optional
  satisfaction: ..., // optional
  satisfactionReason: ..., // optional
  conditionChange: ..., // optional
  conditionChangeDetail: ..., // optional
  serviceChangeNeeded: ..., // optional
  serviceChangeDetail: ..., // optional
  attachments: ..., // optional
};

// Call the `updateVisitRecordRef()` function to get a reference to the mutation.
const ref = updateVisitRecordRef(updateVisitRecordVars);
// Variables can be defined inline as well.
const ref = updateVisitRecordRef({ id: ..., vitals: ..., services: ..., notes: ..., aiGenerated: ..., aiInput: ..., satisfaction: ..., satisfactionReason: ..., conditionChange: ..., conditionChangeDetail: ..., serviceChangeNeeded: ..., serviceChangeDetail: ..., attachments: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateVisitRecordRef(dataConnect, updateVisitRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.visitRecord_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.visitRecord_update);
});
```

## DeleteVisitRecord
You can execute the `DeleteVisitRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteVisitRecord(vars: DeleteVisitRecordVariables): MutationPromise<DeleteVisitRecordData, DeleteVisitRecordVariables>;

interface DeleteVisitRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVisitRecordVariables): MutationRef<DeleteVisitRecordData, DeleteVisitRecordVariables>;
}
export const deleteVisitRecordRef: DeleteVisitRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteVisitRecord(dc: DataConnect, vars: DeleteVisitRecordVariables): MutationPromise<DeleteVisitRecordData, DeleteVisitRecordVariables>;

interface DeleteVisitRecordRef {
  ...
  (dc: DataConnect, vars: DeleteVisitRecordVariables): MutationRef<DeleteVisitRecordData, DeleteVisitRecordVariables>;
}
export const deleteVisitRecordRef: DeleteVisitRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteVisitRecordRef:
```typescript
const name = deleteVisitRecordRef.operationName;
console.log(name);
```

### Variables
The `DeleteVisitRecord` mutation requires an argument of type `DeleteVisitRecordVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteVisitRecordVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteVisitRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteVisitRecordData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteVisitRecordData {
  visitRecord_delete?: VisitRecord_Key | null;
}
```
### Using `DeleteVisitRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteVisitRecord, DeleteVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `DeleteVisitRecord` mutation requires an argument of type `DeleteVisitRecordVariables`:
const deleteVisitRecordVars: DeleteVisitRecordVariables = {
  id: ..., 
};

// Call the `deleteVisitRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteVisitRecord(deleteVisitRecordVars);
// Variables can be defined inline as well.
const { data } = await deleteVisitRecord({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteVisitRecord(dataConnect, deleteVisitRecordVars);

console.log(data.visitRecord_delete);

// Or, you can use the `Promise` API.
deleteVisitRecord(deleteVisitRecordVars).then((response) => {
  const data = response.data;
  console.log(data.visitRecord_delete);
});
```

### Using `DeleteVisitRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteVisitRecordRef, DeleteVisitRecordVariables } from '@sanwa-houkai-app/dataconnect';

// The `DeleteVisitRecord` mutation requires an argument of type `DeleteVisitRecordVariables`:
const deleteVisitRecordVars: DeleteVisitRecordVariables = {
  id: ..., 
};

// Call the `deleteVisitRecordRef()` function to get a reference to the mutation.
const ref = deleteVisitRecordRef(deleteVisitRecordVars);
// Variables can be defined inline as well.
const ref = deleteVisitRecordRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteVisitRecordRef(dataConnect, deleteVisitRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.visitRecord_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.visitRecord_delete);
});
```

## CreateReport
You can execute the `CreateReport` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createReport(vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;

interface CreateReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
}
export const createReportRef: CreateReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReport(dc: DataConnect, vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;

interface CreateReportRef {
  ...
  (dc: DataConnect, vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
}
export const createReportRef: CreateReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReportRef:
```typescript
const name = createReportRef.operationName;
console.log(name);
```

### Variables
The `CreateReport` mutation requires an argument of type `CreateReportVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReportVariables {
  clientId: UUIDString;
  staffId: UUIDString;
  targetYear: number;
  targetMonth: number;
  summary?: string | null;
  aiGenerated?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateReport` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReportData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReportData {
  report_insert: Report_Key;
}
```
### Using `CreateReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReport, CreateReportVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateReport` mutation requires an argument of type `CreateReportVariables`:
const createReportVars: CreateReportVariables = {
  clientId: ..., 
  staffId: ..., 
  targetYear: ..., 
  targetMonth: ..., 
  summary: ..., // optional
  aiGenerated: ..., // optional
};

// Call the `createReport()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReport(createReportVars);
// Variables can be defined inline as well.
const { data } = await createReport({ clientId: ..., staffId: ..., targetYear: ..., targetMonth: ..., summary: ..., aiGenerated: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReport(dataConnect, createReportVars);

console.log(data.report_insert);

// Or, you can use the `Promise` API.
createReport(createReportVars).then((response) => {
  const data = response.data;
  console.log(data.report_insert);
});
```

### Using `CreateReport`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReportRef, CreateReportVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateReport` mutation requires an argument of type `CreateReportVariables`:
const createReportVars: CreateReportVariables = {
  clientId: ..., 
  staffId: ..., 
  targetYear: ..., 
  targetMonth: ..., 
  summary: ..., // optional
  aiGenerated: ..., // optional
};

// Call the `createReportRef()` function to get a reference to the mutation.
const ref = createReportRef(createReportVars);
// Variables can be defined inline as well.
const ref = createReportRef({ clientId: ..., staffId: ..., targetYear: ..., targetMonth: ..., summary: ..., aiGenerated: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReportRef(dataConnect, createReportVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.report_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.report_insert);
});
```

## UpdateReportPdf
You can execute the `UpdateReportPdf` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateReportPdf(vars: UpdateReportPdfVariables): MutationPromise<UpdateReportPdfData, UpdateReportPdfVariables>;

interface UpdateReportPdfRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReportPdfVariables): MutationRef<UpdateReportPdfData, UpdateReportPdfVariables>;
}
export const updateReportPdfRef: UpdateReportPdfRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReportPdf(dc: DataConnect, vars: UpdateReportPdfVariables): MutationPromise<UpdateReportPdfData, UpdateReportPdfVariables>;

interface UpdateReportPdfRef {
  ...
  (dc: DataConnect, vars: UpdateReportPdfVariables): MutationRef<UpdateReportPdfData, UpdateReportPdfVariables>;
}
export const updateReportPdfRef: UpdateReportPdfRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReportPdfRef:
```typescript
const name = updateReportPdfRef.operationName;
console.log(name);
```

### Variables
The `UpdateReportPdf` mutation requires an argument of type `UpdateReportPdfVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReportPdfVariables {
  id: UUIDString;
  pdfUrl: string;
}
```
### Return Type
Recall that executing the `UpdateReportPdf` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReportPdfData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReportPdfData {
  report_update?: Report_Key | null;
}
```
### Using `UpdateReportPdf`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReportPdf, UpdateReportPdfVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateReportPdf` mutation requires an argument of type `UpdateReportPdfVariables`:
const updateReportPdfVars: UpdateReportPdfVariables = {
  id: ..., 
  pdfUrl: ..., 
};

// Call the `updateReportPdf()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReportPdf(updateReportPdfVars);
// Variables can be defined inline as well.
const { data } = await updateReportPdf({ id: ..., pdfUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReportPdf(dataConnect, updateReportPdfVars);

console.log(data.report_update);

// Or, you can use the `Promise` API.
updateReportPdf(updateReportPdfVars).then((response) => {
  const data = response.data;
  console.log(data.report_update);
});
```

### Using `UpdateReportPdf`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReportPdfRef, UpdateReportPdfVariables } from '@sanwa-houkai-app/dataconnect';

// The `UpdateReportPdf` mutation requires an argument of type `UpdateReportPdfVariables`:
const updateReportPdfVars: UpdateReportPdfVariables = {
  id: ..., 
  pdfUrl: ..., 
};

// Call the `updateReportPdfRef()` function to get a reference to the mutation.
const ref = updateReportPdfRef(updateReportPdfVars);
// Variables can be defined inline as well.
const ref = updateReportPdfRef({ id: ..., pdfUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReportPdfRef(dataConnect, updateReportPdfVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.report_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.report_update);
});
```

## CreateCarePlan
You can execute the `CreateCarePlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCarePlan(vars: CreateCarePlanVariables): MutationPromise<CreateCarePlanData, CreateCarePlanVariables>;

interface CreateCarePlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCarePlanVariables): MutationRef<CreateCarePlanData, CreateCarePlanVariables>;
}
export const createCarePlanRef: CreateCarePlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCarePlan(dc: DataConnect, vars: CreateCarePlanVariables): MutationPromise<CreateCarePlanData, CreateCarePlanVariables>;

interface CreateCarePlanRef {
  ...
  (dc: DataConnect, vars: CreateCarePlanVariables): MutationRef<CreateCarePlanData, CreateCarePlanVariables>;
}
export const createCarePlanRef: CreateCarePlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCarePlanRef:
```typescript
const name = createCarePlanRef.operationName;
console.log(name);
```

### Variables
The `CreateCarePlan` mutation requires an argument of type `CreateCarePlanVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCarePlanVariables {
  clientId: UUIDString;
  staffId: UUIDString;
  currentSituation?: string | null;
  familyWishes?: string | null;
  mainSupport?: string | null;
  longTermGoals?: unknown | null;
  shortTermGoals?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateCarePlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCarePlanData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCarePlanData {
  carePlan_insert: CarePlan_Key;
}
```
### Using `CreateCarePlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCarePlan, CreateCarePlanVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateCarePlan` mutation requires an argument of type `CreateCarePlanVariables`:
const createCarePlanVars: CreateCarePlanVariables = {
  clientId: ..., 
  staffId: ..., 
  currentSituation: ..., // optional
  familyWishes: ..., // optional
  mainSupport: ..., // optional
  longTermGoals: ..., // optional
  shortTermGoals: ..., // optional
};

// Call the `createCarePlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCarePlan(createCarePlanVars);
// Variables can be defined inline as well.
const { data } = await createCarePlan({ clientId: ..., staffId: ..., currentSituation: ..., familyWishes: ..., mainSupport: ..., longTermGoals: ..., shortTermGoals: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCarePlan(dataConnect, createCarePlanVars);

console.log(data.carePlan_insert);

// Or, you can use the `Promise` API.
createCarePlan(createCarePlanVars).then((response) => {
  const data = response.data;
  console.log(data.carePlan_insert);
});
```

### Using `CreateCarePlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCarePlanRef, CreateCarePlanVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateCarePlan` mutation requires an argument of type `CreateCarePlanVariables`:
const createCarePlanVars: CreateCarePlanVariables = {
  clientId: ..., 
  staffId: ..., 
  currentSituation: ..., // optional
  familyWishes: ..., // optional
  mainSupport: ..., // optional
  longTermGoals: ..., // optional
  shortTermGoals: ..., // optional
};

// Call the `createCarePlanRef()` function to get a reference to the mutation.
const ref = createCarePlanRef(createCarePlanVars);
// Variables can be defined inline as well.
const ref = createCarePlanRef({ clientId: ..., staffId: ..., currentSituation: ..., familyWishes: ..., mainSupport: ..., longTermGoals: ..., shortTermGoals: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCarePlanRef(dataConnect, createCarePlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.carePlan_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.carePlan_insert);
});
```

## SeedCareLevel
You can execute the `SeedCareLevel` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
seedCareLevel(vars: SeedCareLevelVariables): MutationPromise<SeedCareLevelData, SeedCareLevelVariables>;

interface SeedCareLevelRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SeedCareLevelVariables): MutationRef<SeedCareLevelData, SeedCareLevelVariables>;
}
export const seedCareLevelRef: SeedCareLevelRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
seedCareLevel(dc: DataConnect, vars: SeedCareLevelVariables): MutationPromise<SeedCareLevelData, SeedCareLevelVariables>;

interface SeedCareLevelRef {
  ...
  (dc: DataConnect, vars: SeedCareLevelVariables): MutationRef<SeedCareLevelData, SeedCareLevelVariables>;
}
export const seedCareLevelRef: SeedCareLevelRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the seedCareLevelRef:
```typescript
const name = seedCareLevelRef.operationName;
console.log(name);
```

### Variables
The `SeedCareLevel` mutation requires an argument of type `SeedCareLevelVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SeedCareLevelVariables {
  name: string;
  sortOrder: number;
}
```
### Return Type
Recall that executing the `SeedCareLevel` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SeedCareLevelData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SeedCareLevelData {
  careLevel_insert: CareLevel_Key;
}
```
### Using `SeedCareLevel`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, seedCareLevel, SeedCareLevelVariables } from '@sanwa-houkai-app/dataconnect';

// The `SeedCareLevel` mutation requires an argument of type `SeedCareLevelVariables`:
const seedCareLevelVars: SeedCareLevelVariables = {
  name: ..., 
  sortOrder: ..., 
};

// Call the `seedCareLevel()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await seedCareLevel(seedCareLevelVars);
// Variables can be defined inline as well.
const { data } = await seedCareLevel({ name: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await seedCareLevel(dataConnect, seedCareLevelVars);

console.log(data.careLevel_insert);

// Or, you can use the `Promise` API.
seedCareLevel(seedCareLevelVars).then((response) => {
  const data = response.data;
  console.log(data.careLevel_insert);
});
```

### Using `SeedCareLevel`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, seedCareLevelRef, SeedCareLevelVariables } from '@sanwa-houkai-app/dataconnect';

// The `SeedCareLevel` mutation requires an argument of type `SeedCareLevelVariables`:
const seedCareLevelVars: SeedCareLevelVariables = {
  name: ..., 
  sortOrder: ..., 
};

// Call the `seedCareLevelRef()` function to get a reference to the mutation.
const ref = seedCareLevelRef(seedCareLevelVars);
// Variables can be defined inline as well.
const ref = seedCareLevelRef({ name: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = seedCareLevelRef(dataConnect, seedCareLevelVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.careLevel_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.careLevel_insert);
});
```

## SeedVisitReason
You can execute the `SeedVisitReason` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
seedVisitReason(vars: SeedVisitReasonVariables): MutationPromise<SeedVisitReasonData, SeedVisitReasonVariables>;

interface SeedVisitReasonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SeedVisitReasonVariables): MutationRef<SeedVisitReasonData, SeedVisitReasonVariables>;
}
export const seedVisitReasonRef: SeedVisitReasonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
seedVisitReason(dc: DataConnect, vars: SeedVisitReasonVariables): MutationPromise<SeedVisitReasonData, SeedVisitReasonVariables>;

interface SeedVisitReasonRef {
  ...
  (dc: DataConnect, vars: SeedVisitReasonVariables): MutationRef<SeedVisitReasonData, SeedVisitReasonVariables>;
}
export const seedVisitReasonRef: SeedVisitReasonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the seedVisitReasonRef:
```typescript
const name = seedVisitReasonRef.operationName;
console.log(name);
```

### Variables
The `SeedVisitReason` mutation requires an argument of type `SeedVisitReasonVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SeedVisitReasonVariables {
  name: string;
  sortOrder: number;
}
```
### Return Type
Recall that executing the `SeedVisitReason` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SeedVisitReasonData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SeedVisitReasonData {
  visitReason_insert: VisitReason_Key;
}
```
### Using `SeedVisitReason`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, seedVisitReason, SeedVisitReasonVariables } from '@sanwa-houkai-app/dataconnect';

// The `SeedVisitReason` mutation requires an argument of type `SeedVisitReasonVariables`:
const seedVisitReasonVars: SeedVisitReasonVariables = {
  name: ..., 
  sortOrder: ..., 
};

// Call the `seedVisitReason()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await seedVisitReason(seedVisitReasonVars);
// Variables can be defined inline as well.
const { data } = await seedVisitReason({ name: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await seedVisitReason(dataConnect, seedVisitReasonVars);

console.log(data.visitReason_insert);

// Or, you can use the `Promise` API.
seedVisitReason(seedVisitReasonVars).then((response) => {
  const data = response.data;
  console.log(data.visitReason_insert);
});
```

### Using `SeedVisitReason`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, seedVisitReasonRef, SeedVisitReasonVariables } from '@sanwa-houkai-app/dataconnect';

// The `SeedVisitReason` mutation requires an argument of type `SeedVisitReasonVariables`:
const seedVisitReasonVars: SeedVisitReasonVariables = {
  name: ..., 
  sortOrder: ..., 
};

// Call the `seedVisitReasonRef()` function to get a reference to the mutation.
const ref = seedVisitReasonRef(seedVisitReasonVars);
// Variables can be defined inline as well.
const ref = seedVisitReasonRef({ name: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = seedVisitReasonRef(dataConnect, seedVisitReasonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.visitReason_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.visitReason_insert);
});
```

## CreateFacility
You can execute the `CreateFacility` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createFacility(vars: CreateFacilityVariables): MutationPromise<CreateFacilityData, CreateFacilityVariables>;

interface CreateFacilityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFacilityVariables): MutationRef<CreateFacilityData, CreateFacilityVariables>;
}
export const createFacilityRef: CreateFacilityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFacility(dc: DataConnect, vars: CreateFacilityVariables): MutationPromise<CreateFacilityData, CreateFacilityVariables>;

interface CreateFacilityRef {
  ...
  (dc: DataConnect, vars: CreateFacilityVariables): MutationRef<CreateFacilityData, CreateFacilityVariables>;
}
export const createFacilityRef: CreateFacilityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFacilityRef:
```typescript
const name = createFacilityRef.operationName;
console.log(name);
```

### Variables
The `CreateFacility` mutation requires an argument of type `CreateFacilityVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFacilityVariables {
  name: string;
  address?: string | null;
  phone?: string | null;
}
```
### Return Type
Recall that executing the `CreateFacility` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFacilityData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFacilityData {
  facility_insert: Facility_Key;
}
```
### Using `CreateFacility`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFacility, CreateFacilityVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateFacility` mutation requires an argument of type `CreateFacilityVariables`:
const createFacilityVars: CreateFacilityVariables = {
  name: ..., 
  address: ..., // optional
  phone: ..., // optional
};

// Call the `createFacility()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFacility(createFacilityVars);
// Variables can be defined inline as well.
const { data } = await createFacility({ name: ..., address: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFacility(dataConnect, createFacilityVars);

console.log(data.facility_insert);

// Or, you can use the `Promise` API.
createFacility(createFacilityVars).then((response) => {
  const data = response.data;
  console.log(data.facility_insert);
});
```

### Using `CreateFacility`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFacilityRef, CreateFacilityVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateFacility` mutation requires an argument of type `CreateFacilityVariables`:
const createFacilityVars: CreateFacilityVariables = {
  name: ..., 
  address: ..., // optional
  phone: ..., // optional
};

// Call the `createFacilityRef()` function to get a reference to the mutation.
const ref = createFacilityRef(createFacilityVars);
// Variables can be defined inline as well.
const ref = createFacilityRef({ name: ..., address: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFacilityRef(dataConnect, createFacilityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.facility_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.facility_insert);
});
```

## CreateStaff
You can execute the `CreateStaff` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createStaff(vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;

interface CreateStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
}
export const createStaffRef: CreateStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStaff(dc: DataConnect, vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;

interface CreateStaffRef {
  ...
  (dc: DataConnect, vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
}
export const createStaffRef: CreateStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStaffRef:
```typescript
const name = createStaffRef.operationName;
console.log(name);
```

### Variables
The `CreateStaff` mutation requires an argument of type `CreateStaffVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStaffVariables {
  facilityId: UUIDString;
  firebaseUid?: string | null;
  name: string;
  email?: string | null;
  role?: string | null;
}
```
### Return Type
Recall that executing the `CreateStaff` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStaffData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStaffData {
  staff_insert: Staff_Key;
}
```
### Using `CreateStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStaff, CreateStaffVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateStaff` mutation requires an argument of type `CreateStaffVariables`:
const createStaffVars: CreateStaffVariables = {
  facilityId: ..., 
  firebaseUid: ..., // optional
  name: ..., 
  email: ..., // optional
  role: ..., // optional
};

// Call the `createStaff()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStaff(createStaffVars);
// Variables can be defined inline as well.
const { data } = await createStaff({ facilityId: ..., firebaseUid: ..., name: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStaff(dataConnect, createStaffVars);

console.log(data.staff_insert);

// Or, you can use the `Promise` API.
createStaff(createStaffVars).then((response) => {
  const data = response.data;
  console.log(data.staff_insert);
});
```

### Using `CreateStaff`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStaffRef, CreateStaffVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateStaff` mutation requires an argument of type `CreateStaffVariables`:
const createStaffVars: CreateStaffVariables = {
  facilityId: ..., 
  firebaseUid: ..., // optional
  name: ..., 
  email: ..., // optional
  role: ..., // optional
};

// Call the `createStaffRef()` function to get a reference to the mutation.
const ref = createStaffRef(createStaffVars);
// Variables can be defined inline as well.
const ref = createStaffRef({ facilityId: ..., firebaseUid: ..., name: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStaffRef(dataConnect, createStaffVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staff_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staff_insert);
});
```

## CreateServiceType
You can execute the `CreateServiceType` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createServiceType(vars: CreateServiceTypeVariables): MutationPromise<CreateServiceTypeData, CreateServiceTypeVariables>;

interface CreateServiceTypeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceTypeVariables): MutationRef<CreateServiceTypeData, CreateServiceTypeVariables>;
}
export const createServiceTypeRef: CreateServiceTypeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServiceType(dc: DataConnect, vars: CreateServiceTypeVariables): MutationPromise<CreateServiceTypeData, CreateServiceTypeVariables>;

interface CreateServiceTypeRef {
  ...
  (dc: DataConnect, vars: CreateServiceTypeVariables): MutationRef<CreateServiceTypeData, CreateServiceTypeVariables>;
}
export const createServiceTypeRef: CreateServiceTypeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceTypeRef:
```typescript
const name = createServiceTypeRef.operationName;
console.log(name);
```

### Variables
The `CreateServiceType` mutation requires an argument of type `CreateServiceTypeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceTypeVariables {
  facilityId: UUIDString;
  code?: string | null;
  name: string;
  category: string;
  color?: string | null;
  sortOrder?: number | null;
}
```
### Return Type
Recall that executing the `CreateServiceType` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceTypeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceTypeData {
  serviceType_insert: ServiceType_Key;
}
```
### Using `CreateServiceType`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServiceType, CreateServiceTypeVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateServiceType` mutation requires an argument of type `CreateServiceTypeVariables`:
const createServiceTypeVars: CreateServiceTypeVariables = {
  facilityId: ..., 
  code: ..., // optional
  name: ..., 
  category: ..., 
  color: ..., // optional
  sortOrder: ..., // optional
};

// Call the `createServiceType()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServiceType(createServiceTypeVars);
// Variables can be defined inline as well.
const { data } = await createServiceType({ facilityId: ..., code: ..., name: ..., category: ..., color: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServiceType(dataConnect, createServiceTypeVars);

console.log(data.serviceType_insert);

// Or, you can use the `Promise` API.
createServiceType(createServiceTypeVars).then((response) => {
  const data = response.data;
  console.log(data.serviceType_insert);
});
```

### Using `CreateServiceType`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceTypeRef, CreateServiceTypeVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateServiceType` mutation requires an argument of type `CreateServiceTypeVariables`:
const createServiceTypeVars: CreateServiceTypeVariables = {
  facilityId: ..., 
  code: ..., // optional
  name: ..., 
  category: ..., 
  color: ..., // optional
  sortOrder: ..., // optional
};

// Call the `createServiceTypeRef()` function to get a reference to the mutation.
const ref = createServiceTypeRef(createServiceTypeVars);
// Variables can be defined inline as well.
const ref = createServiceTypeRef({ facilityId: ..., code: ..., name: ..., category: ..., color: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceTypeRef(dataConnect, createServiceTypeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceType_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceType_insert);
});
```

## CreateServiceItem
You can execute the `CreateServiceItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createServiceItem(vars: CreateServiceItemVariables): MutationPromise<CreateServiceItemData, CreateServiceItemVariables>;

interface CreateServiceItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceItemVariables): MutationRef<CreateServiceItemData, CreateServiceItemVariables>;
}
export const createServiceItemRef: CreateServiceItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServiceItem(dc: DataConnect, vars: CreateServiceItemVariables): MutationPromise<CreateServiceItemData, CreateServiceItemVariables>;

interface CreateServiceItemRef {
  ...
  (dc: DataConnect, vars: CreateServiceItemVariables): MutationRef<CreateServiceItemData, CreateServiceItemVariables>;
}
export const createServiceItemRef: CreateServiceItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceItemRef:
```typescript
const name = createServiceItemRef.operationName;
console.log(name);
```

### Variables
The `CreateServiceItem` mutation requires an argument of type `CreateServiceItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceItemVariables {
  serviceTypeId: UUIDString;
  name: string;
  sortOrder?: number | null;
}
```
### Return Type
Recall that executing the `CreateServiceItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceItemData {
  serviceItem_insert: ServiceItem_Key;
}
```
### Using `CreateServiceItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServiceItem, CreateServiceItemVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateServiceItem` mutation requires an argument of type `CreateServiceItemVariables`:
const createServiceItemVars: CreateServiceItemVariables = {
  serviceTypeId: ..., 
  name: ..., 
  sortOrder: ..., // optional
};

// Call the `createServiceItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServiceItem(createServiceItemVars);
// Variables can be defined inline as well.
const { data } = await createServiceItem({ serviceTypeId: ..., name: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServiceItem(dataConnect, createServiceItemVars);

console.log(data.serviceItem_insert);

// Or, you can use the `Promise` API.
createServiceItem(createServiceItemVars).then((response) => {
  const data = response.data;
  console.log(data.serviceItem_insert);
});
```

### Using `CreateServiceItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceItemRef, CreateServiceItemVariables } from '@sanwa-houkai-app/dataconnect';

// The `CreateServiceItem` mutation requires an argument of type `CreateServiceItemVariables`:
const createServiceItemVars: CreateServiceItemVariables = {
  serviceTypeId: ..., 
  name: ..., 
  sortOrder: ..., // optional
};

// Call the `createServiceItemRef()` function to get a reference to the mutation.
const ref = createServiceItemRef(createServiceItemVars);
// Variables can be defined inline as well.
const ref = createServiceItemRef({ serviceTypeId: ..., name: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceItemRef(dataConnect, createServiceItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceItem_insert);
});
```

