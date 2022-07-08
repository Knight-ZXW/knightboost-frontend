import $axios from '@/utils/axios'
import { UserInfo } from '@/types/user'

export default {
  // 获取数据
  login(params?: object): Promise<UserInfo> {
    return $axios.post('/login', params)
  }
}
