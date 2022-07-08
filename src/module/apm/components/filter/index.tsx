/* eslint-disable */
import React, {FC, ReactInstance, useEffect, useState} from 'react'

import styled from 'styled-components'
import {Card} from "antd";

export const FilterFormContainer = styled(Card)`
  display: flex;
  flex-direction: column;
`

export const FilterRow = styled('div')`
`
export const FilterRowWrapper =styled('div')`

`

export const FilterItemWrapper = styled('div')`
  display: block;
`
export const FilterLabelWrapper =styled('div')`
  font-size: 12px;
  line-height: 22px;
`

export interface Props {
  label:String,
  children: React.ReactNode
}

export const FilterItem:FC<Props> = (props:Props) => {
  const {label}= props
  return (<FilterItemWrapper>
      <FilterLabelWrapper>
        {props.label}
      </FilterLabelWrapper>
      {props.children}
  </FilterItemWrapper>)
}

