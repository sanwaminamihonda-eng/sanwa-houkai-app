import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'sanwa-houkai-service',
  location: 'asia-northeast1'
};

export const createClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateClient', inputVars);
}
createClientRef.operationName = 'CreateClient';

export function createClient(dcOrVars, vars) {
  return executeMutation(createClientRef(dcOrVars, vars));
}

export const updateClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClient', inputVars);
}
updateClientRef.operationName = 'UpdateClient';

export function updateClient(dcOrVars, vars) {
  return executeMutation(updateClientRef(dcOrVars, vars));
}

export const deleteClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteClient', inputVars);
}
deleteClientRef.operationName = 'DeleteClient';

export function deleteClient(dcOrVars, vars) {
  return executeMutation(deleteClientRef(dcOrVars, vars));
}

export const createScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSchedule', inputVars);
}
createScheduleRef.operationName = 'CreateSchedule';

export function createSchedule(dcOrVars, vars) {
  return executeMutation(createScheduleRef(dcOrVars, vars));
}

export const updateScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSchedule', inputVars);
}
updateScheduleRef.operationName = 'UpdateSchedule';

export function updateSchedule(dcOrVars, vars) {
  return executeMutation(updateScheduleRef(dcOrVars, vars));
}

export const deleteScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSchedule', inputVars);
}
deleteScheduleRef.operationName = 'DeleteSchedule';

export function deleteSchedule(dcOrVars, vars) {
  return executeMutation(deleteScheduleRef(dcOrVars, vars));
}

export const cancelScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelSchedule', inputVars);
}
cancelScheduleRef.operationName = 'CancelSchedule';

export function cancelSchedule(dcOrVars, vars) {
  return executeMutation(cancelScheduleRef(dcOrVars, vars));
}

export const completeScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteSchedule', inputVars);
}
completeScheduleRef.operationName = 'CompleteSchedule';

export function completeSchedule(dcOrVars, vars) {
  return executeMutation(completeScheduleRef(dcOrVars, vars));
}

export const createVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVisitRecord', inputVars);
}
createVisitRecordRef.operationName = 'CreateVisitRecord';

export function createVisitRecord(dcOrVars, vars) {
  return executeMutation(createVisitRecordRef(dcOrVars, vars));
}

export const updateVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVisitRecord', inputVars);
}
updateVisitRecordRef.operationName = 'UpdateVisitRecord';

export function updateVisitRecord(dcOrVars, vars) {
  return executeMutation(updateVisitRecordRef(dcOrVars, vars));
}

export const deleteVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteVisitRecord', inputVars);
}
deleteVisitRecordRef.operationName = 'DeleteVisitRecord';

export function deleteVisitRecord(dcOrVars, vars) {
  return executeMutation(deleteVisitRecordRef(dcOrVars, vars));
}

export const createReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateReport', inputVars);
}
createReportRef.operationName = 'CreateReport';

export function createReport(dcOrVars, vars) {
  return executeMutation(createReportRef(dcOrVars, vars));
}

export const updateReportPdfRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateReportPdf', inputVars);
}
updateReportPdfRef.operationName = 'UpdateReportPdf';

export function updateReportPdf(dcOrVars, vars) {
  return executeMutation(updateReportPdfRef(dcOrVars, vars));
}

export const createCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCarePlan', inputVars);
}
createCarePlanRef.operationName = 'CreateCarePlan';

export function createCarePlan(dcOrVars, vars) {
  return executeMutation(createCarePlanRef(dcOrVars, vars));
}

export const updateCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCarePlan', inputVars);
}
updateCarePlanRef.operationName = 'UpdateCarePlan';

export function updateCarePlan(dcOrVars, vars) {
  return executeMutation(updateCarePlanRef(dcOrVars, vars));
}

export const deleteCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCarePlan', inputVars);
}
deleteCarePlanRef.operationName = 'DeleteCarePlan';

export function deleteCarePlan(dcOrVars, vars) {
  return executeMutation(deleteCarePlanRef(dcOrVars, vars));
}

export const seedCareLevelRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedCareLevel', inputVars);
}
seedCareLevelRef.operationName = 'SeedCareLevel';

export function seedCareLevel(dcOrVars, vars) {
  return executeMutation(seedCareLevelRef(dcOrVars, vars));
}

export const seedVisitReasonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedVisitReason', inputVars);
}
seedVisitReasonRef.operationName = 'SeedVisitReason';

export function seedVisitReason(dcOrVars, vars) {
  return executeMutation(seedVisitReasonRef(dcOrVars, vars));
}

export const createFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFacility', inputVars);
}
createFacilityRef.operationName = 'CreateFacility';

export function createFacility(dcOrVars, vars) {
  return executeMutation(createFacilityRef(dcOrVars, vars));
}

export const createStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStaff', inputVars);
}
createStaffRef.operationName = 'CreateStaff';

export function createStaff(dcOrVars, vars) {
  return executeMutation(createStaffRef(dcOrVars, vars));
}

export const createServiceTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceType', inputVars);
}
createServiceTypeRef.operationName = 'CreateServiceType';

export function createServiceType(dcOrVars, vars) {
  return executeMutation(createServiceTypeRef(dcOrVars, vars));
}

export const createServiceItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceItem', inputVars);
}
createServiceItemRef.operationName = 'CreateServiceItem';

export function createServiceItem(dcOrVars, vars) {
  return executeMutation(createServiceItemRef(dcOrVars, vars));
}

export const demoCreateVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoCreateVisitRecord', inputVars);
}
demoCreateVisitRecordRef.operationName = 'DemoCreateVisitRecord';

export function demoCreateVisitRecord(dcOrVars, vars) {
  return executeMutation(demoCreateVisitRecordRef(dcOrVars, vars));
}

export const demoUpdateVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoUpdateVisitRecord', inputVars);
}
demoUpdateVisitRecordRef.operationName = 'DemoUpdateVisitRecord';

export function demoUpdateVisitRecord(dcOrVars, vars) {
  return executeMutation(demoUpdateVisitRecordRef(dcOrVars, vars));
}

export const demoDeleteVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoDeleteVisitRecord', inputVars);
}
demoDeleteVisitRecordRef.operationName = 'DemoDeleteVisitRecord';

export function demoDeleteVisitRecord(dcOrVars, vars) {
  return executeMutation(demoDeleteVisitRecordRef(dcOrVars, vars));
}

export const demoCreateScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoCreateSchedule', inputVars);
}
demoCreateScheduleRef.operationName = 'DemoCreateSchedule';

export function demoCreateSchedule(dcOrVars, vars) {
  return executeMutation(demoCreateScheduleRef(dcOrVars, vars));
}

export const demoUpdateScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoUpdateSchedule', inputVars);
}
demoUpdateScheduleRef.operationName = 'DemoUpdateSchedule';

export function demoUpdateSchedule(dcOrVars, vars) {
  return executeMutation(demoUpdateScheduleRef(dcOrVars, vars));
}

export const demoDeleteScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoDeleteSchedule', inputVars);
}
demoDeleteScheduleRef.operationName = 'DemoDeleteSchedule';

export function demoDeleteSchedule(dcOrVars, vars) {
  return executeMutation(demoDeleteScheduleRef(dcOrVars, vars));
}

export const demoCreateClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoCreateClient', inputVars);
}
demoCreateClientRef.operationName = 'DemoCreateClient';

export function demoCreateClient(dcOrVars, vars) {
  return executeMutation(demoCreateClientRef(dcOrVars, vars));
}

export const demoUpdateClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoUpdateClient', inputVars);
}
demoUpdateClientRef.operationName = 'DemoUpdateClient';

export function demoUpdateClient(dcOrVars, vars) {
  return executeMutation(demoUpdateClientRef(dcOrVars, vars));
}

export const demoDeleteClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoDeleteClient', inputVars);
}
demoDeleteClientRef.operationName = 'DemoDeleteClient';

export function demoDeleteClient(dcOrVars, vars) {
  return executeMutation(demoDeleteClientRef(dcOrVars, vars));
}

export const listCareLevelsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCareLevels');
}
listCareLevelsRef.operationName = 'ListCareLevels';

export function listCareLevels(dc) {
  return executeQuery(listCareLevelsRef(dc));
}

export const listVisitReasonsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisitReasons');
}
listVisitReasonsRef.operationName = 'ListVisitReasons';

export function listVisitReasons(dc) {
  return executeQuery(listVisitReasonsRef(dc));
}

export const listServiceTypesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListServiceTypes', inputVars);
}
listServiceTypesRef.operationName = 'ListServiceTypes';

export function listServiceTypes(dcOrVars, vars) {
  return executeQuery(listServiceTypesRef(dcOrVars, vars));
}

export const listServiceItemsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListServiceItems', inputVars);
}
listServiceItemsRef.operationName = 'ListServiceItems';

export function listServiceItems(dcOrVars, vars) {
  return executeQuery(listServiceItemsRef(dcOrVars, vars));
}

export const getStaffByFirebaseUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffByFirebaseUid', inputVars);
}
getStaffByFirebaseUidRef.operationName = 'GetStaffByFirebaseUid';

export function getStaffByFirebaseUid(dcOrVars, vars) {
  return executeQuery(getStaffByFirebaseUidRef(dcOrVars, vars));
}

export const listStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStaff', inputVars);
}
listStaffRef.operationName = 'ListStaff';

export function listStaff(dcOrVars, vars) {
  return executeQuery(listStaffRef(dcOrVars, vars));
}

export const listClientsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListClients', inputVars);
}
listClientsRef.operationName = 'ListClients';

export function listClients(dcOrVars, vars) {
  return executeQuery(listClientsRef(dcOrVars, vars));
}

export const getClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClient', inputVars);
}
getClientRef.operationName = 'GetClient';

export function getClient(dcOrVars, vars) {
  return executeQuery(getClientRef(dcOrVars, vars));
}

export const listSchedulesByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSchedulesByDateRange', inputVars);
}
listSchedulesByDateRangeRef.operationName = 'ListSchedulesByDateRange';

export function listSchedulesByDateRange(dcOrVars, vars) {
  return executeQuery(listSchedulesByDateRangeRef(dcOrVars, vars));
}

export const getSchedulesByRecurrenceIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSchedulesByRecurrenceId', inputVars);
}
getSchedulesByRecurrenceIdRef.operationName = 'GetSchedulesByRecurrenceId';

export function getSchedulesByRecurrenceId(dcOrVars, vars) {
  return executeQuery(getSchedulesByRecurrenceIdRef(dcOrVars, vars));
}

export const listSchedulesByStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSchedulesByStaff', inputVars);
}
listSchedulesByStaffRef.operationName = 'ListSchedulesByStaff';

export function listSchedulesByStaff(dcOrVars, vars) {
  return executeQuery(listSchedulesByStaffRef(dcOrVars, vars));
}

export const listVisitRecordsByClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisitRecordsByClient', inputVars);
}
listVisitRecordsByClientRef.operationName = 'ListVisitRecordsByClient';

export function listVisitRecordsByClient(dcOrVars, vars) {
  return executeQuery(listVisitRecordsByClientRef(dcOrVars, vars));
}

export const listVisitRecordsByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisitRecordsByDateRange', inputVars);
}
listVisitRecordsByDateRangeRef.operationName = 'ListVisitRecordsByDateRange';

export function listVisitRecordsByDateRange(dcOrVars, vars) {
  return executeQuery(listVisitRecordsByDateRangeRef(dcOrVars, vars));
}

export const getVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVisitRecord', inputVars);
}
getVisitRecordRef.operationName = 'GetVisitRecord';

export function getVisitRecord(dcOrVars, vars) {
  return executeQuery(getVisitRecordRef(dcOrVars, vars));
}

export const listReportsByClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReportsByClient', inputVars);
}
listReportsByClientRef.operationName = 'ListReportsByClient';

export function listReportsByClient(dcOrVars, vars) {
  return executeQuery(listReportsByClientRef(dcOrVars, vars));
}

export const listReportsByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReportsByFacility', inputVars);
}
listReportsByFacilityRef.operationName = 'ListReportsByFacility';

export function listReportsByFacility(dcOrVars, vars) {
  return executeQuery(listReportsByFacilityRef(dcOrVars, vars));
}

export const getReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetReport', inputVars);
}
getReportRef.operationName = 'GetReport';

export function getReport(dcOrVars, vars) {
  return executeQuery(getReportRef(dcOrVars, vars));
}

export const listCarePlansByClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCarePlansByClient', inputVars);
}
listCarePlansByClientRef.operationName = 'ListCarePlansByClient';

export function listCarePlansByClient(dcOrVars, vars) {
  return executeQuery(listCarePlansByClientRef(dcOrVars, vars));
}

export const listCarePlansByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCarePlansByFacility', inputVars);
}
listCarePlansByFacilityRef.operationName = 'ListCarePlansByFacility';

export function listCarePlansByFacility(dcOrVars, vars) {
  return executeQuery(listCarePlansByFacilityRef(dcOrVars, vars));
}

export const getCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCarePlan', inputVars);
}
getCarePlanRef.operationName = 'GetCarePlan';

export function getCarePlan(dcOrVars, vars) {
  return executeQuery(getCarePlanRef(dcOrVars, vars));
}

export const listGoalTemplatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListGoalTemplates');
}
listGoalTemplatesRef.operationName = 'ListGoalTemplates';

export function listGoalTemplates(dc) {
  return executeQuery(listGoalTemplatesRef(dc));
}

export const demoListCareLevelsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListCareLevels');
}
demoListCareLevelsRef.operationName = 'DemoListCareLevels';

export function demoListCareLevels(dc) {
  return executeQuery(demoListCareLevelsRef(dc));
}

export const demoListVisitReasonsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListVisitReasons');
}
demoListVisitReasonsRef.operationName = 'DemoListVisitReasons';

export function demoListVisitReasons(dc) {
  return executeQuery(demoListVisitReasonsRef(dc));
}

export const demoListServiceTypesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListServiceTypes', inputVars);
}
demoListServiceTypesRef.operationName = 'DemoListServiceTypes';

export function demoListServiceTypes(dcOrVars, vars) {
  return executeQuery(demoListServiceTypesRef(dcOrVars, vars));
}

export const demoListServiceItemsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListServiceItems', inputVars);
}
demoListServiceItemsRef.operationName = 'DemoListServiceItems';

export function demoListServiceItems(dcOrVars, vars) {
  return executeQuery(demoListServiceItemsRef(dcOrVars, vars));
}

export const demoListStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListStaff', inputVars);
}
demoListStaffRef.operationName = 'DemoListStaff';

export function demoListStaff(dcOrVars, vars) {
  return executeQuery(demoListStaffRef(dcOrVars, vars));
}

export const demoListClientsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListClients', inputVars);
}
demoListClientsRef.operationName = 'DemoListClients';

export function demoListClients(dcOrVars, vars) {
  return executeQuery(demoListClientsRef(dcOrVars, vars));
}

export const demoGetClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetClient', inputVars);
}
demoGetClientRef.operationName = 'DemoGetClient';

export function demoGetClient(dcOrVars, vars) {
  return executeQuery(demoGetClientRef(dcOrVars, vars));
}

export const demoListSchedulesByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListSchedulesByDateRange', inputVars);
}
demoListSchedulesByDateRangeRef.operationName = 'DemoListSchedulesByDateRange';

export function demoListSchedulesByDateRange(dcOrVars, vars) {
  return executeQuery(demoListSchedulesByDateRangeRef(dcOrVars, vars));
}

export const demoGetSchedulesByRecurrenceIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetSchedulesByRecurrenceId', inputVars);
}
demoGetSchedulesByRecurrenceIdRef.operationName = 'DemoGetSchedulesByRecurrenceId';

export function demoGetSchedulesByRecurrenceId(dcOrVars, vars) {
  return executeQuery(demoGetSchedulesByRecurrenceIdRef(dcOrVars, vars));
}

export const demoListVisitRecordsByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListVisitRecordsByDateRange', inputVars);
}
demoListVisitRecordsByDateRangeRef.operationName = 'DemoListVisitRecordsByDateRange';

export function demoListVisitRecordsByDateRange(dcOrVars, vars) {
  return executeQuery(demoListVisitRecordsByDateRangeRef(dcOrVars, vars));
}

export const demoGetVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetVisitRecord', inputVars);
}
demoGetVisitRecordRef.operationName = 'DemoGetVisitRecord';

export function demoGetVisitRecord(dcOrVars, vars) {
  return executeQuery(demoGetVisitRecordRef(dcOrVars, vars));
}

export const demoListReportsByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListReportsByFacility', inputVars);
}
demoListReportsByFacilityRef.operationName = 'DemoListReportsByFacility';

export function demoListReportsByFacility(dcOrVars, vars) {
  return executeQuery(demoListReportsByFacilityRef(dcOrVars, vars));
}

export const demoListCarePlansByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListCarePlansByFacility', inputVars);
}
demoListCarePlansByFacilityRef.operationName = 'DemoListCarePlansByFacility';

export function demoListCarePlansByFacility(dcOrVars, vars) {
  return executeQuery(demoListCarePlansByFacilityRef(dcOrVars, vars));
}

export const demoGetCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetCarePlan', inputVars);
}
demoGetCarePlanRef.operationName = 'DemoGetCarePlan';

export function demoGetCarePlan(dcOrVars, vars) {
  return executeQuery(demoGetCarePlanRef(dcOrVars, vars));
}

export const demoGetReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetReport', inputVars);
}
demoGetReportRef.operationName = 'DemoGetReport';

export function demoGetReport(dcOrVars, vars) {
  return executeQuery(demoGetReportRef(dcOrVars, vars));
}

