import { Form, Button } from 'antd'
import React, { forwardRef, useImperativeHandle, FC } from 'react'

interface SearchProps {
  config: Record<string, any>[]
  handleSearch: (arg0: object) => void
  ref: RefType
  beforeSearch?: (arg0: object) => void
  onFieldsChange?: (arg0: unknown, arg1?: unknown) => void
}

/**
 * React.forwardRef 会创建 一个React 组件，这个组件能够将其接收的ref属性
 * 转发到其组件树下的另一个组件中，这种技术并不常见，但在以下两种场景中特别有用：
 *  1.转发 refs 到 DOM 组件
 *  2.在高阶组件中转发 refs
 */
const SearchForm: FC<SearchProps> = forwardRef(
  (props: SearchProps, ref: RefType) => {
    const { config, handleSearch, beforeSearch, onFieldsChange } = props
    const [form] = Form.useForm()
    const getFields = (): JSX.Element[] => {
      return config.map((item: CommonObjectType) => {
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            rules={item.rules}
            style={{ marginBottom: '6px' }}
          >
            {item.slot}
          </Form.Item>
        )
      })
    }

    const emitSearch = (values: object): void => {
      // beforeSearch用于处理一些特殊情况
      if (beforeSearch) {
        beforeSearch(values)
      }
      handleSearch(values)
    }

    const initialValues = config.reduce(
      (prev: CommonObjectType, next: CommonObjectType) => ({
        ...prev,
        [next.key]: next.initialValue
      }),
      {}
    )

    // 实现渲染的父组件 可以调动 ref.current.resetFields
    useImperativeHandle(ref, () => ({
      // 重置搜索字段
      resetFields(fields: string[]) {
        return fields ? form.resetFields([...fields]) : form.resetFields()
      }
    }))

    return (
      <Form
        form={form}
        initialValues={initialValues}
        onFieldsChange={onFieldsChange}
        layout="inline"
        onFinish={emitSearch}
        style={{ marginBottom: 10 }}
      >
        {getFields()}
        <Form.Item>
          <Button htmlType="submit" type="primary">
            搜索
          </Button>
        </Form.Item>
      </Form>
    )
  }
)

SearchForm.defaultProps = {
  beforeSearch: () => {},
  onFieldsChange: () => {}
}

export default SearchForm
