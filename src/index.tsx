import React from 'react'
import ReactDOM from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from '@/store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { loadOidcUser } from '@/config/oidc_setting'
import { setUserInfo } from '@/store/slicers/userSlice'
import { QueryClient, QueryClientProvider } from 'react-query'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import App from './App'
import './i18n'
import 'antd/dist/antd.variable.min.css' // antd默认样式文件
import './custom-dark.css'
import './custom-default.css'
import '@/assets/css/public.less' // 官方全部样式 ,但是可以通过变量控制
import '@/utils'
import './index.css'

moment.locale('zh-cn')

// https://mswjs.io/docs/getting-started/integrate/browser 浏览器环境MOCK

let appReady = Promise.resolve()

// Enable API mocking only in development
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const worker = require('./mocks/browser').default
  console.log('Mocking API...', worker)

  appReady = worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js' //  static in public/mockServiceWorker.js
    },
    onUnhandledRequest: 'bypass'
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

/**
 * Use deferred application mounting in order to work in a sandbox.
 * You MAY NOT need this in your application.
 * @see https://mswjs.io/docs/recipes/deferred-mounting
 */
appReady.then(async () => {
  await loadOidcUser(
    (provided) => provided && store.dispatch(setUserInfo(provided))
  )
  // const theme = useAppSelector(selectTheme)
  ReactDOM.render(
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider locale={zhCN} prefixCls="custom-default">
            <App />
          </ConfigProvider>
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>,
    document.getElementById('root')
  )
})
