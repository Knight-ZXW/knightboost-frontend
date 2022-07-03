import { AxiosResponse } from 'axios'
import { RequestOptions, Result } from '@/types/axios'
import i18next from '@/i18n'
import { ContentTypeEnum, ResultEnum } from '@/enums/httpEnum'
import { clone, isObject, isString } from 'lodash'
import { checkStatus } from '@/utils/http/checkStatus'
import { VAxios } from '@/utils/http/VAxios'
import { AxiosTransform, CreateAxiosOptions } from './axiosTransform'

const { t } = i18next

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const { isTransformResponse } = options

    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data
    }
    // 错误的时候返回

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

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = ''
    switch (code) {
      case ResultEnum.TIMEOUT: // 网关超时处理
        timeoutMsg = t('sys.api.timeoutMessage')
        break
      default:
        if (message) {
          timeoutMsg = message
        }
    }
    // todo 提示错误消息？
    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'))
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, urlPrefix } = options

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }

    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  // eslint-disable-next-line no-unused-vars
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    // const token = getToken()
    // if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
    //   // jwt token
    //   // todo 修改为 Authorization
    //   ;(config as Recordable).headers.token = options.authenticationScheme
    //     ? `${options.authenticationScheme} ${token}`
    //     : token
    // }

    // todo 添加全局 jwt token
    return config
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosResponse, error: any) => {
    // const errorLogStore = useErrorLogStoreWithOut()
    // errorLogStore.addAjaxErrorInfo(error)

    const { response, code, message } = error || {}
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage')
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg')
      }

      if (errMessage) {
        // if (errorMessageMode === 'modal') {
        //   createErrorModal({
        //     title: t('sys.api.errorTip'),
        //     content: errMessage
        //   })
        // } else if (errorMessageMode === 'message') {
        //   createMessage.error(errMessage)
        // }
        return Promise.reject(error)
      }
    } catch (unexpectError) {
      throw new Error(unexpectError as unknown as string)
    }

    checkStatus(error?.response?.status, msg)

    // TODO 添加自动重试机制 保险起见 只针对GET请求
    return Promise.reject(error)
  }
}

function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (key in target) {
    src[key] = isObject(src[key])
      ? deepMerge(src[key], target[key])
      : (src[key] = target[key])
  }
  return src
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: 'Bearer ',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: '',
          // 接口拼接地址
          urlPrefix: '',
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100
          }
        }
      },
      opt || {}
    )
  )
}

export const defHttp = createAxios()
