/*
# Create PackIntel recommendation history

1. New Tables
- `packintel_recommendation_history` stores prototype recommendation snapshots so the History view survives page refreshes.
- `id` unique identifier.
- `product` demo or user-entered product name.
- `recommended_material` selected material label.
- `score` prototype recommendation score from 0 to 100.
- `storage` storage condition label.
- `status` current recommendation status.
- `created_at` timestamp for the recommendation.
2. Security
- Row level security is enabled.
- This prototype has no sign-in screen, so anon and authenticated roles can use the intentionally shared demo history.
3. Notes
- Values are decision-support snapshots only and are not laboratory or regulatory certifications.
*/

CREATE TABLE IF NOT EXISTS public.packintel_recommendation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL,
  recommended_material text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  storage text NOT NULL,
  status text NOT NULL DEFAULT 'Recommended',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.packintel_recommendation_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo_history_select" ON public.packintel_recommendation_history;
CREATE POLICY "demo_history_select" ON public.packintel_recommendation_history FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "demo_history_insert" ON public.packintel_recommendation_history;
CREATE POLICY "demo_history_insert" ON public.packintel_recommendation_history FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "demo_history_update" ON public.packintel_recommendation_history;
CREATE POLICY "demo_history_update" ON public.packintel_recommendation_history FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "demo_history_delete" ON public.packintel_recommendation_history;
CREATE POLICY "demo_history_delete" ON public.packintel_recommendation_history FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS packintel_history_created_at_idx ON public.packintel_recommendation_history (created_at DESC);