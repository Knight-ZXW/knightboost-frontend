import { UserInfo } from '@/types/user'
import $axios from '@/utils/axios'


export default {
  // 获取数据
  login(params?: object): Promise<UserInfo> {
    return $axios.post('/login', params)
  }
}
