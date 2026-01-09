# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listCareLevels, listVisitReasons, listServiceTypes, listServiceItems, getStaffByFirebaseUid, listStaff, listClients, getClient, listSchedulesByDateRange, getSchedulesByRecurrenceId } from '@sanwa-houkai-app/dataconnect';


// Operation ListCareLevels: 
const { data } = await ListCareLevels(dataConnect);

// Operation ListVisitReasons: 
const { data } = await ListVisitReasons(dataConnect);

// Operation ListServiceTypes:  For variables, look at type ListServiceTypesVars in ../index.d.ts
const { data } = await ListServiceTypes(dataConnect, listServiceTypesVars);

// Operation ListServiceItems:  For variables, look at type ListServiceItemsVars in ../index.d.ts
const { data } = await ListServiceItems(dataConnect, listServiceItemsVars);

// Operation GetStaffByFirebaseUid:  For variables, look at type GetStaffByFirebaseUidVars in ../index.d.ts
const { data } = await GetStaffByFirebaseUid(dataConnect, getStaffByFirebaseUidVars);

// Operation ListStaff:  For variables, look at type ListStaffVars in ../index.d.ts
const { data } = await ListStaff(dataConnect, listStaffVars);

// Operation ListClients:  For variables, look at type ListClientsVars in ../index.d.ts
const { data } = await ListClients(dataConnect, listClientsVars);

// Operation GetClient:  For variables, look at type GetClientVars in ../index.d.ts
const { data } = await GetClient(dataConnect, getClientVars);

// Operation ListSchedulesByDateRange:  For variables, look at type ListSchedulesByDateRangeVars in ../index.d.ts
const { data } = await ListSchedulesByDateRange(dataConnect, listSchedulesByDateRangeVars);

// Operation GetSchedulesByRecurrenceId:  For variables, look at type GetSchedulesByRecurrenceIdVars in ../index.d.ts
const { data } = await GetSchedulesByRecurrenceId(dataConnect, getSchedulesByRecurrenceIdVars);


```