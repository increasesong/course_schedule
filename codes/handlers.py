# -*- coding: utf-8 -*-

import web
import datetime

class StudentRestHandler(web.RestHandler):
    def get(self, sn):
        sql = '''
        SELECT sn, name FROM student
        '''
        with self.db_cursor() as dc:
            if sn :
                sn = int(sn)
                sql += " WHERE sn=%s"
                dc.execute(sql, [sn])
                self.write_json(dc.fetchone_dict())
            else:
                sql += 'ORDER BY sn'
                dc.execute(sql)
                self.write_json(dc.fetchall_dicts())

    def post(self, sn):
        stu = self.read_json()
        with self.db_cursor() as dc:
            sql = '''
            INSERT INTO student 
                (name)
                VALUES(%s) RETURNING sn;
            '''
            dc.execute(sql, [stu.get('name')])
            sn = dc.fetchone()[0]
            stu['sn']=sn
            self.write_json(stu)

    def put(self, sn):
        stu = self.read_json()

        with self.db_cursor() as dc:
            sql = ''' 
            UPDATE student SET 
                name=%s
            WHERE sn=%s;
            '''
            dc.execute(sql, [stu['name'], sn])

        self.write_json(stu)

    def delete(self, sn):
        sn = int(sn)
        with self.db_cursor() as cur:
            sql = "DELETE FROM student WHERE sn= %s"
            cur.execute(sql, [sn])

class TeacherRestHandler(web.RestHandler):
    def get(self, tn):
        sql = '''
        SELECT tn, name FROM teacher
        '''
        with self.db_cursor() as dc:
            if tn :
                tn = int(tn)
                sql += " WHERE tn=%s"
                dc.execute(sql, [tn])
                self.write_json(dc.fetchone_dict())
            else:
                sql += 'ORDER BY tn'
                dc.execute(sql)
                self.write_json(dc.fetchall_dicts())

    def post(self, tn):
        stu = self.read_json()
        with self.db_cursor() as dc:
            sql = '''
            INSERT INTO teacher 
                (name)
                VALUES(%s) RETURNING tn;
            '''
            dc.execute(sql, [stu.get('name')])
            tn = dc.fetchone()[0]
            stu['tn']=tn
            self.write_json(stu)

    def put(self, tn):
        stu = self.read_json()

        with self.db_cursor() as dc:
            sql = ''' 
            UPDATE teacher SET 
                name=%s
            WHERE tn=%s;
            '''
            dc.execute(sql, [stu['name'], tn])

        self.write_json(stu)

    def delete(self, tn):
        tn = int(tn)
        with self.db_cursor() as cur:
            sql = "DELETE FROM teacher WHERE tn= %s"
            cur.execute(sql, [tn])

class CourseRestHandler(web.RestHandler):
    def get(self, cn):
        sql = '''
        SELECT cn, name, credit FROM course
        '''
        with self.db_cursor() as dc:
            if cn :
                cn = int(cn)
                sql += " WHERE cn=%s"
                dc.execute(sql, [cn])
                self.write_json(dc.fetchone_dict())
            else:
                sql += 'ORDER BY cn'
                dc.execute(sql)
                self.write_json(dc.fetchall_dicts())

    def post(self, cn):
        stu = self.read_json()
        with self.db_cursor() as dc:
            sql = '''
            INSERT INTO course 
                (name, credit)
                VALUES(%s, %s) RETURNING cn;
            '''
            dc.execute(sql, [stu.get('name'), stu.get('credit')])
            cn = dc.fetchone()[0]
            stu['cn']=cn
            self.write_json(stu)

    def put(self, cn):
        stu = self.read_json()

        with self.db_cursor() as dc:
            sql = ''' 
            UPDATE course SET 
                name=%s, credit=%s
            WHERE cn=%s;
            '''
            dc.execute(sql, [stu['name'], stu['credit'], cn])

        self.write_json(stu)

    def delete(self, cn):
        cn = int(cn)
        with self.db_cursor() as cur:
            sql = "DELETE FROM course WHERE cn= %s"
            cur.execute(sql, [cn])


class ScheduleRestHandler(web.RestHandler):
    def get(self, num):
        sql = '''
        SELECT sc.num, sc.day, sc.time, sc.classroom,
            sc.c_cn, c.name as cname, sc.t_tn,
            t.name as tname, sc.s_sn, s.name as sname
        FROM schedule as sc
        INNER JOIN course  as c  ON sc.c_cn = c.cn
        INNER JOIN teacher as t  ON sc.t_tn = t.tn
        INNER JOIN student as s  ON sc.s_sn = s.sn
        '''
        with self.db_cursor() as dc:
            if num :
                num = int(num)
                sql += " WHERE sc.num=%s"
                dc.execute(sql, [num])
                self.write_json(dc.fetchone_dict())
            else:
                sql += 'ORDER BY sc.num'
                dc.execute(sql)
                self.write_json(dc.fetchall_dicts())

    def post(self, num):
        stu = self.read_json()
        with self.db_cursor() as dc:
            sql = '''
            INSERT INTO schedule
                (day, time, classroom, c_cn, t_tn, s_sn)
                VALUES(%s, %s, %s, %s, %s, %s) RETURNING num;
            '''
            dc.execute(sql, [stu.get('day'), stu.get('time'),
            stu.get('classroom'), stu.get('c_cn'),
            stu.get('t_tn'), stu.get('s_sn')])
            num = dc.fetchone()[0]
            stu['num']=num
            self.write_json(stu)

    def put(self, num):
        stu = self.read_json()

        with self.db_cursor() as dc:
            sql = ''' 
            UPDATE schedule SET 
                day=%s, time=%s, classroom=%s, c_cn=%s, t_tn=%s, s_sn=%s
            WHERE num=%s;
            '''
            dc.execute(sql, [stu['day'], stu['time'], stu['classroom'], 
                stu['c_cn'], stu['t_tn'], stu['s_sn'], num])

        self.write_json(stu)

    def delete(self, num):
        num = int(num)
        with self.db_cursor() as cur:
            sql = "DELETE FROM schedule WHERE num= %s"
            cur.execute(sql, [num])