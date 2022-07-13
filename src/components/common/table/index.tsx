import {Table, TableProps} from 'antd'
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  ReactNode,
  FC
} from 'react'

import SearchView from '@/components/common/searchForm'
import useService from '@/utils/tableHook'
import type { ColumnsType,} from 'antd/es/table';
import {ColumnType, FilterValue} from "antd/lib/table/interface";
import {SorterResult} from "antd/es/table/interface";

/**
 * 封装列表、分页、多选、搜索组件
 * @param {RefType} ref 表格的实例，用于调用内部方法
 * @param {object[]} columns 表格列的配置
 * @param {function} apiFun 表格数据的请求方法
 * @param {object[]} searchConfigList 搜索栏配置
 * @param {function} beforeSearch 搜索前的操作（如处理一些特殊数据）
 * @param {function} onFieldsChange 处理搜索栏表单联动事件
 * @param {object} extraProps 额外的搜索参数（不在搜索配置内的）
 * @param {function} onSelectRow 复选框操作回调
 * @param {string} rowKey 表格行的key
 * @param {function} sortConfig 自定义表格排序字段
 * @param {function} expandedRowRender 额外的展开行
 * @param {function} onExpand 点击展开图标时触发
 * @param {string} rowClassName 表格行的样式名
 * @param {boolean} small 表格和分页的展示大小
 * @param {string[]} extraPagation 额外的分页大小
 */


export declare type AlignType = 'left' | 'center' | 'right';

interface MyTableProps {
  columns: ColumnType<any>[]
  apiFun: (arg0?: any) => Promise<any>
  ref?: RefType
  searchConfigList?: Record<string, any>[]
  extraProps?: Record<string, unknown>
  rowKey?: string
  rowClassName?: string
  small?: boolean
  showHeader?: boolean
  pageSizeOptions?: string[]
  beforeSearch?: (arg0?: unknown) => void
  onSelectRow?: (arg0?: string[], arg1?: string[]) => void
  onFieldsChange?: (arg0?: unknown, arg1?: unknown) => void
  sortConfig?: (arg0?: Record<string, string>) => any
  expandedRowRender?: () => ReactNode
  onExpand?: () => void
}

const MyTable: FC<MyTableProps> = forwardRef(
  (props: MyTableProps, ref: RefType) => {
    /**
     * @forwardRef
     * 引用父组件的ref实例，成为子组件的一个参数
     * 可以引用父组件的ref绑定到子组件自身的节点上.
     */
    const searchForm: RefType = useRef(null)
    const {
      columns,
      apiFun,
      searchConfigList,
      extraProps,
      rowKey,
      rowClassName,
      small,
      showHeader,
      pageSizeOptions,
      beforeSearch,
      onSelectRow,
      onFieldsChange,
      sortConfig,
      expandedRowRender,
      onExpand
    } = props

    // 搜索参数,如果有特殊需要处理的参数，就处理
    const searchObj = searchConfigList?.reduce(
      (prev: CommonObjectType, next: CommonObjectType) =>
        Object.assign(prev, {
          [next.key]: next.fn ? next.fn(next.initialValue) : next.initialValue
        }),
      {}
    )

    // 初始参数
    const initParams = {
      ...searchObj,
      ...extraProps,
      pageNum: 1,
      pageSize: 20
    }

    // 多选框的选择值
    const [selectedKeys, setSelectedKeys] = useState<any[]>([])
    // 列表所有的筛选参数（包括搜索、分页、排序等）
    const [tableParams, setTableParams] = useState(initParams)
    // 列表搜索参数
    const [searchParams, setSearchParams] = useState(searchObj)
    // 列表排序参数
    const [sortParams, setSortParams] = useState({})
    // 列表分页参数
    const [curPageNo, setCurPageNo] = useState(initParams.pageNum)
    const [curPageSize, setCurPageSize] = useState(initParams.pageSize)

    const { loading = false, response }: CommonObjectType = useService(
      apiFun as (arg0?: any) => Promise<{}>,
      tableParams
    )
    const { rows: tableData = [], total = -1 } = response || {}

    // 执行搜索操作
    const handleSearch = (val: object): void => {
      setSearchParams(val)
      setTableParams({ ...tableParams, ...val, pageNum: 1 })
    }



    // 重置列表部分状态
    const resetAction = (page?: number): void => {
      setSelectedKeys([])
      const nextPage = page || curPageNo
      const nextParmas = page === 1 ? {} : { ...searchParams, ...sortParams }
      setCurPageNo(nextPage)
      setTableParams({
        ...initParams,
        ...nextParmas,
        pageNum: nextPage,
        pageSize: curPageSize
      })
    }

    // 列表复选框选中变化
    const onSelectChange = (
      selectedRowKeys: any[],
      selectedRows: any[]
    ): void => {
      setSelectedKeys(selectedRowKeys)
      if (onSelectRow) {
        onSelectRow(selectedRowKeys, selectedRows)
      }
    }
    // 复选框配置
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: onSelectChange
    }
    // 判断是否有复选框显示
    const showCheckbox = onSelectRow ? { rowSelection } : {}

    // 展开配置
    const expendConfig = {
      expandedRowRender,
      onExpand,
      rowClassName
    }
    // 判断是否有展开行
    const showExpend = expandedRowRender ? expendConfig : {}

    // 表格和分页的大小
    const tableSize = small ? 'small' : 'middle'

    const paginationSize = small ? 'small' : 'default'


    // 分页、筛选、排序变化时触发
    const onChange: TableProps<any>['onChange'] = (pagination, filters, sorter, extra) => {
      console.log('params', pagination, filters, sorter, extra);
      // 如果有sort排序并且sort参数改变时，优先排序

      if (sorter instanceof Array){
        sorter.map(item=>{item.columnKey})
      }
      const  pageNum = pagination.current!
      const  pageSize = pagination.pageSize!

      setCurPageNo(pageNum!)
      setCurPageSize(pageSize!)
      setTableParams({
        ...initParams,
        ...searchParams,
        pageNum,
        pageSize
      })

    };

    // 分页、筛选、排序变化时触发
    // const onTableChange = (
    //   pagination: CommonObjectType,
    //   filters: Record<string,FilterValue | null>,
    //   sorter: Record<string, string>
    // ): void => {
    //   // 如果有sort排序并且sort参数改变时，优先排序
    //   const sortObj = sortConfig ? sortConfig(sorter) : {}
    //   setSortParams(sortObj)
    //
    //   const { current: pageNum, pageSize } = pagination
    //   setCurPageNo(pageNum)
    //   setCurPageSize(pageSize)
    //   setTableParams({
    //     ...initParams,
    //     ...searchParams,
    //     ...sortObj,
    //     pageNum,
    //     pageSize
    //   })
    // }

    /**
     * @useImperativeHandle
     * 第一个参数，接收一个通过forwardRef引用父组件的ref实例
     * 第二个参数一个回调函数，返回一个对象,对象里面存储需要暴露给父组件的属性或方法
     */
    useImperativeHandle(ref, () => ({
      // 更新列表
      update(page?: number): void {
        resetAction(page)
      },
      // 更新列表，并重置搜索字段
      resetForm(page?: number): void {
        if (searchForm.current) searchForm.current.resetFields()
        setSearchParams({})
        resetAction(page)
      },
      // 仅重置搜索字段
      resetField(field?: string[]): void {
        return field
          ? searchForm.current.resetFields([...field])
          : searchForm.current.resetFields()
      },
      // 获取当前列表数据
      getTableData(): CommonObjectType[] {
        return tableData
      }
    }))

    // @ts-ignore
    // @ts-ignore
    return (
      <div>
        {/* 搜索栏 */}
        {searchConfigList && searchConfigList.length > 0 && (
          <SearchView
            ref={searchForm}
            config={searchConfigList}
            beforeSearch={beforeSearch}
            handleSearch={handleSearch}
            onFieldsChange={onFieldsChange}
          />
        )}
        {/* 列表 */}
        <Table
          {...showCheckbox}
          {...showExpend}
          rowKey={rowKey}
          loading={loading}
          dataSource={tableData}
          columns={columns}
          onChange={onChange}
          size={tableSize}
          showHeader={showHeader}
          pagination={{
            size: paginationSize,
            total,
            pageSize: tableParams.pageSize,
            current: tableParams.pageNum,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions?pageSizeOptions:[10,20,50,],
            showTotal: (all) => `共 ${all} 条`
          }}
        />
      </div>
    )
  }
)

MyTable.defaultProps = {
  searchConfigList: [],
  ref: null,
  extraProps: {},
  rowKey: 'id',
  rowClassName: '',
  small: false,
  showHeader: true,
  pageSizeOptions: [],
  beforeSearch: () => {},
  onSelectRow: () => {},
  onFieldsChange: () => {},
  sortConfig: () => {},
  expandedRowRender: undefined,
  onExpand: () => {}
}

MyTable.displayName = 'MyTable'

export default MyTable
