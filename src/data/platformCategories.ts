import { t } from 'i18next'

export const mobile = [
  'android',
  'ios',
  // flutter引擎层问题
  'flutter',
  'react-native',
  // flutter dart层问题
  'dart-flutter'
] as const
const categoryList = [
  { id: 'mobile', name: t('Mobile'), platforms: mobile }
] as const

export type PlatformKey = typeof mobile[number] | 'other'

export default categoryList
