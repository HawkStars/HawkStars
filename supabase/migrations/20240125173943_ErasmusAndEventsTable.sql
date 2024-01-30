CREATE TABLE erasmus_projects (
    id UUID PRIMARY KEY,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    photos TEXT[] NOT NULL DEFAULT '{}',
    project_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE hawk_events (
    id UUID PRIMARY KEY,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    photos TEXT[] NOT NULL DEFAULT '{}',
    event_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
