CREATE FUNCTION time_conflict() RETURNS trigger AS $time_conflict$
    BEGIN
        IF (SELECT count(*) FROM schedule WHERE (day=NEW.day AND time=NEW.time AND
        (t_tn=NEW.t_tn OR s_sn=NEW.s_sn OR c_cn=NEW.c_cn OR classroom=NEW.classroom))) THEN
        RAISE EXCEPTION '与现有排课冲突';
        END IF;
        RETURN NEW;
    END;
$time_conflict$ LANGUAGE plpgsql;

CREATE TRIGGER time_conflict_insert BEFORE INSERT ON schedule
    FOR EACH ROW EXECUTE PROCEDURE time_conflict();

CREATE TRIGGER time_conflict_update BEFORE UPDATE ON schedule
    FOR EACH ROW EXECUTE PROCEDURE time_conflict();
