import { supabase } from '../lib/supabase';
import { 
  HeritageReport, 
  ReportStatus, 
  ReportSeverity, 
  ReportStatusHistory, 
  ReportAssignment, 
  FieldVerification, 
  ReportResolution, 
  ReportActivityLog, 
  CommunityContribution 
} from '../types';

// ==========================================
// DB DATABASE ROW MAPPERS (SNAKE_CASE -> CAMELCASE)
// ==========================================

export const mapReportFromDb = (row: any): HeritageReport => ({
  id: row.id,
  monumentId: row.monument_id,
  monumentName: row.monument_name,
  state: row.state,
  issueType: row.issue_type,
  severity: row.severity,
  status: row.status,
  priorityScore: row.priority_score,
  description: row.description,
  visualEvidence: row.visual_evidence || [],
  gpsLatitude: row.gps_latitude,
  gpsLongitude: row.gps_longitude,
  reporterName: row.reporter_name,
  reporterEmail: row.reporter_email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapHistoryFromDb = (row: any): ReportStatusHistory => ({
  id: row.id,
  reportId: row.report_id,
  status: row.status,
  officerName: row.officer_name,
  notes: row.notes,
  createdAt: row.created_at,
});

const mapAssignmentFromDb = (row: any): ReportAssignment => ({
  id: row.id,
  reportId: row.report_id,
  assignedRole: row.assigned_role,
  assignedToName: row.assigned_to_name,
  targetDate: row.target_date,
  officerNote: row.officer_note,
  createdAt: row.created_at,
});

const mapVerificationFromDb = (row: any): FieldVerification => ({
  id: row.id,
  reportId: row.report_id,
  verificationStatus: row.verification_status,
  observedCondition: row.observed_condition,
  recommendedAction: row.recommended_action,
  fieldNotes: row.field_notes,
  additionalEvidence: row.additional_evidence || [],
  verifiedByName: row.verified_by_name,
  verifiedAt: row.verified_at,
});

const mapResolutionFromDb = (row: any): ReportResolution => ({
  id: row.id,
  reportId: row.report_id,
  summary: row.summary,
  notes: row.notes,
  evidenceUrl: row.evidence_url,
  resolvedByName: row.resolved_by_name,
  resolvedAt: row.resolved_at,
});

const mapActivityFromDb = (row: any): ReportActivityLog => ({
  id: row.id,
  actorName: row.actor_name,
  actorRole: row.actor_role,
  action: row.action,
  reportId: row.report_id,
  details: row.details,
  createdAt: row.created_at,
});

const mapContributionFromDb = (row: any): CommunityContribution => ({
  id: row.id,
  title: row.title,
  location: row.location,
  contributorName: row.contributor_name,
  contributorEmail: row.contributor_email,
  content: row.content,
  status: row.status,
  moderationNote: row.moderation_note,
  moderatedByName: row.moderated_by_name,
  moderatedAt: row.moderated_at,
  createdAt: row.created_at,
});


// ==========================================
// CORE ADMIN SERVICE CLASS
// ==========================================

export const adminService = {
  // --- Dashboard Stats ---
  async getDashboardStats() {
    const { data, error } = await supabase
      .from('heritage_reports')
      .select('status, severity, priority_score');

    if (error) throw error;

    const stats = {
      total: data.length,
      underReview: data.filter(r => r.status === 'under_review').length,
      highPriority: data.filter(r => r.priority_score >= 80).length,
      assigned: data.filter(r => r.status === 'assigned').length,
      verification: data.filter(r => r.status === 'field_verification').length,
      resolved: data.filter(r => r.status === 'resolved').length,
    };

    return stats;
  },

  // --- Reports Ledger Queries ---
  async getReports(filters?: {
    search?: string;
    status?: string;
    severity?: string;
    state?: string;
    sortBy?: 'newest' | 'oldest' | 'priority' | 'severity';
  }) {
    let query = supabase.from('heritage_reports').select('*');

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }
    if (filters?.state && filters.state !== 'all') {
      query = query.eq('state', filters.state);
    }

    if (filters?.search) {
      const searchVal = `%${filters.search}%`;
      query = query.or(`monument_name.ilike.${searchVal},issue_type.ilike.${searchVal},description.ilike.${searchVal}`);
    }

    // Apply Sorting
    if (filters?.sortBy) {
      if (filters.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (filters.sortBy === 'priority') {
        query = query.order('priority_score', { ascending: false });
      } else if (filters.sortBy === 'severity') {
        // Simple ordering: critical, high, medium, low
        query = query.order('severity', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = query as any;
    const result = await query;
    if (result.error) throw result.error;
    return (result.data || []).map(mapReportFromDb);
  },

  async getReportById(id: string) {
    const { data, error } = await supabase
      .from('heritage_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapReportFromDb(data);
  },

  // --- Timeline / Status History ---
  async getReportTimeline(reportId: string): Promise<ReportStatusHistory[]> {
    const { data, error } = await supabase
      .from('report_status_history')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(mapHistoryFromDb);
  },

  // --- Assignments ---
  async getReportAssignment(reportId: string): Promise<ReportAssignment | null> {
    const { data, error } = await supabase
      .from('report_assignments')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapAssignmentFromDb(data) : null;
  },

  // --- Field Verification ---
  async getFieldVerification(reportId: string): Promise<FieldVerification | null> {
    const { data, error } = await supabase
      .from('field_verifications')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapVerificationFromDb(data) : null;
  },

  // --- Resolution ---
  async getReportResolution(reportId: string): Promise<ReportResolution | null> {
    const { data, error } = await supabase
      .from('report_resolutions')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapResolutionFromDb(data) : null;
  },

  // --- Related / Duplicate Reports ---
  async getRelatedReports(monumentId: string, currentReportId: string): Promise<HeritageReport[]> {
    const { data, error } = await supabase
      .from('heritage_reports')
      .select('*')
      .eq('monument_id', monumentId)
      .neq('id', currentReportId)
      .limit(3);

    if (error) throw error;
    return data.map(mapReportFromDb);
  },

  // --- Audit Log Entries ---
  async getAuditLogs(): Promise<ReportActivityLog[]> {
    const { data, error } = await supabase
      .from('report_activity_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapActivityFromDb);
  },

  // --- Community Moderation List ---
  async getContributions(status?: 'pending' | 'approved' | 'rejected') {
    let query = supabase.from('community_contributions').select('*');
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(mapContributionFromDb);
  },


  // ==========================================
  // STATE WRITING WORKFLOW ACTIONS (Supabase mutation)
  // ==========================================

  // --- Update Report Status ---
  async updateReportStatus(params: {
    reportId: string;
    status: ReportStatus;
    officerName: string;
    notes?: string;
  }) {
    // 1. Update report status column
    const { error: updateError } = await supabase
      .from('heritage_reports')
      .update({ status: params.status })
      .eq('id', params.reportId);

    if (updateError) throw updateError;

    // 2. Add history milestone entry
    const { error: historyError } = await supabase
      .from('report_status_history')
      .insert({
        report_id: params.reportId,
        status: params.status,
        officer_name: params.officerName,
        notes: params.notes || `Status transitioned to ${params.status.replace('_', ' ')}.`
      });

    if (historyError) throw historyError;

    // 3. Log administrative audit action
    await this.logActivity({
      actorName: params.officerName,
      actorRole: 'admin',
      action: 'STATUS_CHANGED',
      reportId: params.reportId,
      details: `Transitioned status to: ${params.status}. Notes: ${params.notes || 'None'}`
    });
  },

  // --- Assign Case to Officer ---
  async assignReport(params: {
    reportId: string;
    assignedRole: string;
    assignedToName: string;
    targetDate: string;
    officerNote?: string;
    officerName: string;
  }) {
    // 1. Insert/Upsert assignment record
    const { error: assignError } = await supabase
      .from('report_assignments')
      .insert({
        report_id: params.reportId,
        assigned_role: params.assignedRole,
        assigned_to_name: params.assignedToName,
        target_date: params.targetDate,
        officer_note: params.officerNote
      });

    if (assignError) throw assignError;

    // 2. Transition report status to 'assigned'
    await this.updateReportStatus({
      reportId: params.reportId,
      status: 'assigned',
      officerName: params.officerName,
      notes: `Assigned case to: ${params.assignedToName} (${params.assignedRole}).`
    });

    // 3. Log audit activity
    await this.logActivity({
      actorName: params.officerName,
      actorRole: 'admin',
      action: 'CASE_ASSIGNED',
      reportId: params.reportId,
      details: `Assigned surveyor: ${params.assignedToName} (Role: ${params.assignedRole}, Target: ${params.targetDate})`
    });
  },

  // --- Submit Field Survey Verification ---
  async submitFieldVerification(params: {
    reportId: string;
    verificationStatus: 'confirmed' | 'not_confirmed' | 'requires_further_study';
    observedCondition: string;
    recommendedAction: string;
    fieldNotes?: string;
    additionalEvidence?: string[];
    officerName: string;
  }) {
    // 1. Insert verification entry
    const { error: verifyError } = await supabase
      .from('field_verifications')
      .insert({
        report_id: params.reportId,
        verification_status: params.verificationStatus,
        observed_condition: params.observedCondition,
        recommended_action: params.recommendedAction,
        field_notes: params.fieldNotes,
        additional_evidence: params.additionalEvidence || [],
        verified_by_name: params.officerName
      });

    if (verifyError) throw verifyError;

    // 2. Transition status to 'field_verification'
    await this.updateReportStatus({
      reportId: params.reportId,
      status: 'field_verification',
      officerName: params.officerName,
      notes: `Field survey logged: Condition is ${params.verificationStatus.replace('_', ' ')}.`
    });

    // 3. Log audit activity
    await this.logActivity({
      actorName: params.officerName,
      actorRole: 'admin',
      action: 'FIELD_VERIFICATION_SUBMITTED',
      reportId: params.reportId,
      details: `Field verification submitted. Result: ${params.verificationStatus}. Notes: ${params.fieldNotes || 'None'}`
    });
  },

  // --- Submit Case Resolution ---
  async resolveReport(params: {
    reportId: string;
    summary: string;
    notes: string;
    evidenceUrl?: string;
    officerName: string;
  }) {
    // 1. Insert resolution entry
    const { error: resolutionError } = await supabase
      .from('report_resolutions')
      .insert({
        report_id: params.reportId,
        summary: params.summary,
        notes: params.notes,
        evidence_url: params.evidenceUrl,
        resolved_by_name: params.officerName
      });

    if (resolutionError) throw resolutionError;

    // 2. Transition status to 'resolved'
    await this.updateReportStatus({
      reportId: params.reportId,
      status: 'resolved',
      officerName: params.officerName,
      notes: `Report marked resolved. Summary: ${params.summary}`
    });

    // 3. Log audit activity
    await this.logActivity({
      actorName: params.officerName,
      actorRole: 'admin',
      action: 'CASE_RESOLVED',
      reportId: params.reportId,
      details: `Marked case resolved. Summary: ${params.summary}. Notes: ${params.notes}`
    });
  },

  // --- Moderate Contribution ---
  async moderateContribution(params: {
    contributionId: string;
    status: 'approved' | 'rejected';
    moderationNote?: string;
    officerName: string;
  }) {
    // 1. Update contribution status
    const { error: modError } = await supabase
      .from('community_contributions')
      .update({
        status: params.status,
        moderation_note: params.moderationNote,
        moderated_by_name: params.officerName,
        moderated_at: new Date().toISOString()
      })
      .eq('id', params.contributionId);

    if (modError) throw modError;

    // 2. Log activity
    await this.logActivity({
      actorName: params.officerName,
      actorRole: 'admin',
      action: params.status === 'approved' ? 'CONTRIBUTION_APPROVED' : 'CONTRIBUTION_REJECTED',
      details: `Moderated story contribution ID: ${params.contributionId}. Status: ${params.status}. Reason: ${params.moderationNote || 'None'}`
    });
  },

  // --- Helper Activity Logger ---
  async logActivity(params: {
    actorName: string;
    actorRole: string;
    action: string;
    reportId?: string;
    details?: string;
  }) {
    const { error } = await supabase
      .from('report_activity_log')
      .insert({
        actor_name: params.actorName,
        actor_role: params.actorRole,
        action: params.action,
        report_id: params.reportId,
        details: params.details
      });

    if (error) console.error('Failed to log admin audit action:', error.message);
  }
};
