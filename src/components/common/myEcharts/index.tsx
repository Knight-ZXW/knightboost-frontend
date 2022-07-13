import React, { FC } from 'react'
import ReactEcharts from 'echarts-for-react'

interface Props {
  option: object
  style?: object
}

const MyEcharts: FC<Props> = ({ option = {}, style = {} }) => {
  const options = {
    ...option,
    grid: {
      left: '8%',
      right: '8%',
      top: '6%',
      bottom: '8%'
    }
  }
  // @ts-ignore
  return <ReactEcharts option={options} style={style} />
}

export default MyEcharts
