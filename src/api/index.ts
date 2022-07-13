import $axios from '@/utils/axios'

export default {
  // 获取数据
  getList(params?: Record<string, unknown>): Promise<CommonObjectType<string>> {
    return $axios.get('https://randomuser.me/api', params)
  }
}
