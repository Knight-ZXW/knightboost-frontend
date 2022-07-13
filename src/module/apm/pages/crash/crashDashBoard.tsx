import React, { FC } from 'react'

import {
  FilterFormContainer,
  FilterItem,
  FilterItemWrapper,
  FilterRowWrapper
} from '@/module/apm/components/filter'

export interface Props {}

export const CrashDashBoard: FC<Props> = (props) => {

  const layout = (
    <div>
      <FilterFormContainer>
        <FilterRowWrapper>
          <FilterItem label={'问题类型'}>{'xx'}</FilterItem>
        </FilterRowWrapper>
      </FilterFormContainer>
    </div>
  )

  return layout
}
