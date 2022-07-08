// eslint-disable-next-line no-unused-vars
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import { AxiosTransform, CreateAxiosOptions } from '@/utils/http/axiosTransform'
import { AxiosCanceler } from '@/utils/http/axiosCancel'
import _, { isFunction } from 'lodash'
import { RequestOptions, Result } from '@/types/axios'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/httpEnum'
import qs from 'qs'
import { t } from 'i18next'

export class ApiClient {
  private axiosInstance: AxiosInstance

  private readonly options: CreateAxiosOptions

  constructor(options?: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptor()
  }

  // support form-data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' })
    }
  }

  get<T = any>(path: string, params?: any): Promise<T> {
    return this.request({
      url: path,
      method: RequestEnum.POST,
      params
    })
  }

  post<T = any>(path: string, data?: any): Promise<T> {
    return this.request({
      url: path,
      method: RequestEnum.POST,
      data
    })
  }

  private request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    let conf: CreateAxiosOptions = _.cloneDeep(config) as CreateAxiosOptions
    const { requestOptions, transform } = this.options
    const opt: RequestOptions = { ...requestOptions, ...options }
    const { beforeRequestHook, requestCatchHook, transformRequestHook } =
      transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    conf.requestOptions = opt

    conf = this.supportFormData(conf)
    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          // todo rename to transformResponseHook
          console.log('transformRequestHook is ', transformRequestHook)
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt))
            return
          }

          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }

          reject(e)
        })
    })
  }

  private setupInterceptor() {
    const { transform } = this.options
    if (!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = transform

    const axiosCanceler = new AxiosCanceler()

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const { ignoreCancelToken } = (config as CreateAxiosOptions)
          .requestOptions
        const ignoreCancel =
          ignoreCancelToken !== undefined
            ? ignoreCancelToken
            : this.options.requestOptions?.ignoreCancelToken

        if (!ignoreCancel) {
          axiosCanceler.addPending(config)
        }
        if (requestInterceptors && isFunction(requestInterceptors)) {
          config = requestInterceptors(config, this.options)
        }
        return config
      },
      undefined
    )

    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      )
    }

    // response result interceptor processing
    this.axiosInstance.interceptors.response.use((res: AxiosResponse) => {
      if (res) {
        axiosCanceler.removePending(res.config)
      }

      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        responseInterceptorsCatch(this.axiosInstance, error)
      })
    }
  }
}

function createDefaultTransform(): AxiosTransform {
  const transform: AxiosTransform = {
    transformRequestHook: (
      res: AxiosResponse<Result>,
      options: RequestOptions
    ) => {
      const { isTransformResponse } = options
      // 不进行任何处理，直接返回
      // 用于页面代码可能需要直接获取code，data，message这些信息时开启
      console.log('isTransformResponse , ', isTransformResponse)
      if (!isTransformResponse) {
        return res.data
      }
      const responseData = res.data
      if (!responseData) {
        // return '[HTTP] Request has no return value';
        throw new Error(t('sys.api.apiRequestFailed'))
      }

      //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
      const { code, data, message } = responseData
      // 这里逻辑可以根据项目进行修改
      const hasSuccess =
        responseData &&
        Reflect.has(responseData, 'code') &&
        code === ResultEnum.SUCCESS
      if (hasSuccess) {
        return data
      }
      // todo token 失效的全局处理

      throw new Error(t('sys.api.apiRequestFailed'))

      // not sucess handle
    }
  }
  return transform
}

// eslint-disable-next-line no-unused-vars
function createDefaultApiClient() {
  return new ApiClient({
    // baseURL: process.env.DEFAULT_API_BASE_URL,
    transform: createDefaultTransform(),
    requestOptions: {
      isTransformResponse: true
    }
  })
}

// eslint-disable-next-line no-unused-vars
export const MLApiClient = createDefaultApiClient()
