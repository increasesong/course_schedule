# -*- coding: utf-8 -*-

import tornado.ioloop
import tornado.web

import os
import web
import dbconn
dbconn.register_dsn("host=localhost dbname=scdb user=scdbo password=pass")

from handlers import *

settings = {
    "static_path": 'pages',
    "debug": True
}

import s_t_course.handlers

handlers = s_t_course.handlers.handlers + [
    (r"/s/student/([0-9]+)?", StudentRestHandler),
    (r"/s/teacher/([0-9]+)?", TeacherRestHandler),
    (r"/s/course/([0-9]+)?", CourseRestHandler),
    (r"/s/sc/([0-9]+)?", ScheduleRestHandler),
    (r'/(.*)', web.HtplHandler)
]

application = tornado.web.Application(handlers, **settings)


if __name__ == "__main__":
    import logging
    logging.basicConfig(
        format='%(asctime)s %(name)s:%(levelname)s:%(message)s', 
        datefmt='%H%M%S', level=logging.DEBUG)

    application.listen(8888)
    server = tornado.ioloop.IOLoop.instance()
    #tornado.ioloop.PeriodicCallback(lambda: None, 500, server).start()
    server.start()