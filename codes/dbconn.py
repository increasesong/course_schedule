# -*- coding: utf-8 -*-

import collections
import logging

_logger = logging.getLogger('dbconn')

# 注册字符串缺省类型为unicode
import psycopg2.extensions
psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)
psycopg2.extensions.register_type(psycopg2.extensions.UNICODEARRAY)

import psycopg2.extras
import psycopg2.pool



_pg_conn_pools = {}

def register_dsn(dsn, pool_name=None, minconn=1, maxconn=20):
    '''注册数据库连接字符串'''
    pool = psycopg2.pool.ThreadedConnectionPool(
        minconn=minconn, maxconn=maxconn, dsn=dsn)
    _pg_conn_pools[pool_name] = pool


def _get_connection_pool(name=None):
    if name not in _pg_conn_pools :
        s = "You should register a dsn at first for '%s' pool"
        s %= (name if name else 'default')
        raise ConnectionError(s)

    return _pg_conn_pools[name]

class ConnectionError(LookupError):
    pass

class SimpleSqlBlock(object):
    '''
    进行简单数据库查询和事务操作。当遇到异常时，自动回滚操作。
    '''

    def __init__(self, pool_name=None, autocommit=False):
        self._pool = _get_connection_pool(pool_name)
        self.autocommit = autocommit
            
    def __del__(self):
        self._close()
        
    def __enter__(self):
        self._conn = self._pool.getconn()
        self._conn.autocommit = self.autocommit
        self._cursor = self._conn.cursor(
            cursor_factory=psycopg2.extras.NamedTupleCursor)

        if _logger.isEnabledFor(logging.DEBUG): 
            if hasattr(self._pool, '_used') and hasattr(self._pool, '_pool'):
                msg = "connection pool: %d idle, %d used" 
                msg %= (len(self._pool._pool), len(self._pool._used))
                _logger.debug(msg)

        return self

    def __exit__ (self, etyp, eval, tb):
        try :
            if not self.autocommit and eval :
                _logger.warning('An exception is caught, rollback!',  exc_info=True)
                self._conn.rollback()
            else:
                self._conn.commit()
        finally:
            self._close()

        return False
        
    def _close(self):
        if self._cursor: 
            self._cursor.close()

        if self._conn:
            self._pool.putconn(self._conn)
            self._conn = None
    
    def __iter__(self):
        self._cursor.__iter__()

    @property 
    def rowcount(sefl):
        self._cursor.rowcount

    @property 
    def rownumber(sefl):
        self._cursor.rowcount

    def execute(self, operation, parameters=None):
        self._cursor.execute(operation, parameters)

    def fetchall(self):
        ''' 获取所有数据，将各条记录转换成由元组(namedtuple)组成的列表'''
        return self._cursor.fetchall()
    def fetchall_dicts(self, dict_type=collections.OrderedDict):
        ''' 获取所有数据，并将各条记录转换成由字典组成的列表'''
        field_names = [d[0] for d in self._cursor.description]
        rows = []
        for r in self._cursor:
            rows.append(dict_type(zip(field_names, r)))
        return rows
    def fetchone(self):
        ''' 获取第一行的数据'''
        return self._cursor.fetchone()

    def fetchone_dict(self, dict_type=collections.OrderedDict):
        ''' 获取第一行的数据'''
        field_names = [d[0] for d in self._cursor.description]
        row = self._cursor.fetchone()
        return dict_type(zip(field_names, row))
