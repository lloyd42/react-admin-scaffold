import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, message, Space, Tag, Typography } from "antd";
import { debounce } from "es-toolkit";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { getTableList } from "./api";
import type { Table } from "./type";

export const waitTimePromise = async (time = 100) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
};

export const waitTime = async (time = 100) => {
	await waitTimePromise(time);
};

const { Link } = Typography;

const columns: ProColumns<Table>[] = [
	{
		dataIndex: "index",
		valueType: "indexBorder",
		width: 48,
	},
	{
		title: "标题",
		dataIndex: "title",
		copyable: true,
		ellipsis: true,
		tooltip: "标题过长会自动收缩",
		formItemProps: {
			rules: [
				{
					required: true,
					message: "此项为必填项",
				},
			],
		},
	},
	{
		disable: true,
		title: "状态",
		dataIndex: "state",
		width: 100,
		filters: true,
		// onFilter: true,
		ellipsis: true,
		valueType: "select",
		valueEnum: {
			all: { text: "超长".repeat(50) },
			open: {
				text: "未解决",
				status: "Error",
			},
			closed: {
				text: "已解决",
				status: "Success",
				disabled: true,
			},
			processing: {
				text: "解决中",
				status: "Processing",
			},
		},
	},
	{
		disable: true,
		title: "标签",
		dataIndex: "labels",
		width: 300,
		search: false,
		renderFormItem: (_, { defaultRender }) => {
			return defaultRender(_);
		},
		render: (_, record) => (
			<Space>
				{record.labels.map(({ name, color }) => (
					<Tag color={color} key={name}>
						{name}
					</Tag>
				))}
			</Space>
		),
	},
	{
		title: "创建时间",
		key: "showTime",
		dataIndex: "created_at",
		width: 100,
		valueType: "date",
		sorter: true,
		hideInSearch: true,
	},
	{
		title: "创建时间",
		dataIndex: "created_at",
		valueType: "dateRange",
		hideInTable: true,
		search: {
			transform: (value) => {
				return {
					startTime: value[0],
					endTime: value[1],
				};
			},
		},
	},
	{
		title: "操作",
		valueType: "option",
		key: "option",
		width: 120,
		render: (_text, record, _, action) => [
			<Link
				key="editable"
				onClick={() => {
					action?.startEditable?.(record.id);
				}}
			>
				编辑
			</Link>,
			<Link key="view">查看</Link>,
			<TableDropdown
				key="actionGroup"
				onSelect={() => action?.reload()}
				menus={[
					{ key: "copy", name: "复制" },
					{ key: "delete", name: "删除" },
				]}
			/>,
		],
	},
];

function TablePage() {
	const actionRef = useRef<ActionType>(null);

	const [messageApi, contextHolder] = message.useMessage();

	const num = 32;
	const minHeight = 500;
	const [contentHeight, setContentHeight] = useState(minHeight);
	const [scrollHeight, setScrollHeight] = useState<number | undefined>(
		undefined,
	);

	const calculateHeight = useCallback(() => {
		const layoutHeader = document.querySelector(
			".ant-layout-header",
		) as HTMLElement;
		const pageHeader = document.querySelector(
			".ant-page-header",
		) as HTMLElement;

		const layoutHeaderHeight = layoutHeader?.clientHeight || 0;
		// pageHeader 覆盖了 page padding，页面没有设置 pageHeader 就得算上 page padding
		const pageHeaderHeight = pageHeader?.clientHeight || num;
		const windowHeight = window.innerHeight;
		const padding = num;

		// 边界检查：确保高度不小于minHeight
		const calcHeight = Math.max(
			windowHeight - layoutHeaderHeight - pageHeaderHeight - padding,
			minHeight,
		);

		setContentHeight(calcHeight);
	}, []);

	const debouncedCalculate = useCallback(debounce(calculateHeight, 100), [
		calculateHeight,
	]);

	useLayoutEffect(() => {
		calculateHeight();

		window.addEventListener("resize", debouncedCalculate);

		return () => {
			window.removeEventListener("resize", debouncedCalculate);
			debouncedCalculate.cancel();
		};
	}, [calculateHeight, debouncedCalculate]);

	useLayoutEffect(() => {
		const targetElement = document.querySelector(
			".ant-pro-table-search-query-filter",
		) as HTMLElement;
		if (!targetElement) return;

		// 创建ResizeObserver实例
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newHeight = entry.contentRect.height;
				setScrollHeight(contentHeight - newHeight);
			}
		});

		resizeObserver.observe(targetElement);

		return () => {
			resizeObserver.unobserve(targetElement);
			resizeObserver.disconnect();
		};
	}, [contentHeight]);

	return (
		<div style={{ height: contentHeight }}>
			<ProTable<Table>
				columns={columns}
				actionRef={actionRef}
				cardBordered
				style={{
					height: contentHeight,
				}}
				request={async (params, sort, filter) => {
					console.log(params, sort, filter);
					const { current, pageSize, ...search } = params;

					const requestParams = {
						current,
						pageSize,
						...search, // 其它表单查询字段
						...sort, // 排序字段
						...filter, // 过滤字段
					};

					const data = await getTableList({ ...requestParams });

					if (!data.success) {
						messageApi.warning(data.msg);
					}

					return {
						data: data?.data || [],
						success: data?.success,
						total: data?.total,
					};
				}}
				onRequestError={(e) => {
					messageApi.error(e.message);
				}}
				editable={{
					type: "multiple",
				}}
				columnsState={{
					persistenceKey: "pro-table-singe-demos",
					persistenceType: "localStorage",
					defaultValue: {
						option: { fixed: "right", disable: true },
					},
					onChange(value) {
						console.log("value: ", value);
					},
				}}
				rowKey="id"
				search={{
					labelWidth: "auto",
				}}
				options={{
					setting: {
						listsHeight: 400,
					},
				}}
				pagination={{
					size: "default",
					showSizeChanger: true,
					defaultPageSize: 10,
				}}
				scroll={{ y: scrollHeight }}
				dateFormatter="string"
				headerTitle="高级表格"
				toolBarRender={() => [
					<Button
						key="button"
						icon={<PlusOutlined />}
						onClick={() => {
							actionRef.current?.reload();
						}}
						type="primary"
					>
						新建
					</Button>,
					<Dropdown
						key="menu"
						menu={{
							items: [
								{
									label: "1st item",
									key: "1",
								},
								{
									label: "2nd item",
									key: "2",
								},
								{
									label: "3rd item",
									key: "3",
								},
							],
						}}
					>
						<Button>
							<EllipsisOutlined />
						</Button>
					</Dropdown>,
				]}
			/>
			{contextHolder}
		</div>
	);
}

export default TablePage;
