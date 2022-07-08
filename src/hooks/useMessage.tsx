/* eslint-disable no-unused-vars */
import { Modal, message as Message, notification } from 'antd'
import { ModalFuncProps } from 'antd/es/modal'
import i18next from 'i18next'
import { isString } from '@/utils/is'
import React, { Component } from 'react'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled
} from '@ant-design/icons'
import { ModalFunc } from 'antd/es/modal/confirm'

export declare type NotificationPlacement =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
export declare type IconType = 'success' | 'info' | 'error' | 'warning'
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info'
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> &
  Pick<ModalOptionsEx, 'content'>

interface ConfirmOptions {
  info: ModalFunc
  success: ModalFunc
  error: ModalFunc
  warn: ModalFunc
  warning: ModalFunc
}

const getBaseOptions = () => {
  return {
    okText: i18next.t('common.okText'),
    centered: true
  }
}

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled className="modal-icon-warning" />
  }
  if (iconType === 'success') {
    return <CheckCircleFilled className="modal-icon-success" />
  }
  if (iconType === 'info') {
    return <InfoCircleFilled className="modal-icon-info" />
  }
  return <CloseCircleFilled className="modal-icon-error" />
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div>${content}</div>
  }
  return content
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
  const iconType = options.iconType || 'warning'
  Reflect.deleteProperty(options, 'iconType')
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    content: renderContent(options)
  }
  return Modal.confirm(opt) as unknown as ConfirmOptions
}

function createModalOptions(
  options: ModalOptionsPartial,
  icon: string
): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon)
  }
}

function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'))
}

function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'close'))
}

function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'))
}

function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'))
}
notification.config({
  placement: 'topRight',
  duration: 3
})
export function useMessage() {
  return {
    createMessage: Message,
    notification,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal
  }
}
