// QHSE Module Types
export interface QHSEModule {
  id: string
  name: string
  description: string
  icon: string
  path: string
  status: "active" | "inactive"
}

export interface QualityModule extends QHSEModule {
  category: "quality"
}

export interface HSEModule extends QHSEModule {
  category: "hse"
}

export interface TrainingModule extends QHSEModule {
  category: "training"
}

export interface AuditModule extends QHSEModule {
  category: "audit"
}

// Quality Submodules
export interface InspectionRecord {
  id: string
  equipmentId: string
  equipmentName: string
  inspectionType: "routine" | "preventive" | "corrective"
  inspector: string
  date: string
  status: "pending" | "in-progress" | "completed" | "failed"
  findings: string[]
  recommendations: string[]
  nextInspectionDate?: string
  createdAt: string
  updatedAt: string
}

export interface LiftingOperation {
  id: string
  operationName: string
  location: string
  liftingEquipment: string
  operator: string
  supervisor: string
  plannedDate: string
  actualDate?: string
  weight: number
  height: number
  status: "planned" | "in-progress" | "completed" | "cancelled"
  riskAssessment: string
  safetyMeasures: string[]
  createdAt: string
  updatedAt: string
}

export interface ISODocument {
  id: string
  documentNumber: string
  title: string
  version: string
  category: "procedure" | "policy" | "form" | "manual"
  department: string
  owner: string
  approver: string
  effectiveDate: string
  reviewDate: string
  status: "draft" | "under-review" | "approved" | "obsolete"
  filePath?: string
  createdAt: string
  updatedAt: string
}

export interface SQMRecord {
  id: string
  supplierName: string
  supplierCode: string
  category: string
  evaluationDate: string
  evaluator: string
  overallScore: number
  qualityScore: number
  deliveryScore: number
  serviceScore: number
  status: "approved" | "conditional" | "rejected" | "under-review"
  comments: string
  nextEvaluationDate: string
  createdAt: string
  updatedAt: string
}

// HSE Submodules
export interface PermitWorkRecord {
  id: string
  permitNumber: string
  workDescription: string
  location: string
  requestor: string
  approver: string
  startDate: string
  endDate: string
  status: "pending" | "approved" | "active" | "completed" | "cancelled"
  workType: "hot-work" | "confined-space" | "electrical" | "height" | "excavation"
  hazards: string[]
  safetyMeasures: string[]
  isolationRequired: boolean
  gasTestRequired: boolean
  createdAt: string
  updatedAt: string
}

export interface WeldingWorkRecord {
  id: string
  workOrderNumber: string
  weldingType: "arc" | "mig" | "tig" | "oxy-acetylene"
  welder: string
  welderCertification: string
  location: string
  material: string
  thickness: number
  position: "flat" | "horizontal" | "vertical" | "overhead"
  inspector: string
  status: "planned" | "in-progress" | "inspection" | "approved" | "rejected"
  preWeldInspection: boolean
  postWeldInspection: boolean
  testResults: string[]
  defects: string[]
  createdAt: string
  updatedAt: string
}

export interface JSARecord {
  id: string
  jsaNumber: string
  jobDescription: string
  location: string
  supervisor: string
  workers: string[]
  date: string
  status: "draft" | "approved" | "active" | "completed"
  jobSteps: {
    step: string
    hazards: string[]
    controls: string[]
  }[]
  riskLevel: "low" | "medium" | "high"
  approvalRequired: boolean
  createdAt: string
  updatedAt: string
}

export interface StopCardRecord {
  id: string
  cardNumber: string
  reportedBy: string
  location: string
  dateReported: string
  description: string
  immediateAction: string
  category: "unsafe-act" | "unsafe-condition" | "near-miss" | "environmental"
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "investigating" | "corrective-action" | "closed"
  investigator: string
  correctiveActions: string[]
  targetCloseDate: string
  actualCloseDate?: string
  createdAt: string
  updatedAt: string
}

// Training Submodules
export interface PreziRecord {
  id: string
  presentationId: string
  title: string
  topic: string
  presenter: string
  department: string
  targetAudience: string
  duration: number // in minutes
  scheduledDate: string
  actualDate?: string
  location: string
  attendees: string[]
  maxAttendees: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "postponed"
  materials: string[]
  objectives: string[]
  evaluationScore?: number
  feedback: string[]
  certificateIssued: boolean
  createdAt: string
  updatedAt: string
}

export interface OnlineTrainingRecord {
  id: string
  courseId: string
  courseName: string
  category: "safety" | "quality" | "technical" | "compliance" | "soft-skills"
  instructor: string
  duration: number // in hours
  enrollmentDate: string
  startDate?: string
  completionDate?: string
  status: "enrolled" | "in-progress" | "completed" | "failed" | "expired"
  progress: number // percentage
  modules: {
    moduleId: string
    moduleName: string
    duration: number
    completed: boolean
    score?: number
  }[]
  finalScore?: number
  passingScore: number
  attempts: number
  maxAttempts: number
  certificateUrl?: string
  expiryDate?: string
  createdAt: string
  updatedAt: string
}

// Audit Submodules
export interface AuditRecord {
  id: string
  auditNumber: string
  auditType: "internal" | "external" | "supplier" | "regulatory"
  title: string
  scope: string
  department: string
  leadAuditor: string
  auditTeam: string[]
  plannedStartDate: string
  plannedEndDate: string
  actualStartDate?: string
  actualEndDate?: string
  status: "planned" | "in-progress" | "draft-report" | "final-report" | "closed"
  standard: string // ISO 9001, ISO 14001, etc.
  findings: {
    id: string
    type: "major" | "minor" | "observation" | "opportunity"
    clause: string
    description: string
    evidence: string
    correctiveAction?: string
    responsible?: string
    targetDate?: string
    status: "open" | "in-progress" | "closed"
  }[]
  overallRating: "satisfactory" | "needs-improvement" | "unsatisfactory"
  reportPath?: string
  followUpRequired: boolean
  followUpDate?: string
  createdAt: string
  updatedAt: string
}

export interface ClaimRecord {
  id: string
  claimNumber: string
  claimType: "customer" | "supplier" | "internal" | "warranty"
  title: string
  description: string
  reportedBy: string
  reportedDate: string
  customer?: string
  supplier?: string
  product: string
  batchLot?: string
  quantity: number
  value: number
  currency: string
  status: "received" | "investigating" | "pending-approval" | "approved" | "rejected" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  category: "quality" | "delivery" | "service" | "billing" | "other"
  investigator: string
  rootCause?: string
  correctiveActions: string[]
  preventiveActions: string[]
  resolution: string
  resolutionDate?: string
  customerSatisfied?: boolean
  costImpact: number
  createdAt: string
  updatedAt: string
}

export interface NonConformRecord {
  id: string
  ncNumber: string
  title: string
  description: string
  detectedBy: string
  detectionDate: string
  location: string
  department: string
  process: string
  product?: string
  batchLot?: string
  category: "product" | "process" | "system" | "documentation"
  severity: "minor" | "major" | "critical"
  status: "open" | "investigating" | "corrective-action" | "verification" | "closed"
  source: "internal-audit" | "customer-complaint" | "supplier-issue" | "process-monitoring" | "inspection"
  rootCauseAnalysis: {
    method: "5-why" | "fishbone" | "fault-tree" | "other"
    analysis: string
    rootCause: string
  }
  immediateAction: string
  correctiveActions: {
    action: string
    responsible: string
    targetDate: string
    completionDate?: string
    status: "planned" | "in-progress" | "completed"
  }[]
  preventiveActions: {
    action: string
    responsible: string
    targetDate: string
    completionDate?: string
    status: "planned" | "in-progress" | "completed"
  }[]
  verificationMethod: string
  verificationDate?: string
  verifiedBy?: string
  effectiveness: "effective" | "partially-effective" | "not-effective" | "pending"
  createdAt: string
  updatedAt: string
}
