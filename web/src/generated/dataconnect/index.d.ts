import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CancelScheduleData {
  schedule_update?: Schedule_Key | null;
}

export interface CancelScheduleVariables {
  id: UUIDString;
}

export interface CareLevel_Key {
  id: UUIDString;
  __typename?: 'CareLevel_Key';
}

export interface CarePlan_Key {
  id: UUIDString;
  __typename?: 'CarePlan_Key';
}

export interface Client_Key {
  id: UUIDString;
  __typename?: 'Client_Key';
}

export interface CompleteScheduleData {
  schedule_update?: Schedule_Key | null;
}

export interface CompleteScheduleVariables {
  id: UUIDString;
}

export interface CreateCarePlanData {
  carePlan_insert: CarePlan_Key;
}

export interface CreateCarePlanVariables {
  clientId: UUIDString;
  staffId: UUIDString;
  currentSituation?: string | null;
  familyWishes?: string | null;
  mainSupport?: string | null;
  longTermGoals?: unknown | null;
  shortTermGoals?: unknown | null;
}

export interface CreateClientData {
  client_insert: Client_Key;
}

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

export interface CreateFacilityData {
  facility_insert: Facility_Key;
}

export interface CreateFacilityVariables {
  name: string;
  address?: string | null;
  phone?: string | null;
}

export interface CreateReportData {
  report_insert: Report_Key;
}

export interface CreateReportVariables {
  clientId: UUIDString;
  staffId: UUIDString;
  targetYear: number;
  targetMonth: number;
  summary?: string | null;
  aiGenerated?: boolean | null;
}

export interface CreateScheduleData {
  schedule_insert: Schedule_Key;
}

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

export interface CreateServiceItemData {
  serviceItem_insert: ServiceItem_Key;
}

export interface CreateServiceItemVariables {
  serviceTypeId: UUIDString;
  name: string;
  sortOrder?: number | null;
}

export interface CreateServiceTypeData {
  serviceType_insert: ServiceType_Key;
}

export interface CreateServiceTypeVariables {
  facilityId: UUIDString;
  code?: string | null;
  name: string;
  category: string;
  color?: string | null;
  sortOrder?: number | null;
}

export interface CreateStaffData {
  staff_insert: Staff_Key;
}

export interface CreateStaffVariables {
  facilityId: UUIDString;
  firebaseUid?: string | null;
  name: string;
  email?: string | null;
  role?: string | null;
}

export interface CreateVisitRecordData {
  visitRecord_insert: VisitRecord_Key;
}

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

export interface DeleteCarePlanData {
  carePlan_delete?: CarePlan_Key | null;
}

export interface DeleteCarePlanVariables {
  id: UUIDString;
}

export interface DeleteClientData {
  client_update?: Client_Key | null;
}

export interface DeleteClientVariables {
  id: UUIDString;
}

export interface DeleteScheduleData {
  schedule_delete?: Schedule_Key | null;
}

export interface DeleteScheduleVariables {
  id: UUIDString;
}

export interface DeleteVisitRecordData {
  visitRecord_delete?: VisitRecord_Key | null;
}

export interface DeleteVisitRecordVariables {
  id: UUIDString;
}

export interface DemoCreateClientData {
  client_insert: Client_Key;
}

export interface DemoCreateClientVariables {
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
  notes?: string | null;
}

export interface DemoCreateScheduleData {
  schedule_insert: Schedule_Key;
}

export interface DemoCreateScheduleVariables {
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

export interface DemoCreateVisitRecordData {
  visitRecord_insert: VisitRecord_Key;
}

export interface DemoCreateVisitRecordVariables {
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
}

export interface DemoDeleteClientData {
  client_update?: Client_Key | null;
}

export interface DemoDeleteClientVariables {
  id: UUIDString;
}

export interface DemoDeleteScheduleData {
  schedule_delete?: Schedule_Key | null;
}

export interface DemoDeleteScheduleVariables {
  id: UUIDString;
}

export interface DemoDeleteVisitRecordData {
  visitRecord_delete?: VisitRecord_Key | null;
}

export interface DemoDeleteVisitRecordVariables {
  id: UUIDString;
}

export interface DemoGetCarePlanData {
  carePlan?: {
    id: UUIDString;
    currentSituation?: string | null;
    familyWishes?: string | null;
    mainSupport?: string | null;
    longTermGoals?: unknown | null;
    shortTermGoals?: unknown | null;
    pdfUrl?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
      careLevel?: {
        name: string;
      };
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
  } & CarePlan_Key;
}

export interface DemoGetCarePlanVariables {
  id: UUIDString;
}

export interface DemoGetClientData {
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

export interface DemoGetClientVariables {
  id: UUIDString;
}

export interface DemoGetReportData {
  report?: {
    id: UUIDString;
    targetYear: number;
    targetMonth: number;
    summary?: string | null;
    aiGenerated?: boolean | null;
    pdfGenerated?: boolean | null;
    pdfUrl?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
      careLevel?: {
        name: string;
      };
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
  } & Report_Key;
}

export interface DemoGetReportVariables {
  id: UUIDString;
}

export interface DemoGetSchedulesByRecurrenceIdData {
  schedules: ({
    id: UUIDString;
    scheduledDate: DateString;
    startTime: string;
    endTime: string;
    status?: string | null;
    notes?: string | null;
    recurrenceRule?: string | null;
    recurrenceId?: UUIDString | null;
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

export interface DemoGetSchedulesByRecurrenceIdVariables {
  recurrenceId: UUIDString;
}

export interface DemoGetVisitRecordData {
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

export interface DemoGetVisitRecordVariables {
  id: UUIDString;
}

export interface DemoListCareLevelsData {
  careLevels: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & CareLevel_Key)[];
}

export interface DemoListCarePlansByFacilityData {
  carePlans: ({
    id: UUIDString;
    currentSituation?: string | null;
    familyWishes?: string | null;
    mainSupport?: string | null;
    longTermGoals?: unknown | null;
    shortTermGoals?: unknown | null;
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
  } & CarePlan_Key)[];
}

export interface DemoListCarePlansByFacilityVariables {
  facilityId: UUIDString;
}

export interface DemoListClientsData {
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

export interface DemoListClientsVariables {
  facilityId: UUIDString;
}

export interface DemoListReportsByFacilityData {
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

export interface DemoListReportsByFacilityVariables {
  facilityId: UUIDString;
}

export interface DemoListSchedulesByDateRangeData {
  schedules: ({
    id: UUIDString;
    scheduledDate: DateString;
    startTime: string;
    endTime: string;
    status?: string | null;
    notes?: string | null;
    recurrenceRule?: string | null;
    recurrenceId?: UUIDString | null;
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

export interface DemoListSchedulesByDateRangeVariables {
  facilityId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}

export interface DemoListServiceItemsData {
  serviceItems: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & ServiceItem_Key)[];
}

export interface DemoListServiceItemsVariables {
  serviceTypeId: UUIDString;
}

export interface DemoListServiceTypesData {
  serviceTypes: ({
    id: UUIDString;
    code?: string | null;
    name: string;
    category: string;
    color?: string | null;
    sortOrder?: number | null;
  } & ServiceType_Key)[];
}

export interface DemoListServiceTypesVariables {
  facilityId: UUIDString;
}

export interface DemoListStaffData {
  staffs: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    role?: string | null;
  } & Staff_Key)[];
}

export interface DemoListStaffVariables {
  facilityId: UUIDString;
}

export interface DemoListVisitReasonsData {
  visitReasons: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & VisitReason_Key)[];
}

export interface DemoListVisitRecordsByDateRangeData {
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

export interface DemoListVisitRecordsByDateRangeVariables {
  facilityId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}

export interface DemoUpdateClientData {
  client_update?: Client_Key | null;
}

export interface DemoUpdateClientVariables {
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
  notes?: string | null;
}

export interface DemoUpdateScheduleData {
  schedule_update?: Schedule_Key | null;
}

export interface DemoUpdateScheduleVariables {
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

export interface DemoUpdateVisitRecordData {
  visitRecord_update?: VisitRecord_Key | null;
}

export interface DemoUpdateVisitRecordVariables {
  id: UUIDString;
  vitals?: unknown | null;
  services?: unknown | null;
  notes?: string | null;
}

export interface Facility_Key {
  id: UUIDString;
  __typename?: 'Facility_Key';
}

export interface GetCarePlanData {
  carePlan?: {
    id: UUIDString;
    currentSituation?: string | null;
    familyWishes?: string | null;
    mainSupport?: string | null;
    longTermGoals?: unknown | null;
    shortTermGoals?: unknown | null;
    pdfUrl?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
      careLevel?: {
        name: string;
      };
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
  } & CarePlan_Key;
}

export interface GetCarePlanVariables {
  id: UUIDString;
}

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

export interface GetClientVariables {
  id: UUIDString;
}

export interface GetReportData {
  report?: {
    id: UUIDString;
    targetYear: number;
    targetMonth: number;
    summary?: string | null;
    aiGenerated?: boolean | null;
    pdfGenerated?: boolean | null;
    pdfUrl?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
      careLevel?: {
        name: string;
      };
    } & Client_Key;
      staff: {
        id: UUIDString;
        name: string;
      } & Staff_Key;
  } & Report_Key;
}

export interface GetReportVariables {
  id: UUIDString;
}

export interface GetSchedulesByRecurrenceIdData {
  schedules: ({
    id: UUIDString;
    scheduledDate: DateString;
    startTime: string;
    endTime: string;
    status?: string | null;
    notes?: string | null;
    recurrenceRule?: string | null;
    recurrenceId?: UUIDString | null;
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

export interface GetSchedulesByRecurrenceIdVariables {
  recurrenceId: UUIDString;
}

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

export interface GetStaffByFirebaseUidVariables {
  uid: string;
}

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

export interface GetVisitRecordVariables {
  id: UUIDString;
}

export interface GoalTemplate_Key {
  id: UUIDString;
  __typename?: 'GoalTemplate_Key';
}

export interface ListCareLevelsData {
  careLevels: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & CareLevel_Key)[];
}

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

export interface ListCarePlansByClientVariables {
  clientId: UUIDString;
}

export interface ListCarePlansByFacilityData {
  carePlans: ({
    id: UUIDString;
    currentSituation?: string | null;
    familyWishes?: string | null;
    mainSupport?: string | null;
    longTermGoals?: unknown | null;
    shortTermGoals?: unknown | null;
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
  } & CarePlan_Key)[];
}

export interface ListCarePlansByFacilityVariables {
  facilityId: UUIDString;
}

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

export interface ListClientsVariables {
  facilityId: UUIDString;
}

export interface ListGoalTemplatesData {
  goalTemplates: ({
    id: UUIDString;
    supportType: string;
    goalType: string;
    content: string;
    sortOrder?: number | null;
  } & GoalTemplate_Key)[];
}

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

export interface ListReportsByClientVariables {
  clientId: UUIDString;
}

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

export interface ListReportsByFacilityVariables {
  facilityId: UUIDString;
}

export interface ListSchedulesByDateRangeData {
  schedules: ({
    id: UUIDString;
    scheduledDate: DateString;
    startTime: string;
    endTime: string;
    status?: string | null;
    notes?: string | null;
    recurrenceRule?: string | null;
    recurrenceId?: UUIDString | null;
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

export interface ListSchedulesByDateRangeVariables {
  facilityId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}

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

export interface ListSchedulesByStaffVariables {
  staffId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}

export interface ListServiceItemsData {
  serviceItems: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & ServiceItem_Key)[];
}

export interface ListServiceItemsVariables {
  serviceTypeId: UUIDString;
}

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

export interface ListServiceTypesVariables {
  facilityId: UUIDString;
}

export interface ListStaffData {
  staffs: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    role?: string | null;
  } & Staff_Key)[];
}

export interface ListStaffVariables {
  facilityId: UUIDString;
}

export interface ListVisitReasonsData {
  visitReasons: ({
    id: UUIDString;
    name: string;
    sortOrder?: number | null;
  } & VisitReason_Key)[];
}

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

export interface ListVisitRecordsByClientVariables {
  clientId: UUIDString;
  limit?: number | null;
}

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

export interface ListVisitRecordsByDateRangeVariables {
  facilityId: UUIDString;
  startDate: DateString;
  endDate: DateString;
}

export interface Prompt_Key {
  id: UUIDString;
  __typename?: 'Prompt_Key';
}

export interface Report_Key {
  id: UUIDString;
  __typename?: 'Report_Key';
}

export interface Schedule_Key {
  id: UUIDString;
  __typename?: 'Schedule_Key';
}

export interface SeedCareLevelData {
  careLevel_insert: CareLevel_Key;
}

export interface SeedCareLevelVariables {
  name: string;
  sortOrder: number;
}

export interface SeedVisitReasonData {
  visitReason_insert: VisitReason_Key;
}

export interface SeedVisitReasonVariables {
  name: string;
  sortOrder: number;
}

export interface ServiceItem_Key {
  id: UUIDString;
  __typename?: 'ServiceItem_Key';
}

export interface ServiceType_Key {
  id: UUIDString;
  __typename?: 'ServiceType_Key';
}

export interface Staff_Key {
  id: UUIDString;
  __typename?: 'Staff_Key';
}

export interface UpdateCarePlanData {
  carePlan_update?: CarePlan_Key | null;
}

export interface UpdateCarePlanVariables {
  id: UUIDString;
  currentSituation?: string | null;
  familyWishes?: string | null;
  mainSupport?: string | null;
  longTermGoals?: unknown | null;
  shortTermGoals?: unknown | null;
  pdfUrl?: string | null;
}

export interface UpdateClientData {
  client_update?: Client_Key | null;
}

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

export interface UpdateReportPdfData {
  report_update?: Report_Key | null;
}

export interface UpdateReportPdfVariables {
  id: UUIDString;
  pdfUrl: string;
}

export interface UpdateScheduleData {
  schedule_update?: Schedule_Key | null;
}

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

export interface UpdateVisitRecordData {
  visitRecord_update?: VisitRecord_Key | null;
}

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

export interface VisitReason_Key {
  id: UUIDString;
  __typename?: 'VisitReason_Key';
}

export interface VisitRecord_Key {
  id: UUIDString;
  __typename?: 'VisitRecord_Key';
}

interface CreateClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
  operationName: string;
}
export const createClientRef: CreateClientRef;

export function createClient(vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;
export function createClient(dc: DataConnect, vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface UpdateClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
  operationName: string;
}
export const updateClientRef: UpdateClientRef;

export function updateClient(vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;
export function updateClient(dc: DataConnect, vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;

interface DeleteClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteClientVariables): MutationRef<DeleteClientData, DeleteClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteClientVariables): MutationRef<DeleteClientData, DeleteClientVariables>;
  operationName: string;
}
export const deleteClientRef: DeleteClientRef;

export function deleteClient(vars: DeleteClientVariables): MutationPromise<DeleteClientData, DeleteClientVariables>;
export function deleteClient(dc: DataConnect, vars: DeleteClientVariables): MutationPromise<DeleteClientData, DeleteClientVariables>;

interface CreateScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateScheduleVariables): MutationRef<CreateScheduleData, CreateScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateScheduleVariables): MutationRef<CreateScheduleData, CreateScheduleVariables>;
  operationName: string;
}
export const createScheduleRef: CreateScheduleRef;

export function createSchedule(vars: CreateScheduleVariables): MutationPromise<CreateScheduleData, CreateScheduleVariables>;
export function createSchedule(dc: DataConnect, vars: CreateScheduleVariables): MutationPromise<CreateScheduleData, CreateScheduleVariables>;

interface UpdateScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateScheduleVariables): MutationRef<UpdateScheduleData, UpdateScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateScheduleVariables): MutationRef<UpdateScheduleData, UpdateScheduleVariables>;
  operationName: string;
}
export const updateScheduleRef: UpdateScheduleRef;

export function updateSchedule(vars: UpdateScheduleVariables): MutationPromise<UpdateScheduleData, UpdateScheduleVariables>;
export function updateSchedule(dc: DataConnect, vars: UpdateScheduleVariables): MutationPromise<UpdateScheduleData, UpdateScheduleVariables>;

interface DeleteScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
  operationName: string;
}
export const deleteScheduleRef: DeleteScheduleRef;

export function deleteSchedule(vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;
export function deleteSchedule(dc: DataConnect, vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;

interface CancelScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelScheduleVariables): MutationRef<CancelScheduleData, CancelScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CancelScheduleVariables): MutationRef<CancelScheduleData, CancelScheduleVariables>;
  operationName: string;
}
export const cancelScheduleRef: CancelScheduleRef;

export function cancelSchedule(vars: CancelScheduleVariables): MutationPromise<CancelScheduleData, CancelScheduleVariables>;
export function cancelSchedule(dc: DataConnect, vars: CancelScheduleVariables): MutationPromise<CancelScheduleData, CancelScheduleVariables>;

interface CompleteScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteScheduleVariables): MutationRef<CompleteScheduleData, CompleteScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CompleteScheduleVariables): MutationRef<CompleteScheduleData, CompleteScheduleVariables>;
  operationName: string;
}
export const completeScheduleRef: CompleteScheduleRef;

export function completeSchedule(vars: CompleteScheduleVariables): MutationPromise<CompleteScheduleData, CompleteScheduleVariables>;
export function completeSchedule(dc: DataConnect, vars: CompleteScheduleVariables): MutationPromise<CompleteScheduleData, CompleteScheduleVariables>;

interface CreateVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVisitRecordVariables): MutationRef<CreateVisitRecordData, CreateVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateVisitRecordVariables): MutationRef<CreateVisitRecordData, CreateVisitRecordVariables>;
  operationName: string;
}
export const createVisitRecordRef: CreateVisitRecordRef;

export function createVisitRecord(vars: CreateVisitRecordVariables): MutationPromise<CreateVisitRecordData, CreateVisitRecordVariables>;
export function createVisitRecord(dc: DataConnect, vars: CreateVisitRecordVariables): MutationPromise<CreateVisitRecordData, CreateVisitRecordVariables>;

interface UpdateVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVisitRecordVariables): MutationRef<UpdateVisitRecordData, UpdateVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateVisitRecordVariables): MutationRef<UpdateVisitRecordData, UpdateVisitRecordVariables>;
  operationName: string;
}
export const updateVisitRecordRef: UpdateVisitRecordRef;

export function updateVisitRecord(vars: UpdateVisitRecordVariables): MutationPromise<UpdateVisitRecordData, UpdateVisitRecordVariables>;
export function updateVisitRecord(dc: DataConnect, vars: UpdateVisitRecordVariables): MutationPromise<UpdateVisitRecordData, UpdateVisitRecordVariables>;

interface DeleteVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVisitRecordVariables): MutationRef<DeleteVisitRecordData, DeleteVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteVisitRecordVariables): MutationRef<DeleteVisitRecordData, DeleteVisitRecordVariables>;
  operationName: string;
}
export const deleteVisitRecordRef: DeleteVisitRecordRef;

export function deleteVisitRecord(vars: DeleteVisitRecordVariables): MutationPromise<DeleteVisitRecordData, DeleteVisitRecordVariables>;
export function deleteVisitRecord(dc: DataConnect, vars: DeleteVisitRecordVariables): MutationPromise<DeleteVisitRecordData, DeleteVisitRecordVariables>;

interface CreateReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReportVariables): MutationRef<CreateReportData, CreateReportVariables>;
  operationName: string;
}
export const createReportRef: CreateReportRef;

export function createReport(vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;
export function createReport(dc: DataConnect, vars: CreateReportVariables): MutationPromise<CreateReportData, CreateReportVariables>;

interface UpdateReportPdfRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReportPdfVariables): MutationRef<UpdateReportPdfData, UpdateReportPdfVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReportPdfVariables): MutationRef<UpdateReportPdfData, UpdateReportPdfVariables>;
  operationName: string;
}
export const updateReportPdfRef: UpdateReportPdfRef;

export function updateReportPdf(vars: UpdateReportPdfVariables): MutationPromise<UpdateReportPdfData, UpdateReportPdfVariables>;
export function updateReportPdf(dc: DataConnect, vars: UpdateReportPdfVariables): MutationPromise<UpdateReportPdfData, UpdateReportPdfVariables>;

interface CreateCarePlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCarePlanVariables): MutationRef<CreateCarePlanData, CreateCarePlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCarePlanVariables): MutationRef<CreateCarePlanData, CreateCarePlanVariables>;
  operationName: string;
}
export const createCarePlanRef: CreateCarePlanRef;

export function createCarePlan(vars: CreateCarePlanVariables): MutationPromise<CreateCarePlanData, CreateCarePlanVariables>;
export function createCarePlan(dc: DataConnect, vars: CreateCarePlanVariables): MutationPromise<CreateCarePlanData, CreateCarePlanVariables>;

interface UpdateCarePlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCarePlanVariables): MutationRef<UpdateCarePlanData, UpdateCarePlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCarePlanVariables): MutationRef<UpdateCarePlanData, UpdateCarePlanVariables>;
  operationName: string;
}
export const updateCarePlanRef: UpdateCarePlanRef;

export function updateCarePlan(vars: UpdateCarePlanVariables): MutationPromise<UpdateCarePlanData, UpdateCarePlanVariables>;
export function updateCarePlan(dc: DataConnect, vars: UpdateCarePlanVariables): MutationPromise<UpdateCarePlanData, UpdateCarePlanVariables>;

interface DeleteCarePlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCarePlanVariables): MutationRef<DeleteCarePlanData, DeleteCarePlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCarePlanVariables): MutationRef<DeleteCarePlanData, DeleteCarePlanVariables>;
  operationName: string;
}
export const deleteCarePlanRef: DeleteCarePlanRef;

export function deleteCarePlan(vars: DeleteCarePlanVariables): MutationPromise<DeleteCarePlanData, DeleteCarePlanVariables>;
export function deleteCarePlan(dc: DataConnect, vars: DeleteCarePlanVariables): MutationPromise<DeleteCarePlanData, DeleteCarePlanVariables>;

interface SeedCareLevelRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SeedCareLevelVariables): MutationRef<SeedCareLevelData, SeedCareLevelVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SeedCareLevelVariables): MutationRef<SeedCareLevelData, SeedCareLevelVariables>;
  operationName: string;
}
export const seedCareLevelRef: SeedCareLevelRef;

export function seedCareLevel(vars: SeedCareLevelVariables): MutationPromise<SeedCareLevelData, SeedCareLevelVariables>;
export function seedCareLevel(dc: DataConnect, vars: SeedCareLevelVariables): MutationPromise<SeedCareLevelData, SeedCareLevelVariables>;

interface SeedVisitReasonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SeedVisitReasonVariables): MutationRef<SeedVisitReasonData, SeedVisitReasonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SeedVisitReasonVariables): MutationRef<SeedVisitReasonData, SeedVisitReasonVariables>;
  operationName: string;
}
export const seedVisitReasonRef: SeedVisitReasonRef;

export function seedVisitReason(vars: SeedVisitReasonVariables): MutationPromise<SeedVisitReasonData, SeedVisitReasonVariables>;
export function seedVisitReason(dc: DataConnect, vars: SeedVisitReasonVariables): MutationPromise<SeedVisitReasonData, SeedVisitReasonVariables>;

interface CreateFacilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFacilityVariables): MutationRef<CreateFacilityData, CreateFacilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFacilityVariables): MutationRef<CreateFacilityData, CreateFacilityVariables>;
  operationName: string;
}
export const createFacilityRef: CreateFacilityRef;

export function createFacility(vars: CreateFacilityVariables): MutationPromise<CreateFacilityData, CreateFacilityVariables>;
export function createFacility(dc: DataConnect, vars: CreateFacilityVariables): MutationPromise<CreateFacilityData, CreateFacilityVariables>;

interface CreateStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
  operationName: string;
}
export const createStaffRef: CreateStaffRef;

export function createStaff(vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;
export function createStaff(dc: DataConnect, vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;

interface CreateServiceTypeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceTypeVariables): MutationRef<CreateServiceTypeData, CreateServiceTypeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceTypeVariables): MutationRef<CreateServiceTypeData, CreateServiceTypeVariables>;
  operationName: string;
}
export const createServiceTypeRef: CreateServiceTypeRef;

export function createServiceType(vars: CreateServiceTypeVariables): MutationPromise<CreateServiceTypeData, CreateServiceTypeVariables>;
export function createServiceType(dc: DataConnect, vars: CreateServiceTypeVariables): MutationPromise<CreateServiceTypeData, CreateServiceTypeVariables>;

interface CreateServiceItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceItemVariables): MutationRef<CreateServiceItemData, CreateServiceItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceItemVariables): MutationRef<CreateServiceItemData, CreateServiceItemVariables>;
  operationName: string;
}
export const createServiceItemRef: CreateServiceItemRef;

export function createServiceItem(vars: CreateServiceItemVariables): MutationPromise<CreateServiceItemData, CreateServiceItemVariables>;
export function createServiceItem(dc: DataConnect, vars: CreateServiceItemVariables): MutationPromise<CreateServiceItemData, CreateServiceItemVariables>;

interface DemoCreateVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoCreateVisitRecordVariables): MutationRef<DemoCreateVisitRecordData, DemoCreateVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoCreateVisitRecordVariables): MutationRef<DemoCreateVisitRecordData, DemoCreateVisitRecordVariables>;
  operationName: string;
}
export const demoCreateVisitRecordRef: DemoCreateVisitRecordRef;

export function demoCreateVisitRecord(vars: DemoCreateVisitRecordVariables): MutationPromise<DemoCreateVisitRecordData, DemoCreateVisitRecordVariables>;
export function demoCreateVisitRecord(dc: DataConnect, vars: DemoCreateVisitRecordVariables): MutationPromise<DemoCreateVisitRecordData, DemoCreateVisitRecordVariables>;

interface DemoUpdateVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoUpdateVisitRecordVariables): MutationRef<DemoUpdateVisitRecordData, DemoUpdateVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoUpdateVisitRecordVariables): MutationRef<DemoUpdateVisitRecordData, DemoUpdateVisitRecordVariables>;
  operationName: string;
}
export const demoUpdateVisitRecordRef: DemoUpdateVisitRecordRef;

export function demoUpdateVisitRecord(vars: DemoUpdateVisitRecordVariables): MutationPromise<DemoUpdateVisitRecordData, DemoUpdateVisitRecordVariables>;
export function demoUpdateVisitRecord(dc: DataConnect, vars: DemoUpdateVisitRecordVariables): MutationPromise<DemoUpdateVisitRecordData, DemoUpdateVisitRecordVariables>;

interface DemoDeleteVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoDeleteVisitRecordVariables): MutationRef<DemoDeleteVisitRecordData, DemoDeleteVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoDeleteVisitRecordVariables): MutationRef<DemoDeleteVisitRecordData, DemoDeleteVisitRecordVariables>;
  operationName: string;
}
export const demoDeleteVisitRecordRef: DemoDeleteVisitRecordRef;

export function demoDeleteVisitRecord(vars: DemoDeleteVisitRecordVariables): MutationPromise<DemoDeleteVisitRecordData, DemoDeleteVisitRecordVariables>;
export function demoDeleteVisitRecord(dc: DataConnect, vars: DemoDeleteVisitRecordVariables): MutationPromise<DemoDeleteVisitRecordData, DemoDeleteVisitRecordVariables>;

interface DemoCreateScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoCreateScheduleVariables): MutationRef<DemoCreateScheduleData, DemoCreateScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoCreateScheduleVariables): MutationRef<DemoCreateScheduleData, DemoCreateScheduleVariables>;
  operationName: string;
}
export const demoCreateScheduleRef: DemoCreateScheduleRef;

export function demoCreateSchedule(vars: DemoCreateScheduleVariables): MutationPromise<DemoCreateScheduleData, DemoCreateScheduleVariables>;
export function demoCreateSchedule(dc: DataConnect, vars: DemoCreateScheduleVariables): MutationPromise<DemoCreateScheduleData, DemoCreateScheduleVariables>;

interface DemoUpdateScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoUpdateScheduleVariables): MutationRef<DemoUpdateScheduleData, DemoUpdateScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoUpdateScheduleVariables): MutationRef<DemoUpdateScheduleData, DemoUpdateScheduleVariables>;
  operationName: string;
}
export const demoUpdateScheduleRef: DemoUpdateScheduleRef;

export function demoUpdateSchedule(vars: DemoUpdateScheduleVariables): MutationPromise<DemoUpdateScheduleData, DemoUpdateScheduleVariables>;
export function demoUpdateSchedule(dc: DataConnect, vars: DemoUpdateScheduleVariables): MutationPromise<DemoUpdateScheduleData, DemoUpdateScheduleVariables>;

interface DemoDeleteScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoDeleteScheduleVariables): MutationRef<DemoDeleteScheduleData, DemoDeleteScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoDeleteScheduleVariables): MutationRef<DemoDeleteScheduleData, DemoDeleteScheduleVariables>;
  operationName: string;
}
export const demoDeleteScheduleRef: DemoDeleteScheduleRef;

export function demoDeleteSchedule(vars: DemoDeleteScheduleVariables): MutationPromise<DemoDeleteScheduleData, DemoDeleteScheduleVariables>;
export function demoDeleteSchedule(dc: DataConnect, vars: DemoDeleteScheduleVariables): MutationPromise<DemoDeleteScheduleData, DemoDeleteScheduleVariables>;

interface DemoCreateClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoCreateClientVariables): MutationRef<DemoCreateClientData, DemoCreateClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoCreateClientVariables): MutationRef<DemoCreateClientData, DemoCreateClientVariables>;
  operationName: string;
}
export const demoCreateClientRef: DemoCreateClientRef;

export function demoCreateClient(vars: DemoCreateClientVariables): MutationPromise<DemoCreateClientData, DemoCreateClientVariables>;
export function demoCreateClient(dc: DataConnect, vars: DemoCreateClientVariables): MutationPromise<DemoCreateClientData, DemoCreateClientVariables>;

interface DemoUpdateClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoUpdateClientVariables): MutationRef<DemoUpdateClientData, DemoUpdateClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoUpdateClientVariables): MutationRef<DemoUpdateClientData, DemoUpdateClientVariables>;
  operationName: string;
}
export const demoUpdateClientRef: DemoUpdateClientRef;

export function demoUpdateClient(vars: DemoUpdateClientVariables): MutationPromise<DemoUpdateClientData, DemoUpdateClientVariables>;
export function demoUpdateClient(dc: DataConnect, vars: DemoUpdateClientVariables): MutationPromise<DemoUpdateClientData, DemoUpdateClientVariables>;

interface DemoDeleteClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoDeleteClientVariables): MutationRef<DemoDeleteClientData, DemoDeleteClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoDeleteClientVariables): MutationRef<DemoDeleteClientData, DemoDeleteClientVariables>;
  operationName: string;
}
export const demoDeleteClientRef: DemoDeleteClientRef;

export function demoDeleteClient(vars: DemoDeleteClientVariables): MutationPromise<DemoDeleteClientData, DemoDeleteClientVariables>;
export function demoDeleteClient(dc: DataConnect, vars: DemoDeleteClientVariables): MutationPromise<DemoDeleteClientData, DemoDeleteClientVariables>;

interface ListCareLevelsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCareLevelsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCareLevelsData, undefined>;
  operationName: string;
}
export const listCareLevelsRef: ListCareLevelsRef;

export function listCareLevels(): QueryPromise<ListCareLevelsData, undefined>;
export function listCareLevels(dc: DataConnect): QueryPromise<ListCareLevelsData, undefined>;

interface ListVisitReasonsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVisitReasonsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListVisitReasonsData, undefined>;
  operationName: string;
}
export const listVisitReasonsRef: ListVisitReasonsRef;

export function listVisitReasons(): QueryPromise<ListVisitReasonsData, undefined>;
export function listVisitReasons(dc: DataConnect): QueryPromise<ListVisitReasonsData, undefined>;

interface ListServiceTypesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServiceTypesVariables): QueryRef<ListServiceTypesData, ListServiceTypesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListServiceTypesVariables): QueryRef<ListServiceTypesData, ListServiceTypesVariables>;
  operationName: string;
}
export const listServiceTypesRef: ListServiceTypesRef;

export function listServiceTypes(vars: ListServiceTypesVariables): QueryPromise<ListServiceTypesData, ListServiceTypesVariables>;
export function listServiceTypes(dc: DataConnect, vars: ListServiceTypesVariables): QueryPromise<ListServiceTypesData, ListServiceTypesVariables>;

interface ListServiceItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServiceItemsVariables): QueryRef<ListServiceItemsData, ListServiceItemsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListServiceItemsVariables): QueryRef<ListServiceItemsData, ListServiceItemsVariables>;
  operationName: string;
}
export const listServiceItemsRef: ListServiceItemsRef;

export function listServiceItems(vars: ListServiceItemsVariables): QueryPromise<ListServiceItemsData, ListServiceItemsVariables>;
export function listServiceItems(dc: DataConnect, vars: ListServiceItemsVariables): QueryPromise<ListServiceItemsData, ListServiceItemsVariables>;

interface GetStaffByFirebaseUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByFirebaseUidVariables): QueryRef<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffByFirebaseUidVariables): QueryRef<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;
  operationName: string;
}
export const getStaffByFirebaseUidRef: GetStaffByFirebaseUidRef;

export function getStaffByFirebaseUid(vars: GetStaffByFirebaseUidVariables): QueryPromise<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;
export function getStaffByFirebaseUid(dc: DataConnect, vars: GetStaffByFirebaseUidVariables): QueryPromise<GetStaffByFirebaseUidData, GetStaffByFirebaseUidVariables>;

interface ListStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStaffVariables): QueryRef<ListStaffData, ListStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListStaffVariables): QueryRef<ListStaffData, ListStaffVariables>;
  operationName: string;
}
export const listStaffRef: ListStaffRef;

export function listStaff(vars: ListStaffVariables): QueryPromise<ListStaffData, ListStaffVariables>;
export function listStaff(dc: DataConnect, vars: ListStaffVariables): QueryPromise<ListStaffData, ListStaffVariables>;

interface ListClientsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListClientsVariables): QueryRef<ListClientsData, ListClientsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListClientsVariables): QueryRef<ListClientsData, ListClientsVariables>;
  operationName: string;
}
export const listClientsRef: ListClientsRef;

export function listClients(vars: ListClientsVariables): QueryPromise<ListClientsData, ListClientsVariables>;
export function listClients(dc: DataConnect, vars: ListClientsVariables): QueryPromise<ListClientsData, ListClientsVariables>;

interface GetClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
  operationName: string;
}
export const getClientRef: GetClientRef;

export function getClient(vars: GetClientVariables): QueryPromise<GetClientData, GetClientVariables>;
export function getClient(dc: DataConnect, vars: GetClientVariables): QueryPromise<GetClientData, GetClientVariables>;

interface ListSchedulesByDateRangeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSchedulesByDateRangeVariables): QueryRef<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSchedulesByDateRangeVariables): QueryRef<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;
  operationName: string;
}
export const listSchedulesByDateRangeRef: ListSchedulesByDateRangeRef;

export function listSchedulesByDateRange(vars: ListSchedulesByDateRangeVariables): QueryPromise<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;
export function listSchedulesByDateRange(dc: DataConnect, vars: ListSchedulesByDateRangeVariables): QueryPromise<ListSchedulesByDateRangeData, ListSchedulesByDateRangeVariables>;

interface GetSchedulesByRecurrenceIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSchedulesByRecurrenceIdVariables): QueryRef<GetSchedulesByRecurrenceIdData, GetSchedulesByRecurrenceIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSchedulesByRecurrenceIdVariables): QueryRef<GetSchedulesByRecurrenceIdData, GetSchedulesByRecurrenceIdVariables>;
  operationName: string;
}
export const getSchedulesByRecurrenceIdRef: GetSchedulesByRecurrenceIdRef;

export function getSchedulesByRecurrenceId(vars: GetSchedulesByRecurrenceIdVariables): QueryPromise<GetSchedulesByRecurrenceIdData, GetSchedulesByRecurrenceIdVariables>;
export function getSchedulesByRecurrenceId(dc: DataConnect, vars: GetSchedulesByRecurrenceIdVariables): QueryPromise<GetSchedulesByRecurrenceIdData, GetSchedulesByRecurrenceIdVariables>;

interface ListSchedulesByStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSchedulesByStaffVariables): QueryRef<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSchedulesByStaffVariables): QueryRef<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;
  operationName: string;
}
export const listSchedulesByStaffRef: ListSchedulesByStaffRef;

export function listSchedulesByStaff(vars: ListSchedulesByStaffVariables): QueryPromise<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;
export function listSchedulesByStaff(dc: DataConnect, vars: ListSchedulesByStaffVariables): QueryPromise<ListSchedulesByStaffData, ListSchedulesByStaffVariables>;

interface ListVisitRecordsByClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVisitRecordsByClientVariables): QueryRef<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListVisitRecordsByClientVariables): QueryRef<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;
  operationName: string;
}
export const listVisitRecordsByClientRef: ListVisitRecordsByClientRef;

export function listVisitRecordsByClient(vars: ListVisitRecordsByClientVariables): QueryPromise<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;
export function listVisitRecordsByClient(dc: DataConnect, vars: ListVisitRecordsByClientVariables): QueryPromise<ListVisitRecordsByClientData, ListVisitRecordsByClientVariables>;

interface ListVisitRecordsByDateRangeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVisitRecordsByDateRangeVariables): QueryRef<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListVisitRecordsByDateRangeVariables): QueryRef<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;
  operationName: string;
}
export const listVisitRecordsByDateRangeRef: ListVisitRecordsByDateRangeRef;

export function listVisitRecordsByDateRange(vars: ListVisitRecordsByDateRangeVariables): QueryPromise<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;
export function listVisitRecordsByDateRange(dc: DataConnect, vars: ListVisitRecordsByDateRangeVariables): QueryPromise<ListVisitRecordsByDateRangeData, ListVisitRecordsByDateRangeVariables>;

interface GetVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVisitRecordVariables): QueryRef<GetVisitRecordData, GetVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVisitRecordVariables): QueryRef<GetVisitRecordData, GetVisitRecordVariables>;
  operationName: string;
}
export const getVisitRecordRef: GetVisitRecordRef;

export function getVisitRecord(vars: GetVisitRecordVariables): QueryPromise<GetVisitRecordData, GetVisitRecordVariables>;
export function getVisitRecord(dc: DataConnect, vars: GetVisitRecordVariables): QueryPromise<GetVisitRecordData, GetVisitRecordVariables>;

interface ListReportsByClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReportsByClientVariables): QueryRef<ListReportsByClientData, ListReportsByClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListReportsByClientVariables): QueryRef<ListReportsByClientData, ListReportsByClientVariables>;
  operationName: string;
}
export const listReportsByClientRef: ListReportsByClientRef;

export function listReportsByClient(vars: ListReportsByClientVariables): QueryPromise<ListReportsByClientData, ListReportsByClientVariables>;
export function listReportsByClient(dc: DataConnect, vars: ListReportsByClientVariables): QueryPromise<ListReportsByClientData, ListReportsByClientVariables>;

interface ListReportsByFacilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReportsByFacilityVariables): QueryRef<ListReportsByFacilityData, ListReportsByFacilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListReportsByFacilityVariables): QueryRef<ListReportsByFacilityData, ListReportsByFacilityVariables>;
  operationName: string;
}
export const listReportsByFacilityRef: ListReportsByFacilityRef;

export function listReportsByFacility(vars: ListReportsByFacilityVariables): QueryPromise<ListReportsByFacilityData, ListReportsByFacilityVariables>;
export function listReportsByFacility(dc: DataConnect, vars: ListReportsByFacilityVariables): QueryPromise<ListReportsByFacilityData, ListReportsByFacilityVariables>;

interface GetReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReportVariables): QueryRef<GetReportData, GetReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReportVariables): QueryRef<GetReportData, GetReportVariables>;
  operationName: string;
}
export const getReportRef: GetReportRef;

export function getReport(vars: GetReportVariables): QueryPromise<GetReportData, GetReportVariables>;
export function getReport(dc: DataConnect, vars: GetReportVariables): QueryPromise<GetReportData, GetReportVariables>;

interface ListCarePlansByClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCarePlansByClientVariables): QueryRef<ListCarePlansByClientData, ListCarePlansByClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCarePlansByClientVariables): QueryRef<ListCarePlansByClientData, ListCarePlansByClientVariables>;
  operationName: string;
}
export const listCarePlansByClientRef: ListCarePlansByClientRef;

export function listCarePlansByClient(vars: ListCarePlansByClientVariables): QueryPromise<ListCarePlansByClientData, ListCarePlansByClientVariables>;
export function listCarePlansByClient(dc: DataConnect, vars: ListCarePlansByClientVariables): QueryPromise<ListCarePlansByClientData, ListCarePlansByClientVariables>;

interface ListCarePlansByFacilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCarePlansByFacilityVariables): QueryRef<ListCarePlansByFacilityData, ListCarePlansByFacilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCarePlansByFacilityVariables): QueryRef<ListCarePlansByFacilityData, ListCarePlansByFacilityVariables>;
  operationName: string;
}
export const listCarePlansByFacilityRef: ListCarePlansByFacilityRef;

export function listCarePlansByFacility(vars: ListCarePlansByFacilityVariables): QueryPromise<ListCarePlansByFacilityData, ListCarePlansByFacilityVariables>;
export function listCarePlansByFacility(dc: DataConnect, vars: ListCarePlansByFacilityVariables): QueryPromise<ListCarePlansByFacilityData, ListCarePlansByFacilityVariables>;

interface GetCarePlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCarePlanVariables): QueryRef<GetCarePlanData, GetCarePlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCarePlanVariables): QueryRef<GetCarePlanData, GetCarePlanVariables>;
  operationName: string;
}
export const getCarePlanRef: GetCarePlanRef;

export function getCarePlan(vars: GetCarePlanVariables): QueryPromise<GetCarePlanData, GetCarePlanVariables>;
export function getCarePlan(dc: DataConnect, vars: GetCarePlanVariables): QueryPromise<GetCarePlanData, GetCarePlanVariables>;

interface ListGoalTemplatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListGoalTemplatesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListGoalTemplatesData, undefined>;
  operationName: string;
}
export const listGoalTemplatesRef: ListGoalTemplatesRef;

export function listGoalTemplates(): QueryPromise<ListGoalTemplatesData, undefined>;
export function listGoalTemplates(dc: DataConnect): QueryPromise<ListGoalTemplatesData, undefined>;

interface DemoListCareLevelsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<DemoListCareLevelsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<DemoListCareLevelsData, undefined>;
  operationName: string;
}
export const demoListCareLevelsRef: DemoListCareLevelsRef;

export function demoListCareLevels(): QueryPromise<DemoListCareLevelsData, undefined>;
export function demoListCareLevels(dc: DataConnect): QueryPromise<DemoListCareLevelsData, undefined>;

interface DemoListVisitReasonsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<DemoListVisitReasonsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<DemoListVisitReasonsData, undefined>;
  operationName: string;
}
export const demoListVisitReasonsRef: DemoListVisitReasonsRef;

export function demoListVisitReasons(): QueryPromise<DemoListVisitReasonsData, undefined>;
export function demoListVisitReasons(dc: DataConnect): QueryPromise<DemoListVisitReasonsData, undefined>;

interface DemoListServiceTypesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListServiceTypesVariables): QueryRef<DemoListServiceTypesData, DemoListServiceTypesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListServiceTypesVariables): QueryRef<DemoListServiceTypesData, DemoListServiceTypesVariables>;
  operationName: string;
}
export const demoListServiceTypesRef: DemoListServiceTypesRef;

export function demoListServiceTypes(vars: DemoListServiceTypesVariables): QueryPromise<DemoListServiceTypesData, DemoListServiceTypesVariables>;
export function demoListServiceTypes(dc: DataConnect, vars: DemoListServiceTypesVariables): QueryPromise<DemoListServiceTypesData, DemoListServiceTypesVariables>;

interface DemoListServiceItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListServiceItemsVariables): QueryRef<DemoListServiceItemsData, DemoListServiceItemsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListServiceItemsVariables): QueryRef<DemoListServiceItemsData, DemoListServiceItemsVariables>;
  operationName: string;
}
export const demoListServiceItemsRef: DemoListServiceItemsRef;

export function demoListServiceItems(vars: DemoListServiceItemsVariables): QueryPromise<DemoListServiceItemsData, DemoListServiceItemsVariables>;
export function demoListServiceItems(dc: DataConnect, vars: DemoListServiceItemsVariables): QueryPromise<DemoListServiceItemsData, DemoListServiceItemsVariables>;

interface DemoListStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListStaffVariables): QueryRef<DemoListStaffData, DemoListStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListStaffVariables): QueryRef<DemoListStaffData, DemoListStaffVariables>;
  operationName: string;
}
export const demoListStaffRef: DemoListStaffRef;

export function demoListStaff(vars: DemoListStaffVariables): QueryPromise<DemoListStaffData, DemoListStaffVariables>;
export function demoListStaff(dc: DataConnect, vars: DemoListStaffVariables): QueryPromise<DemoListStaffData, DemoListStaffVariables>;

interface DemoListClientsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListClientsVariables): QueryRef<DemoListClientsData, DemoListClientsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListClientsVariables): QueryRef<DemoListClientsData, DemoListClientsVariables>;
  operationName: string;
}
export const demoListClientsRef: DemoListClientsRef;

export function demoListClients(vars: DemoListClientsVariables): QueryPromise<DemoListClientsData, DemoListClientsVariables>;
export function demoListClients(dc: DataConnect, vars: DemoListClientsVariables): QueryPromise<DemoListClientsData, DemoListClientsVariables>;

interface DemoGetClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoGetClientVariables): QueryRef<DemoGetClientData, DemoGetClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoGetClientVariables): QueryRef<DemoGetClientData, DemoGetClientVariables>;
  operationName: string;
}
export const demoGetClientRef: DemoGetClientRef;

export function demoGetClient(vars: DemoGetClientVariables): QueryPromise<DemoGetClientData, DemoGetClientVariables>;
export function demoGetClient(dc: DataConnect, vars: DemoGetClientVariables): QueryPromise<DemoGetClientData, DemoGetClientVariables>;

interface DemoListSchedulesByDateRangeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListSchedulesByDateRangeVariables): QueryRef<DemoListSchedulesByDateRangeData, DemoListSchedulesByDateRangeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListSchedulesByDateRangeVariables): QueryRef<DemoListSchedulesByDateRangeData, DemoListSchedulesByDateRangeVariables>;
  operationName: string;
}
export const demoListSchedulesByDateRangeRef: DemoListSchedulesByDateRangeRef;

export function demoListSchedulesByDateRange(vars: DemoListSchedulesByDateRangeVariables): QueryPromise<DemoListSchedulesByDateRangeData, DemoListSchedulesByDateRangeVariables>;
export function demoListSchedulesByDateRange(dc: DataConnect, vars: DemoListSchedulesByDateRangeVariables): QueryPromise<DemoListSchedulesByDateRangeData, DemoListSchedulesByDateRangeVariables>;

interface DemoGetSchedulesByRecurrenceIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoGetSchedulesByRecurrenceIdVariables): QueryRef<DemoGetSchedulesByRecurrenceIdData, DemoGetSchedulesByRecurrenceIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoGetSchedulesByRecurrenceIdVariables): QueryRef<DemoGetSchedulesByRecurrenceIdData, DemoGetSchedulesByRecurrenceIdVariables>;
  operationName: string;
}
export const demoGetSchedulesByRecurrenceIdRef: DemoGetSchedulesByRecurrenceIdRef;

export function demoGetSchedulesByRecurrenceId(vars: DemoGetSchedulesByRecurrenceIdVariables): QueryPromise<DemoGetSchedulesByRecurrenceIdData, DemoGetSchedulesByRecurrenceIdVariables>;
export function demoGetSchedulesByRecurrenceId(dc: DataConnect, vars: DemoGetSchedulesByRecurrenceIdVariables): QueryPromise<DemoGetSchedulesByRecurrenceIdData, DemoGetSchedulesByRecurrenceIdVariables>;

interface DemoListVisitRecordsByDateRangeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListVisitRecordsByDateRangeVariables): QueryRef<DemoListVisitRecordsByDateRangeData, DemoListVisitRecordsByDateRangeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListVisitRecordsByDateRangeVariables): QueryRef<DemoListVisitRecordsByDateRangeData, DemoListVisitRecordsByDateRangeVariables>;
  operationName: string;
}
export const demoListVisitRecordsByDateRangeRef: DemoListVisitRecordsByDateRangeRef;

export function demoListVisitRecordsByDateRange(vars: DemoListVisitRecordsByDateRangeVariables): QueryPromise<DemoListVisitRecordsByDateRangeData, DemoListVisitRecordsByDateRangeVariables>;
export function demoListVisitRecordsByDateRange(dc: DataConnect, vars: DemoListVisitRecordsByDateRangeVariables): QueryPromise<DemoListVisitRecordsByDateRangeData, DemoListVisitRecordsByDateRangeVariables>;

interface DemoGetVisitRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoGetVisitRecordVariables): QueryRef<DemoGetVisitRecordData, DemoGetVisitRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoGetVisitRecordVariables): QueryRef<DemoGetVisitRecordData, DemoGetVisitRecordVariables>;
  operationName: string;
}
export const demoGetVisitRecordRef: DemoGetVisitRecordRef;

export function demoGetVisitRecord(vars: DemoGetVisitRecordVariables): QueryPromise<DemoGetVisitRecordData, DemoGetVisitRecordVariables>;
export function demoGetVisitRecord(dc: DataConnect, vars: DemoGetVisitRecordVariables): QueryPromise<DemoGetVisitRecordData, DemoGetVisitRecordVariables>;

interface DemoListReportsByFacilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListReportsByFacilityVariables): QueryRef<DemoListReportsByFacilityData, DemoListReportsByFacilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListReportsByFacilityVariables): QueryRef<DemoListReportsByFacilityData, DemoListReportsByFacilityVariables>;
  operationName: string;
}
export const demoListReportsByFacilityRef: DemoListReportsByFacilityRef;

export function demoListReportsByFacility(vars: DemoListReportsByFacilityVariables): QueryPromise<DemoListReportsByFacilityData, DemoListReportsByFacilityVariables>;
export function demoListReportsByFacility(dc: DataConnect, vars: DemoListReportsByFacilityVariables): QueryPromise<DemoListReportsByFacilityData, DemoListReportsByFacilityVariables>;

interface DemoListCarePlansByFacilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoListCarePlansByFacilityVariables): QueryRef<DemoListCarePlansByFacilityData, DemoListCarePlansByFacilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoListCarePlansByFacilityVariables): QueryRef<DemoListCarePlansByFacilityData, DemoListCarePlansByFacilityVariables>;
  operationName: string;
}
export const demoListCarePlansByFacilityRef: DemoListCarePlansByFacilityRef;

export function demoListCarePlansByFacility(vars: DemoListCarePlansByFacilityVariables): QueryPromise<DemoListCarePlansByFacilityData, DemoListCarePlansByFacilityVariables>;
export function demoListCarePlansByFacility(dc: DataConnect, vars: DemoListCarePlansByFacilityVariables): QueryPromise<DemoListCarePlansByFacilityData, DemoListCarePlansByFacilityVariables>;

interface DemoGetCarePlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoGetCarePlanVariables): QueryRef<DemoGetCarePlanData, DemoGetCarePlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoGetCarePlanVariables): QueryRef<DemoGetCarePlanData, DemoGetCarePlanVariables>;
  operationName: string;
}
export const demoGetCarePlanRef: DemoGetCarePlanRef;

export function demoGetCarePlan(vars: DemoGetCarePlanVariables): QueryPromise<DemoGetCarePlanData, DemoGetCarePlanVariables>;
export function demoGetCarePlan(dc: DataConnect, vars: DemoGetCarePlanVariables): QueryPromise<DemoGetCarePlanData, DemoGetCarePlanVariables>;

interface DemoGetReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DemoGetReportVariables): QueryRef<DemoGetReportData, DemoGetReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DemoGetReportVariables): QueryRef<DemoGetReportData, DemoGetReportVariables>;
  operationName: string;
}
export const demoGetReportRef: DemoGetReportRef;

export function demoGetReport(vars: DemoGetReportVariables): QueryPromise<DemoGetReportData, DemoGetReportVariables>;
export function demoGetReport(dc: DataConnect, vars: DemoGetReportVariables): QueryPromise<DemoGetReportData, DemoGetReportVariables>;

