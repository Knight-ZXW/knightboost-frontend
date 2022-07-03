import { useEffect, useState } from 'react'

const isClient = typeof window === 'object'
export const useLocalStorage = (key, initialValue, raw) => {
  if (!isClient) {
    return [initialValue, () => {}]
  }
  useState(() => {})
}
