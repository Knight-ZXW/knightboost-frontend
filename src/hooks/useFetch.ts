import { useEffect, useReducer } from 'react'
import { AnyAction } from 'redux'
type FetchState = {
  data: any,
  loading: boolean,
  error: any
}

function dataReducer(state:FetchState, action:AnyAction):FetchState {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'response':
      return { ...state, loading: false, data: action.data }
    case 'error':
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

/**
 * Custom React hook around `window.fetch` to encapsulate loading, error,
 * and data states. Feel free to replace this with your request issuing client
 * (i.e. axios, react-query, Apollo).
 */
export function useFetch(url:RequestInfo|URL, options = {}) {
  const [{ loading, error, data }, dispatch] = useReducer(dataReducer, {
    data: null,
    loading: false,
    error: null
  })

  // Serialize the "fetch" options so it may become
  // a dependency to the "useEffect" below.
  const serializedOptions = JSON.stringify(options)
  useEffect(() => {
    dispatch({ type: 'loading' })

    fetch(url, JSON.parse(serializedOptions))
      .then((res) => {
        console.log(res.status, res.statusText)
        return res.json()
      })
      .then((_data) => dispatch({ type: 'response', data: _data }))
      .catch((_error) => dispatch({ type: 'error', error: _error }))
  }, [url, serializedOptions])

  return { loading, error, data }
}
