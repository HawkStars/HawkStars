CREATE OR REPLACE FUNCTION project_total_contributions() 
    RETURNS integer
    LANGUAGE plpgsql AS
$func$
BEGIN
   RETURN (SELECT SUM(value) FROM contributions);
END
$func$;
