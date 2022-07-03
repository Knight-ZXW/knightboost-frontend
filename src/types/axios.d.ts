export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

export interface RequestOptions {
  // Whether to process the request result
  isTransformResponse?: boolean
  // Whether to join url
  joinPrefix?: boolean
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // Error message prompt type
  errorMessageMode?: ErrorMessageMode
  ignoreCancelToken?: boolean
  // Whether to send token in header
  withToken?: boolean
  // 请求重试机制
  retryRequest?: RetryRequest
}

export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}
export interface Result<T = any> {
  code: number
  type: 'success' | 'error' | 'warning'
  message: string
  data: T
}
