DELETE FROM course;
DELETE FROM teacher;
DELETE FROM student;
DELETE FROM schedule;

INSERT INTO course (name, credit)  VALUES 
    ('系统分析与设计', 3), 
    ('大学英语', 2),
    ('项目管理', 2);

INSERT INTO teacher (name)  VALUES
    ('Pony'),
    ('Jack Ma');

INSERT INTO student (name)  VALUES
    ('刘一'),
    ('吴双'), 
    ('张三三');

INSERT INTO schedule (day, time, classroom, c_cn, t_tn, s_sn)  VALUES 
    ('一', '一', 'C107', 10001, 10001, 10000),
    ('四', '二', 'C107', 10001, 10001, 10000),
    ('一', '三', 'D105', 10000, 10000, 10000),
    ('二', '一', 'C210', 10001, 10001, 10001),
    ('一', '三', 'B222', 10002, 10001, 10002),
    ('三', '三', '信息实验室', 10000, 10000, 10000),
    ('三', '一', 'B301', 10002, 10000, 10001),
    ('二', '一', 'B207', 10002, 10000, 10000);