# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createClient, updateClient, deleteClient, createSchedule, updateSchedule, deleteSchedule, cancelSchedule, completeSchedule, createVisitRecord, updateVisitRecord } from '@sanwa-houkai-app/dataconnect';


// Operation CreateClient:  For variables, look at type CreateClientVars in ../index.d.ts
const { data } = await CreateClient(dataConnect, createClientVars);

// Operation UpdateClient:  For variables, look at type UpdateClientVars in ../index.d.ts
const { data } = await UpdateClient(dataConnect, updateClientVars);

// Operation DeleteClient:  For variables, look at type DeleteClientVars in ../index.d.ts
const { data } = await DeleteClient(dataConnect, deleteClientVars);

// Operation CreateSchedule:  For variables, look at type CreateScheduleVars in ../index.d.ts
const { data } = await CreateSchedule(dataConnect, createScheduleVars);

// Operation UpdateSchedule:  For variables, look at type UpdateScheduleVars in ../index.d.ts
const { data } = await UpdateSchedule(dataConnect, updateScheduleVars);

// Operation DeleteSchedule:  For variables, look at type DeleteScheduleVars in ../index.d.ts
const { data } = await DeleteSchedule(dataConnect, deleteScheduleVars);

// Operation CancelSchedule:  For variables, look at type CancelScheduleVars in ../index.d.ts
const { data } = await CancelSchedule(dataConnect, cancelScheduleVars);

// Operation CompleteSchedule:  For variables, look at type CompleteScheduleVars in ../index.d.ts
const { data } = await CompleteSchedule(dataConnect, completeScheduleVars);

// Operation CreateVisitRecord:  For variables, look at type CreateVisitRecordVars in ../index.d.ts
const { data } = await CreateVisitRecord(dataConnect, createVisitRecordVars);

// Operation UpdateVisitRecord:  For variables, look at type UpdateVisitRecordVars in ../index.d.ts
const { data } = await UpdateVisitRecord(dataConnect, updateVisitRecordVars);


```