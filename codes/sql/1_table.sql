-- === 课程表
DROP TABLE IF EXISTS course;
CREATE TABLE IF NOT EXISTS course  (
    cn      INTEGER,      --序号
    name    VARCHAR(50),  --课程名称
    credit  INTEGER,      --课程学分
    PRIMARY KEY(cn)
);

-- 给cn创建一个自增序号
CREATE SEQUENCE seq_course_cn
    START 10000 INCREMENT 1 OWNED BY course.cn;
ALTER TABLE course ALTER cn
    SET DEFAULT nextval('seq_course_cn');

-- === 教师表
DROP TABLE IF EXISTS teacher;
CREATE TABLE IF NOT EXISTS teacher  (
    tn      INTEGER,     --序号
    name    VARCHAR(50), --姓名
    PRIMARY KEY(tn)
);

-- 给tn创建一个自增序号
CREATE SEQUENCE seq_teacher_tn 
    START 10000 INCREMENT 1 OWNED BY teacher.tn;
ALTER TABLE teacher ALTER tn
    SET DEFAULT nextval('seq_teacher_tn');

-- === 学生表
DROP TABLE IF EXISTS student;
CREATE TABLE IF NOT EXISTS student  (
    sn      INTEGER,     --序号
    name    VARCHAR(50), --姓名
    PRIMARY KEY(sn)
);

-- 给sn创建一个自增序号
CREATE SEQUENCE seq_student_sn 
    START 10000 INCREMENT 1 OWNED BY student.sn;
ALTER TABLE student ALTER sn 
    SET DEFAULT nextval('seq_student_sn');

-- === 排课表
DROP TABLE IF EXISTS schedule;
CREATE TABLE IF NOT EXISTS schedule  (
    num         INTEGER,     -- 序号
    day         CHAR(1),     -- 星期
    time        CHAR(1),     -- 节次
    classroom   VARCHAR(50), -- 课程教室
    c_cn        INTEGER,     -- 课程序号
    t_tn        INTEGER,     -- 教师序号
    s_sn        INTEGER,     -- 学生序号

    PRIMARY KEY(num)
);

-- 给pn建一个自增序号
CREATE SEQUENCE seq_schedule_num
    START 10000 INCREMENT 1 OWNED BY schedule.num;
ALTER TABLE schedule ALTER num
    SET DEFAULT nextval('seq_schedule_num');

ALTER TABLE schedule
    ADD CONSTRAINT s_sn_fk FOREIGN KEY (s_sn) REFERENCES student(sn);
ALTER TABLE schedule
    ADD CONSTRAINT c_cn_fk FOREIGN KEY (c_cn) REFERENCES course(cn);
ALTER TABLE schedule
    ADD CONSTRAINT t_tn_fk FOREIGN KEY (t_tn) REFERENCES teacher(tn);