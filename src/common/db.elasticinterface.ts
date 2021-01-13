// elastic数据库请求接口
export interface DbElasticinterface {
  method: 'PUT' | 'POST' | 'DELETE' | 'GET' | 'HEAD';
  path: string;
  body?: any;
}

export interface DbElasticinterfacePutReturn {
  _index: string;
  _type: string;
  _id: string;
  _version: string;
  _seq_no: number;
  _primary_term: number;
  found?: boolean;
  _source?: any;
  result?: string;
  _shards?: {
    total: 2,
    successful: 1,
    failed: 0
  },
}
export interface DbElasticinterPutReturn {
  _index: string;
  _type: string;
  _id: string;
  _version: string;
  result?: string;
  _shards?: {
    total: 2,
    successful: 1,
    failed: 0
  },
  _seq_no: number;
  _primary_term: number;
}

export interface Dbinterface {
  hash: string;
  range: string;
  index: string;
}


/**
 * 查询多条数据返回的接口
 */
export interface Queryinterface {
    took: number;
    timed_out: false;
    _shards: {
      total: number;
      successful: number;
      skipped: number;
      failed: number;
    }
    ;
    hits: QueryinterfaceHit;
}

export interface Queryface {
  data: {
    took: number;
    timed_out: false;
    _shards: {
      total: number;
      successful: number;
      skipped: number;
      failed: number;
    }
    ;
    hits: QueryinterfaceHit;
  }
}
interface QueryinterfaceHit {
  total: {
    value: number;
    relation: string;
  };
  max_score: number,
  hits: QueryinterfaceHitList[]
}
interface QueryinterfaceHitList {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: any;
}

export interface DELETE{
  took: number,
  timed_out: false,
  total: number,
  deleted: number,
  batches: number,
  version_conflicts: number,
  noops: number,
retries: {
      bulk: number,
      search: number
  },
  throttled_millis: number,
  requests_per_second:number,
  throttled_until_millis: number,
  failures: []
}

/**
 * 这是一个公共的method接口
 */
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';
