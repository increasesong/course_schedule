# -*- coding: utf-8 -*-

import tornado.ioloop
import tornado.web

import web

BaseReqHandler = web.BaseHandler

class S_Handler(BaseReqHandler):
    def get(self, sn):
        with self.db_cursor() as cur:
            sql = '''
            SELECT c.cn, c.name as c_name, c.credit, 
                t.name as t_name, sc.day, sc.time, sc.classroom
            FROM schedule as sc
            INNER JOIN course  as c  ON sc.c_cn = c.cn
            INNER JOIN teacher as t  ON sc.t_tn = t.tn
            INNER JOIN student as s  ON sc.s_sn = s.sn
            WHERE s.sn = %s
            ORDER BY c_cn;
            '''
            sn = int(sn)
            cur.execute(sql, [sn])
            items = cur.fetchall()
        self.set_header("Content-Type", "text/html; charset=UTF-8")
        self.render("s_course.html", title="学生课程表", items=items)

class T_Handler(BaseReqHandler):
    def get(self, tn):
        with self.db_cursor() as cur:
            sql = '''
            SELECT c.cn, c.name as c_name, c.credit, 
                t.name as t_name, sc.day, sc.time, sc.classroom
            FROM schedule as sc
            INNER JOIN course  as c  ON sc.c_cn = c.cn
            INNER JOIN teacher as t  ON sc.t_tn = t.tn
            INNER JOIN student as s  ON sc.s_sn = s.sn
            WHERE t.tn = %s
            ORDER BY c_cn;
            '''
            tn = int(tn)
            cur.execute(sql, [tn])
            items = cur.fetchall()
        self.set_header("Content-Type", "text/html; charset=UTF-8")
        self.render("t_course.html", title="教师课程表", items=items)
        
handlers = [
    (r"/s_course/([0-9]+)?", S_Handler),
    (r"/t_course/([0-9]+)?", T_Handler)
]
