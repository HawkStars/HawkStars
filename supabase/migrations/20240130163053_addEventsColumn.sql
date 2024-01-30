ALTER TABLE "erasmus_projects"
    ADD COLUMN "start_project_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN "end_project_date" DATE NULL;

ALTER TABLE "hawk_events"
    ADD COLUMN "start_event_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN "end_event_date" DATE NULL;