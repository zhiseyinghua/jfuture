// elastic数据库请求接口
export interface DbElasticinterface {
  method: 'PUT' | 'POST' | 'DELETE' | 'GET' | 'HEAD';
  path: string;
  body?: any;
}

export interface dbinterface {
  hash:string,
  range:string,
  index:string
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
