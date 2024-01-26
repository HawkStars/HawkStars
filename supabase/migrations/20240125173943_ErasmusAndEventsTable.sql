CREATE TABLE erasmus_projects (
    id UUID PRIMARY KEY,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    photos TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE hawk_events (
    id UUID PRIMARY KEY,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    photos TEXT[] NOT NULL DEFAULT '{}'
);
