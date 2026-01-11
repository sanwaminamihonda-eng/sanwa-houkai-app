const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'sanwa-houkai-service',
  location: 'asia-northeast1'
};
exports.connectorConfig = connectorConfig;

const createClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateClient', inputVars);
}
createClientRef.operationName = 'CreateClient';
exports.createClientRef = createClientRef;

exports.createClient = function createClient(dcOrVars, vars) {
  return executeMutation(createClientRef(dcOrVars, vars));
};

const updateClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClient', inputVars);
}
updateClientRef.operationName = 'UpdateClient';
exports.updateClientRef = updateClientRef;

exports.updateClient = function updateClient(dcOrVars, vars) {
  return executeMutation(updateClientRef(dcOrVars, vars));
};

const deleteClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteClient', inputVars);
}
deleteClientRef.operationName = 'DeleteClient';
exports.deleteClientRef = deleteClientRef;

exports.deleteClient = function deleteClient(dcOrVars, vars) {
  return executeMutation(deleteClientRef(dcOrVars, vars));
};

const createScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSchedule', inputVars);
}
createScheduleRef.operationName = 'CreateSchedule';
exports.createScheduleRef = createScheduleRef;

exports.createSchedule = function createSchedule(dcOrVars, vars) {
  return executeMutation(createScheduleRef(dcOrVars, vars));
};

const updateScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSchedule', inputVars);
}
updateScheduleRef.operationName = 'UpdateSchedule';
exports.updateScheduleRef = updateScheduleRef;

exports.updateSchedule = function updateSchedule(dcOrVars, vars) {
  return executeMutation(updateScheduleRef(dcOrVars, vars));
};

const deleteScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSchedule', inputVars);
}
deleteScheduleRef.operationName = 'DeleteSchedule';
exports.deleteScheduleRef = deleteScheduleRef;

exports.deleteSchedule = function deleteSchedule(dcOrVars, vars) {
  return executeMutation(deleteScheduleRef(dcOrVars, vars));
};

const cancelScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CancelSchedule', inputVars);
}
cancelScheduleRef.operationName = 'CancelSchedule';
exports.cancelScheduleRef = cancelScheduleRef;

exports.cancelSchedule = function cancelSchedule(dcOrVars, vars) {
  return executeMutation(cancelScheduleRef(dcOrVars, vars));
};

const completeScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteSchedule', inputVars);
}
completeScheduleRef.operationName = 'CompleteSchedule';
exports.completeScheduleRef = completeScheduleRef;

exports.completeSchedule = function completeSchedule(dcOrVars, vars) {
  return executeMutation(completeScheduleRef(dcOrVars, vars));
};

const createVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVisitRecord', inputVars);
}
createVisitRecordRef.operationName = 'CreateVisitRecord';
exports.createVisitRecordRef = createVisitRecordRef;

exports.createVisitRecord = function createVisitRecord(dcOrVars, vars) {
  return executeMutation(createVisitRecordRef(dcOrVars, vars));
};

const updateVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVisitRecord', inputVars);
}
updateVisitRecordRef.operationName = 'UpdateVisitRecord';
exports.updateVisitRecordRef = updateVisitRecordRef;

exports.updateVisitRecord = function updateVisitRecord(dcOrVars, vars) {
  return executeMutation(updateVisitRecordRef(dcOrVars, vars));
};

const deleteVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteVisitRecord', inputVars);
}
deleteVisitRecordRef.operationName = 'DeleteVisitRecord';
exports.deleteVisitRecordRef = deleteVisitRecordRef;

exports.deleteVisitRecord = function deleteVisitRecord(dcOrVars, vars) {
  return executeMutation(deleteVisitRecordRef(dcOrVars, vars));
};

const createReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateReport', inputVars);
}
createReportRef.operationName = 'CreateReport';
exports.createReportRef = createReportRef;

exports.createReport = function createReport(dcOrVars, vars) {
  return executeMutation(createReportRef(dcOrVars, vars));
};

const updateReportPdfRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateReportPdf', inputVars);
}
updateReportPdfRef.operationName = 'UpdateReportPdf';
exports.updateReportPdfRef = updateReportPdfRef;

exports.updateReportPdf = function updateReportPdf(dcOrVars, vars) {
  return executeMutation(updateReportPdfRef(dcOrVars, vars));
};

const createCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCarePlan', inputVars);
}
createCarePlanRef.operationName = 'CreateCarePlan';
exports.createCarePlanRef = createCarePlanRef;

exports.createCarePlan = function createCarePlan(dcOrVars, vars) {
  return executeMutation(createCarePlanRef(dcOrVars, vars));
};

const updateCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCarePlan', inputVars);
}
updateCarePlanRef.operationName = 'UpdateCarePlan';
exports.updateCarePlanRef = updateCarePlanRef;

exports.updateCarePlan = function updateCarePlan(dcOrVars, vars) {
  return executeMutation(updateCarePlanRef(dcOrVars, vars));
};

const deleteCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCarePlan', inputVars);
}
deleteCarePlanRef.operationName = 'DeleteCarePlan';
exports.deleteCarePlanRef = deleteCarePlanRef;

exports.deleteCarePlan = function deleteCarePlan(dcOrVars, vars) {
  return executeMutation(deleteCarePlanRef(dcOrVars, vars));
};

const seedCareLevelRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedCareLevel', inputVars);
}
seedCareLevelRef.operationName = 'SeedCareLevel';
exports.seedCareLevelRef = seedCareLevelRef;

exports.seedCareLevel = function seedCareLevel(dcOrVars, vars) {
  return executeMutation(seedCareLevelRef(dcOrVars, vars));
};

const seedVisitReasonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedVisitReason', inputVars);
}
seedVisitReasonRef.operationName = 'SeedVisitReason';
exports.seedVisitReasonRef = seedVisitReasonRef;

exports.seedVisitReason = function seedVisitReason(dcOrVars, vars) {
  return executeMutation(seedVisitReasonRef(dcOrVars, vars));
};

const createFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFacility', inputVars);
}
createFacilityRef.operationName = 'CreateFacility';
exports.createFacilityRef = createFacilityRef;

exports.createFacility = function createFacility(dcOrVars, vars) {
  return executeMutation(createFacilityRef(dcOrVars, vars));
};

const createStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStaff', inputVars);
}
createStaffRef.operationName = 'CreateStaff';
exports.createStaffRef = createStaffRef;

exports.createStaff = function createStaff(dcOrVars, vars) {
  return executeMutation(createStaffRef(dcOrVars, vars));
};

const createServiceTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceType', inputVars);
}
createServiceTypeRef.operationName = 'CreateServiceType';
exports.createServiceTypeRef = createServiceTypeRef;

exports.createServiceType = function createServiceType(dcOrVars, vars) {
  return executeMutation(createServiceTypeRef(dcOrVars, vars));
};

const createServiceItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceItem', inputVars);
}
createServiceItemRef.operationName = 'CreateServiceItem';
exports.createServiceItemRef = createServiceItemRef;

exports.createServiceItem = function createServiceItem(dcOrVars, vars) {
  return executeMutation(createServiceItemRef(dcOrVars, vars));
};

const demoCreateVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoCreateVisitRecord', inputVars);
}
demoCreateVisitRecordRef.operationName = 'DemoCreateVisitRecord';
exports.demoCreateVisitRecordRef = demoCreateVisitRecordRef;

exports.demoCreateVisitRecord = function demoCreateVisitRecord(dcOrVars, vars) {
  return executeMutation(demoCreateVisitRecordRef(dcOrVars, vars));
};

const demoUpdateVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoUpdateVisitRecord', inputVars);
}
demoUpdateVisitRecordRef.operationName = 'DemoUpdateVisitRecord';
exports.demoUpdateVisitRecordRef = demoUpdateVisitRecordRef;

exports.demoUpdateVisitRecord = function demoUpdateVisitRecord(dcOrVars, vars) {
  return executeMutation(demoUpdateVisitRecordRef(dcOrVars, vars));
};

const demoDeleteVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoDeleteVisitRecord', inputVars);
}
demoDeleteVisitRecordRef.operationName = 'DemoDeleteVisitRecord';
exports.demoDeleteVisitRecordRef = demoDeleteVisitRecordRef;

exports.demoDeleteVisitRecord = function demoDeleteVisitRecord(dcOrVars, vars) {
  return executeMutation(demoDeleteVisitRecordRef(dcOrVars, vars));
};

const demoCreateScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoCreateSchedule', inputVars);
}
demoCreateScheduleRef.operationName = 'DemoCreateSchedule';
exports.demoCreateScheduleRef = demoCreateScheduleRef;

exports.demoCreateSchedule = function demoCreateSchedule(dcOrVars, vars) {
  return executeMutation(demoCreateScheduleRef(dcOrVars, vars));
};

const demoUpdateScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoUpdateSchedule', inputVars);
}
demoUpdateScheduleRef.operationName = 'DemoUpdateSchedule';
exports.demoUpdateScheduleRef = demoUpdateScheduleRef;

exports.demoUpdateSchedule = function demoUpdateSchedule(dcOrVars, vars) {
  return executeMutation(demoUpdateScheduleRef(dcOrVars, vars));
};

const demoDeleteScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoDeleteSchedule', inputVars);
}
demoDeleteScheduleRef.operationName = 'DemoDeleteSchedule';
exports.demoDeleteScheduleRef = demoDeleteScheduleRef;

exports.demoDeleteSchedule = function demoDeleteSchedule(dcOrVars, vars) {
  return executeMutation(demoDeleteScheduleRef(dcOrVars, vars));
};

const demoCreateClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoCreateClient', inputVars);
}
demoCreateClientRef.operationName = 'DemoCreateClient';
exports.demoCreateClientRef = demoCreateClientRef;

exports.demoCreateClient = function demoCreateClient(dcOrVars, vars) {
  return executeMutation(demoCreateClientRef(dcOrVars, vars));
};

const demoUpdateClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoUpdateClient', inputVars);
}
demoUpdateClientRef.operationName = 'DemoUpdateClient';
exports.demoUpdateClientRef = demoUpdateClientRef;

exports.demoUpdateClient = function demoUpdateClient(dcOrVars, vars) {
  return executeMutation(demoUpdateClientRef(dcOrVars, vars));
};

const demoDeleteClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DemoDeleteClient', inputVars);
}
demoDeleteClientRef.operationName = 'DemoDeleteClient';
exports.demoDeleteClientRef = demoDeleteClientRef;

exports.demoDeleteClient = function demoDeleteClient(dcOrVars, vars) {
  return executeMutation(demoDeleteClientRef(dcOrVars, vars));
};

const listCareLevelsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCareLevels');
}
listCareLevelsRef.operationName = 'ListCareLevels';
exports.listCareLevelsRef = listCareLevelsRef;

exports.listCareLevels = function listCareLevels(dc) {
  return executeQuery(listCareLevelsRef(dc));
};

const listVisitReasonsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisitReasons');
}
listVisitReasonsRef.operationName = 'ListVisitReasons';
exports.listVisitReasonsRef = listVisitReasonsRef;

exports.listVisitReasons = function listVisitReasons(dc) {
  return executeQuery(listVisitReasonsRef(dc));
};

const listServiceTypesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListServiceTypes', inputVars);
}
listServiceTypesRef.operationName = 'ListServiceTypes';
exports.listServiceTypesRef = listServiceTypesRef;

exports.listServiceTypes = function listServiceTypes(dcOrVars, vars) {
  return executeQuery(listServiceTypesRef(dcOrVars, vars));
};

const listServiceItemsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListServiceItems', inputVars);
}
listServiceItemsRef.operationName = 'ListServiceItems';
exports.listServiceItemsRef = listServiceItemsRef;

exports.listServiceItems = function listServiceItems(dcOrVars, vars) {
  return executeQuery(listServiceItemsRef(dcOrVars, vars));
};

const getStaffByFirebaseUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffByFirebaseUid', inputVars);
}
getStaffByFirebaseUidRef.operationName = 'GetStaffByFirebaseUid';
exports.getStaffByFirebaseUidRef = getStaffByFirebaseUidRef;

exports.getStaffByFirebaseUid = function getStaffByFirebaseUid(dcOrVars, vars) {
  return executeQuery(getStaffByFirebaseUidRef(dcOrVars, vars));
};

const listStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStaff', inputVars);
}
listStaffRef.operationName = 'ListStaff';
exports.listStaffRef = listStaffRef;

exports.listStaff = function listStaff(dcOrVars, vars) {
  return executeQuery(listStaffRef(dcOrVars, vars));
};

const listClientsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListClients', inputVars);
}
listClientsRef.operationName = 'ListClients';
exports.listClientsRef = listClientsRef;

exports.listClients = function listClients(dcOrVars, vars) {
  return executeQuery(listClientsRef(dcOrVars, vars));
};

const getClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClient', inputVars);
}
getClientRef.operationName = 'GetClient';
exports.getClientRef = getClientRef;

exports.getClient = function getClient(dcOrVars, vars) {
  return executeQuery(getClientRef(dcOrVars, vars));
};

const listSchedulesByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSchedulesByDateRange', inputVars);
}
listSchedulesByDateRangeRef.operationName = 'ListSchedulesByDateRange';
exports.listSchedulesByDateRangeRef = listSchedulesByDateRangeRef;

exports.listSchedulesByDateRange = function listSchedulesByDateRange(dcOrVars, vars) {
  return executeQuery(listSchedulesByDateRangeRef(dcOrVars, vars));
};

const getSchedulesByRecurrenceIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSchedulesByRecurrenceId', inputVars);
}
getSchedulesByRecurrenceIdRef.operationName = 'GetSchedulesByRecurrenceId';
exports.getSchedulesByRecurrenceIdRef = getSchedulesByRecurrenceIdRef;

exports.getSchedulesByRecurrenceId = function getSchedulesByRecurrenceId(dcOrVars, vars) {
  return executeQuery(getSchedulesByRecurrenceIdRef(dcOrVars, vars));
};

const listSchedulesByStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSchedulesByStaff', inputVars);
}
listSchedulesByStaffRef.operationName = 'ListSchedulesByStaff';
exports.listSchedulesByStaffRef = listSchedulesByStaffRef;

exports.listSchedulesByStaff = function listSchedulesByStaff(dcOrVars, vars) {
  return executeQuery(listSchedulesByStaffRef(dcOrVars, vars));
};

const listVisitRecordsByClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisitRecordsByClient', inputVars);
}
listVisitRecordsByClientRef.operationName = 'ListVisitRecordsByClient';
exports.listVisitRecordsByClientRef = listVisitRecordsByClientRef;

exports.listVisitRecordsByClient = function listVisitRecordsByClient(dcOrVars, vars) {
  return executeQuery(listVisitRecordsByClientRef(dcOrVars, vars));
};

const listVisitRecordsByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisitRecordsByDateRange', inputVars);
}
listVisitRecordsByDateRangeRef.operationName = 'ListVisitRecordsByDateRange';
exports.listVisitRecordsByDateRangeRef = listVisitRecordsByDateRangeRef;

exports.listVisitRecordsByDateRange = function listVisitRecordsByDateRange(dcOrVars, vars) {
  return executeQuery(listVisitRecordsByDateRangeRef(dcOrVars, vars));
};

const getVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVisitRecord', inputVars);
}
getVisitRecordRef.operationName = 'GetVisitRecord';
exports.getVisitRecordRef = getVisitRecordRef;

exports.getVisitRecord = function getVisitRecord(dcOrVars, vars) {
  return executeQuery(getVisitRecordRef(dcOrVars, vars));
};

const listReportsByClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReportsByClient', inputVars);
}
listReportsByClientRef.operationName = 'ListReportsByClient';
exports.listReportsByClientRef = listReportsByClientRef;

exports.listReportsByClient = function listReportsByClient(dcOrVars, vars) {
  return executeQuery(listReportsByClientRef(dcOrVars, vars));
};

const listReportsByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReportsByFacility', inputVars);
}
listReportsByFacilityRef.operationName = 'ListReportsByFacility';
exports.listReportsByFacilityRef = listReportsByFacilityRef;

exports.listReportsByFacility = function listReportsByFacility(dcOrVars, vars) {
  return executeQuery(listReportsByFacilityRef(dcOrVars, vars));
};

const getReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetReport', inputVars);
}
getReportRef.operationName = 'GetReport';
exports.getReportRef = getReportRef;

exports.getReport = function getReport(dcOrVars, vars) {
  return executeQuery(getReportRef(dcOrVars, vars));
};

const listCarePlansByClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCarePlansByClient', inputVars);
}
listCarePlansByClientRef.operationName = 'ListCarePlansByClient';
exports.listCarePlansByClientRef = listCarePlansByClientRef;

exports.listCarePlansByClient = function listCarePlansByClient(dcOrVars, vars) {
  return executeQuery(listCarePlansByClientRef(dcOrVars, vars));
};

const listCarePlansByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCarePlansByFacility', inputVars);
}
listCarePlansByFacilityRef.operationName = 'ListCarePlansByFacility';
exports.listCarePlansByFacilityRef = listCarePlansByFacilityRef;

exports.listCarePlansByFacility = function listCarePlansByFacility(dcOrVars, vars) {
  return executeQuery(listCarePlansByFacilityRef(dcOrVars, vars));
};

const getCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCarePlan', inputVars);
}
getCarePlanRef.operationName = 'GetCarePlan';
exports.getCarePlanRef = getCarePlanRef;

exports.getCarePlan = function getCarePlan(dcOrVars, vars) {
  return executeQuery(getCarePlanRef(dcOrVars, vars));
};

const listGoalTemplatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListGoalTemplates');
}
listGoalTemplatesRef.operationName = 'ListGoalTemplates';
exports.listGoalTemplatesRef = listGoalTemplatesRef;

exports.listGoalTemplates = function listGoalTemplates(dc) {
  return executeQuery(listGoalTemplatesRef(dc));
};

const demoListCareLevelsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListCareLevels');
}
demoListCareLevelsRef.operationName = 'DemoListCareLevels';
exports.demoListCareLevelsRef = demoListCareLevelsRef;

exports.demoListCareLevels = function demoListCareLevels(dc) {
  return executeQuery(demoListCareLevelsRef(dc));
};

const demoListVisitReasonsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListVisitReasons');
}
demoListVisitReasonsRef.operationName = 'DemoListVisitReasons';
exports.demoListVisitReasonsRef = demoListVisitReasonsRef;

exports.demoListVisitReasons = function demoListVisitReasons(dc) {
  return executeQuery(demoListVisitReasonsRef(dc));
};

const demoListServiceTypesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListServiceTypes', inputVars);
}
demoListServiceTypesRef.operationName = 'DemoListServiceTypes';
exports.demoListServiceTypesRef = demoListServiceTypesRef;

exports.demoListServiceTypes = function demoListServiceTypes(dcOrVars, vars) {
  return executeQuery(demoListServiceTypesRef(dcOrVars, vars));
};

const demoListServiceItemsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListServiceItems', inputVars);
}
demoListServiceItemsRef.operationName = 'DemoListServiceItems';
exports.demoListServiceItemsRef = demoListServiceItemsRef;

exports.demoListServiceItems = function demoListServiceItems(dcOrVars, vars) {
  return executeQuery(demoListServiceItemsRef(dcOrVars, vars));
};

const demoListStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListStaff', inputVars);
}
demoListStaffRef.operationName = 'DemoListStaff';
exports.demoListStaffRef = demoListStaffRef;

exports.demoListStaff = function demoListStaff(dcOrVars, vars) {
  return executeQuery(demoListStaffRef(dcOrVars, vars));
};

const demoListClientsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListClients', inputVars);
}
demoListClientsRef.operationName = 'DemoListClients';
exports.demoListClientsRef = demoListClientsRef;

exports.demoListClients = function demoListClients(dcOrVars, vars) {
  return executeQuery(demoListClientsRef(dcOrVars, vars));
};

const demoGetClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetClient', inputVars);
}
demoGetClientRef.operationName = 'DemoGetClient';
exports.demoGetClientRef = demoGetClientRef;

exports.demoGetClient = function demoGetClient(dcOrVars, vars) {
  return executeQuery(demoGetClientRef(dcOrVars, vars));
};

const demoListSchedulesByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListSchedulesByDateRange', inputVars);
}
demoListSchedulesByDateRangeRef.operationName = 'DemoListSchedulesByDateRange';
exports.demoListSchedulesByDateRangeRef = demoListSchedulesByDateRangeRef;

exports.demoListSchedulesByDateRange = function demoListSchedulesByDateRange(dcOrVars, vars) {
  return executeQuery(demoListSchedulesByDateRangeRef(dcOrVars, vars));
};

const demoGetSchedulesByRecurrenceIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetSchedulesByRecurrenceId', inputVars);
}
demoGetSchedulesByRecurrenceIdRef.operationName = 'DemoGetSchedulesByRecurrenceId';
exports.demoGetSchedulesByRecurrenceIdRef = demoGetSchedulesByRecurrenceIdRef;

exports.demoGetSchedulesByRecurrenceId = function demoGetSchedulesByRecurrenceId(dcOrVars, vars) {
  return executeQuery(demoGetSchedulesByRecurrenceIdRef(dcOrVars, vars));
};

const demoListVisitRecordsByDateRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListVisitRecordsByDateRange', inputVars);
}
demoListVisitRecordsByDateRangeRef.operationName = 'DemoListVisitRecordsByDateRange';
exports.demoListVisitRecordsByDateRangeRef = demoListVisitRecordsByDateRangeRef;

exports.demoListVisitRecordsByDateRange = function demoListVisitRecordsByDateRange(dcOrVars, vars) {
  return executeQuery(demoListVisitRecordsByDateRangeRef(dcOrVars, vars));
};

const demoGetVisitRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetVisitRecord', inputVars);
}
demoGetVisitRecordRef.operationName = 'DemoGetVisitRecord';
exports.demoGetVisitRecordRef = demoGetVisitRecordRef;

exports.demoGetVisitRecord = function demoGetVisitRecord(dcOrVars, vars) {
  return executeQuery(demoGetVisitRecordRef(dcOrVars, vars));
};

const demoListReportsByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListReportsByFacility', inputVars);
}
demoListReportsByFacilityRef.operationName = 'DemoListReportsByFacility';
exports.demoListReportsByFacilityRef = demoListReportsByFacilityRef;

exports.demoListReportsByFacility = function demoListReportsByFacility(dcOrVars, vars) {
  return executeQuery(demoListReportsByFacilityRef(dcOrVars, vars));
};

const demoListCarePlansByFacilityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoListCarePlansByFacility', inputVars);
}
demoListCarePlansByFacilityRef.operationName = 'DemoListCarePlansByFacility';
exports.demoListCarePlansByFacilityRef = demoListCarePlansByFacilityRef;

exports.demoListCarePlansByFacility = function demoListCarePlansByFacility(dcOrVars, vars) {
  return executeQuery(demoListCarePlansByFacilityRef(dcOrVars, vars));
};

const demoGetCarePlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetCarePlan', inputVars);
}
demoGetCarePlanRef.operationName = 'DemoGetCarePlan';
exports.demoGetCarePlanRef = demoGetCarePlanRef;

exports.demoGetCarePlan = function demoGetCarePlan(dcOrVars, vars) {
  return executeQuery(demoGetCarePlanRef(dcOrVars, vars));
};

const demoGetReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DemoGetReport', inputVars);
}
demoGetReportRef.operationName = 'DemoGetReport';
exports.demoGetReportRef = demoGetReportRef;

exports.demoGetReport = function demoGetReport(dcOrVars, vars) {
  return executeQuery(demoGetReportRef(dcOrVars, vars));
};
