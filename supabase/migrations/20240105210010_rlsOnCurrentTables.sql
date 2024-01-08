ALTER TABLE "public"."contributions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."organization_movements" ENABLE ROW LEVEL SECURITY;

--- SELECTS
CREATE POLICY "Allow everyone to read organization movements" ON "public"."organization_movements" FOR SELECT USING (true);
CREATE POLICY "Allow everyone to read contributions" ON "public"."contributions" FOR SELECT USING (true);
CREATE POLICY "Allow everyone to read profiles" ON "public"."profiles" FOR SELECT USING(true);

-- INSERTS
CREATE POLICY "Allow everyone to create contributions" ON "public"."contributions" FOR INSERT WITH CHECK(true);
CREATE POLICY "Allow postgres to create profiles" ON "public"."profiles" FOR INSERT TO authenticated WITH CHECK(true);
CREATE POLICY "Allow postgres to create organization movements" ON "public"."organization_movements" FOR INSERT to authenticated WITH CHECK((SELECT type from profiles where id = auth.uid() LIMIT 1) = 'ADMIN');

-- UPDATE
CREATE POLICY "Allow postgres to update contributions" ON "public"."contributions" FOR UPDATE TO postgres WITH CHECK(true);


