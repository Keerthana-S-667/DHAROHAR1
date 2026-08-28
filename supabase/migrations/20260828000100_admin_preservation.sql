-- ==========================================
-- DHAROHAR ADMIN PRESERVATION SCHEMA
-- ==========================================

-- 1. Create heritage reports ledger table
CREATE TABLE IF NOT EXISTS public.heritage_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id TEXT UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  monument_id TEXT NOT NULL,
  monument_name TEXT NOT NULL,
  state TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'assigned', 'field_verification', 'action_conservation', 'requires_more_info', 'resolved')),
  priority_score INTEGER NOT NULL DEFAULT 50 CHECK (priority_score BETWEEN 0 AND 100),
  description TEXT NOT NULL,
  visual_evidence TEXT[] DEFAULT '{}',
  gps_latitude DOUBLE PRECISION,
  gps_longitude DOUBLE PRECISION,
  reporter_name TEXT,
  reporter_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sequence for sequential report IDs starting from 129 to prevent overlap with mock data
CREATE SEQUENCE IF NOT EXISTS public.heritage_report_id_seq START WITH 129;

-- Create function to generate sequential report ID
CREATE OR REPLACE FUNCTION public.generate_heritage_report_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.report_id IS NULL THEN
    NEW.report_id := 'DH-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.heritage_report_id_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to generate report ID on insert
CREATE OR REPLACE TRIGGER tr_generate_report_id
BEFORE INSERT ON public.heritage_reports
FOR EACH ROW
EXECUTE FUNCTION public.generate_heritage_report_id();

-- Enable RLS for reports table
ALTER TABLE public.heritage_reports ENABLE ROW LEVEL SECURITY;

-- 2. Create status history table
CREATE TABLE IF NOT EXISTS public.report_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.heritage_reports(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  officer_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for status history
ALTER TABLE public.report_status_history ENABLE ROW LEVEL SECURITY;

-- 3. Create assignments table
CREATE TABLE IF NOT EXISTS public.report_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.heritage_reports(id) ON DELETE CASCADE,
  assigned_role TEXT NOT NULL, -- e.g. 'Conservation Officer', 'Archaeologist', 'Structural Engineer', 'Field Survey Team'
  assigned_to_name TEXT NOT NULL,
  target_date DATE NOT NULL,
  officer_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for assignments
ALTER TABLE public.report_assignments ENABLE ROW LEVEL SECURITY;

-- 4. Create field verification table
CREATE TABLE IF NOT EXISTS public.field_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.heritage_reports(id) ON DELETE CASCADE,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('confirmed', 'not_confirmed', 'requires_further_study')),
  observed_condition TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  field_notes TEXT,
  additional_evidence TEXT[] DEFAULT '{}',
  verified_by_name TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for verifications
ALTER TABLE public.field_verifications ENABLE ROW LEVEL SECURITY;

-- 5. Create resolutions table
CREATE TABLE IF NOT EXISTS public.report_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.heritage_reports(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  notes TEXT NOT NULL,
  evidence_url TEXT,
  resolved_by_name TEXT NOT NULL,
  resolved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for resolutions
ALTER TABLE public.report_resolutions ENABLE ROW LEVEL SECURITY;

-- 6. Create activity audit log table
CREATE TABLE IF NOT EXISTS public.report_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  report_id UUID,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for activity logs
ALTER TABLE public.report_activity_log ENABLE ROW LEVEL SECURITY;

-- 7. Create community contributions table
CREATE TABLE IF NOT EXISTS public.community_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  contributor_name TEXT NOT NULL,
  contributor_email TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_note TEXT,
  moderated_by_name TEXT,
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for contributions
ALTER TABLE public.community_contributions ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- Helper is_admin() check should be available from first migration
-- Policy definitions:

-- Heritage Reports:
CREATE POLICY "Admins can do everything on reports" ON public.heritage_reports 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read reports general" ON public.heritage_reports
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit reports" ON public.heritage_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Status History:
CREATE POLICY "Admins can do everything on history" ON public.report_status_history 
  FOR ALL USING (public.is_admin());

-- Assignments:
CREATE POLICY "Admins can do everything on assignments" ON public.report_assignments 
  FOR ALL USING (public.is_admin());

-- Field Verifications:
CREATE POLICY "Admins can do everything on verifications" ON public.field_verifications 
  FOR ALL USING (public.is_admin());

-- Resolutions:
CREATE POLICY "Admins can do everything on resolutions" ON public.report_resolutions 
  FOR ALL USING (public.is_admin());

-- Activity Log:
CREATE POLICY "Admins can do everything on activity log" ON public.report_activity_log 
  FOR ALL USING (public.is_admin());

-- Community Contributions:
CREATE POLICY "Admins can do everything on contributions" ON public.community_contributions 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can select approved contributions" ON public.community_contributions
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can insert contributions" ON public.community_contributions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ==========================================
-- TRIGGER FOR UPDATED_AT
-- ==========================================

CREATE OR REPLACE TRIGGER tr_reports_set_updated_at
BEFORE UPDATE ON public.heritage_reports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert demo heritage reports
INSERT INTO public.heritage_reports (id, monument_id, monument_name, state, issue_type, severity, status, priority_score, description, visual_evidence, gps_latitude, gps_longitude, reporter_name, reporter_email)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'shore-temple', 'Shore Temple', 'Tamil Nadu', 'Surface Erosion', 'high', 'assigned', 92, 'Salt air exposure has led to accelerating surface scaling and flaking on the structural relief carvings of the East sanctum.', ARRAY['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'], 12.6164, 80.1983, 'Karthik Raja', 'karthik@gmail.com'),
  ('f7e6d5c4-b3a2-1e0f-9d8c-7b6a5e4d3c2b', 'hampi-monuments', 'Hampi Ruins', 'Karnataka', 'Structural Crack', 'critical', 'field_verification', 96, 'A major hairline fracture has opened up on the overhead horizontal lintel supporting the stone carriage inside the Stone Chariot monument.', ARRAY['https://images.unsplash.com/photo-1600100397608-f010e42fa216?auto=format&fit=crop&w=800&q=80'], 15.3350, 76.4600, 'Dr. Aruna Hegde', 'aruna@yahoo.com'),
  ('0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'taj-mahal', 'Taj Mahal', 'Uttar Pradesh', 'Stone Discoloration', 'medium', 'resolved', 65, 'Yellow soot particles and chemical pollution build-up observed on the lower west plinth of the main mausoleum marble dome.', ARRAY['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'], 27.1751, 78.0421, 'Amit Sharma', 'amit.sharma@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Insert history timeline entries
INSERT INTO public.report_status_history (report_id, status, officer_name, notes)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'submitted', 'System', 'Report successfully logged via citizen conservation portal.'),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'under_review', 'Heritage Officer', 'Initial photo inspection confirms active salt weathering.'),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'assigned', 'Heritage Officer', 'Assigned archaeologist to compile local structural assessment.'),
  ('f7e6d5c4-b3a2-1e0f-9d8c-7b6a5e4d3c2b', 'submitted', 'System', 'Report successfully logged via researcher portal.'),
  ('f7e6d5c4-b3a2-1e0f-9d8c-7b6a5e4d3c2b', 'under_review', 'Heritage Officer', 'Critical severity status set. Moving immediately to verification queue.'),
  ('f7e6d5c4-b3a2-1e0f-9d8c-7b6a5e4d3c2b', 'field_verification', 'Archaeologist Team', 'Field survey crew dispatched to verify structural safety.'),
  ('0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'submitted', 'System', 'Report logged via public form.'),
  ('0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'resolved', 'Heritage Officer', 'Marked resolved after structural review.')
ON CONFLICT DO NOTHING;

-- Insert default assignments
INSERT INTO public.report_assignments (report_id, assigned_role, assigned_to_name, target_date, officer_note)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Archaeologist', 'Dr. Ramesh Kumar', '2026-09-10', 'Examine sand-dust wearing rate and recommend restoration bounds.'),
  ('f7e6d5c4-b3a2-1e0f-9d8c-7b6a5e4d3c2b', 'Field Survey Team', 'South Zone Surveyors Unit B', '2026-09-02', 'Deploy precision ultrasound to detect sub-surface cracks.')
ON CONFLICT DO NOTHING;

-- Insert default resolution for the Taj Mahal resolved case
INSERT INTO public.report_resolutions (report_id, summary, notes, evidence_url, resolved_by_name)
VALUES 
  ('0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'Marble clay-pack cleaning completed.', 'The yellowed area was treated with a non-abrasive fuller''s earth clay pack (multani mitti) to draw out soot and grime. The marble surface is now restored to stable condition.', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', 'Heritage Officer')
ON CONFLICT DO NOTHING;

-- Insert default moderation items
INSERT INTO public.community_contributions (id, title, location, contributor_name, contributor_email, content, status, moderation_note)
VALUES 
  ('c1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Chola Sea-Trading at Mahabalipuram', 'Mahabalipuram, Tamil Nadu', 'Sujatha Pillai', 'sujatha@gmail.com', 'During the 8th century, the port of Mamallapuram was bustling with ships heading to Southeast Asia. The Shore Temple was used as a lighthouse for merchants...', 'pending', NULL),
  ('c7e6d5c4-b3a2-1e0f-9d8c-7b6a5e4d3c2b', 'My Journey through the ruins of Hampi', 'Hampi, Karnataka', 'Robert Wilson', 'robert@yahoo.com', 'Walking through the Vitthala temple complex at sunrise felt like travelling back in time to the Vijayanagara Empire. The musical pillars are an engineering marvel...', 'approved', NULL)
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime for heritage reports table
ALTER PUBLICATION supabase_realtime ADD TABLE public.heritage_reports;
