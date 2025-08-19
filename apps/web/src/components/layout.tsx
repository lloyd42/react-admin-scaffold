import {
	BugFilled,
	CaretDownFilled,
	ChromeFilled,
	CrownFilled,
	DoubleRightOutlined,
	GithubFilled,
	InfoCircleFilled,
	LogoutOutlined,
	PlusCircleFilled,
	QuestionCircleFilled,
	SearchOutlined,
	SmileFilled,
	TableOutlined,
	TabletFilled,
} from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import {
	PageContainer,
	// ProCard,
	ProConfigProvider,
	ProLayout,
	SettingDrawer,
} from "@ant-design/pro-components";
import { css } from "@emotion/css";
import { Link, Outlet, useRouter } from "@tanstack/react-router";
import {
	// Button,
	ConfigProvider,
	Divider,
	Dropdown,
	Input,
	Modal,
	Popover,
	theme,
} from "antd";
import { useMemo, useState } from "react";

const defaultProps = {
	route: {
		path: "/",
		routes: [
			{
				path: "/",
				name: "欢迎",
				icon: <SmileFilled />,
			},
			{
				path: "/admin",
				name: "管理页",
				icon: <CrownFilled />,
				access: "canAdmin",
				routes: [
					{
						path: "/admin/page1",
						name: "一级页面",
						icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
					},
					{
						path: "/admin/page2",
						name: "二级页面",
						icon: <CrownFilled />,
					},
					{
						path: "/admin/page3",
						name: "三级页面",
						icon: <CrownFilled />,
					},
				],
			},
			{
				name: "列表页",
				icon: <TabletFilled />,
				path: "/list",
				routes: [
					{
						path: "/list/sub",
						name: "列表页面",
						icon: <CrownFilled />,
						routes: [
							{
								path: "page1",
								name: "一一级列表页面",
								icon: <CrownFilled />,
							},
							{
								path: "page2",
								name: "一二级列表页面",
								icon: <CrownFilled />,
							},
							{
								path: "page3",
								name: "一三级列表页面",
								icon: <CrownFilled />,
							},
						],
					},
					{
						path: "/list/page1",
						name: "一级列表页面",
						icon: <CrownFilled />,
					},
					{
						path: "/list/page2",
						name: "二级列表页面",
						icon: <CrownFilled />,
					},
				],
			},
			{
				path: "/table",
				name: "表格页",
				icon: <TableOutlined />,
				routes: [
					{
						path: "/table/issue",
						name: "项目问题",
						icon: <BugFilled />,
					},
				],
			},
			{
				path: "https://ant.design",
				name: "Ant Design 官网外链",
				icon: <ChromeFilled />,
			},
		],
	},
	location: {
		pathname: "/",
	},
	appList: [
		{
			icon: "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
			title: "Ant Design",
			desc: "杭州市较知名的 UI 设计语言",
			url: "https://ant.design",
		},
		{
			icon: "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
			title: "AntV",
			desc: "蚂蚁集团全新一代数据可视化解决方案",
			url: "https://antv.vision/",
			target: "_blank",
		},
		{
			icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
			title: "Pro Components",
			desc: "专业级 UI 组件库",
			url: "https://procomponents.ant.design/",
		},
		{
			icon: "https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png",
			title: "umi",
			desc: "插件化的企业级前端应用框架。",
			url: "https://umijs.org/zh-CN/docs",
		},

		{
			icon: "https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png",
			title: "qiankun",
			desc: "可能是你见过最完善的微前端解决方案🧐",
			url: "https://qiankun.umijs.org/",
		},
		{
			icon: "https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg",
			title: "语雀",
			desc: "知识创作与分享工具",
			url: "https://www.yuque.com/",
		},
		{
			icon: "https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg",
			title: "Kitchen ",
			desc: "Sketch 工具集",
			url: "https://kitchen.alipay.com/",
		},
		{
			icon: "https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png",
			title: "dumi",
			desc: "为组件开发场景而生的文档工具",
			url: "https://d.umijs.org/zh-CN",
		},
	],
};

const SearchInput = () => {
	const { token } = theme.useToken();
	return (
		<div
			key="SearchOutlined"
			aria-hidden
			style={{
				display: "flex",
				alignItems: "center",
				marginInlineEnd: 24,
			}}
			onMouseDown={(e) => {
				e.stopPropagation();
				e.preventDefault();
			}}
		>
			<Input
				style={{
					borderRadius: 4,
					marginInlineEnd: 12,
					backgroundColor: token.colorBgTextHover,
				}}
				prefix={
					<SearchOutlined
						style={{
							color: token.colorTextLightSolid,
						}}
					/>
				}
				placeholder="搜索方案"
				variant="borderless"
			/>
			<PlusCircleFilled
				style={{
					color: token.colorPrimary,
					fontSize: 24,
				}}
			/>
		</div>
	);
};

const Item: React.FC<{ children: React.ReactNode }> = (props) => {
	const { token } = theme.useToken();
	return (
		<div
			className={css`color: ${token.colorTextSecondary}; 14px; cursor: pointer; line-height: 22px; margin-bottom: 8px; &:hover { color: font-size: ${token.colorPrimary}; }`}
			style={{
				width: "33.33%",
			}}
		>
			{props.children}
			<DoubleRightOutlined
				style={{
					marginInlineStart: 4,
				}}
			/>
		</div>
	);
};

const List: React.FC<{ title: string; style?: React.CSSProperties }> = (
	props,
) => {
	const { token } = theme.useToken();

	return (
		<div
			style={{
				width: "100%",
				...props.style,
			}}
		>
			<div
				style={{
					fontSize: 16,
					color: token.colorTextHeading,
					lineHeight: "24px",
					fontWeight: 500,
					marginBlockEnd: 16,
				}}
			>
				{props.title}
			</div>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
				}}
			>
				{new Array(6).fill(1).map((num, index) => {
					return <Item key={num + Math.random()}>具体的解决方案-{index}</Item>;
				})}
			</div>
		</div>
	);
};

const MenuCard = () => {
	const { token } = theme.useToken();
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
			}}
		>
			<Divider
				style={{
					height: "1.5em",
				}}
				type="vertical"
			/>
			<Popover
				placement="bottom"
				styles={{
					root: {
						width: "calc(100vw - 24px)",
						padding: "24px",
						paddingTop: 8,
						height: "307px",
						borderRadius: "0 0 6px 6px",
					},
				}}
				content={
					<div style={{ display: "flex", padding: "32px 40px" }}>
						<div style={{ flex: 1 }}>
							<List title="金融解决方案" />
							<List
								title="其他解决方案"
								style={{
									marginBlockStart: 32,
								}}
							/>
						</div>

						<div
							style={{
								width: "308px",
								borderInlineStart: `1px solid ${token.colorBorder}`,
								paddingInlineStart: 16,
							}}
						>
							<div
								className={css`14px; color: font-size: ${token.colorText}; line-height: 22px;`}
							>
								热门产品
							</div>
							{new Array(3).fill(1).map((name, _index) => {
								return (
									<div
										key={name + Math.random()}
										className={css`4px; padding: 16px; margin-top: 4px; display: flex; cursor: pointer; &:hover { background-color: border-radius: ${token.colorBgTextHover}; }`}
									>
										<img
											src="https://gw.alipayobjects.com/zos/antfincdn/6FTGmLLmN/bianzu%25252013.svg"
											alt="img"
										/>
										<div
											style={{
												marginInlineStart: 14,
											}}
										>
											<div
												className={css`14px; color: font-size: ${token.colorText}; line-height: 22px;`}
											>
												Ant Design
											</div>
											<div
												className={css`12px; color: font-size: ${token.colorTextSecondary}; line-height: 20px;`}
											>
												杭州市较知名的 UI 设计语言
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				}
			>
				<div
					style={{
						color: token.colorTextHeading,
						fontWeight: 500,
						cursor: "pointer",
						display: "flex",
						gap: 4,
						paddingInlineStart: 8,
						paddingInlineEnd: 12,
						alignItems: "center",
					}}
					className={css`&:hover { background-color: ${token.colorBgTextHover}; }`}
				>
					<span> 企业级资产中心</span>
					<CaretDownFilled />
				</div>
			</Popover>
		</div>
	);
};

function LayoutComponent() {
	const router = useRouter();

	const [modal, contextHolder] = Modal.useModal();

	const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
		fixSiderbar: true,
		layout: "mix",
		splitMenus: true,
	});

	const num = 32;
	// const minHeight = 500;

	const pathname = useMemo(() => {
		return router.latestLocation.pathname;
	}, [router.latestLocation.pathname]);

	if (typeof document === "undefined") {
		return <div />;
	}

	return (
		<div
			id="test-pro-layout"
			style={{
				height: "100vh",
				overflow: "auto",
			}}
		>
			<ProConfigProvider hashed={false}>
				<ConfigProvider
					getTargetContainer={() => {
						return document.getElementById("test-pro-layout") || document.body;
					}}
				>
					<ProLayout
						prefixCls="my-prefix"
						bgLayoutImgList={[
							{
								src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
								left: 85,
								bottom: 100,
								height: "303px",
							},
							{
								src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
								bottom: -68,
								right: -45,
								height: "303px",
							},
							{
								src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
								bottom: 0,
								left: 0,
								width: "331px",
							},
						]}
						{...defaultProps}
						location={{
							pathname: pathname,
						}}
						token={{
							header: {
								colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
							},
						}}
						siderMenuType="group"
						menu={{
							collapsedShowGroupTitle: true,
						}}
						avatarProps={{
							src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
							size: "small",
							title: "七妮妮",
							render: (_props, dom) => {
								return (
									<Dropdown
										menu={{
											items: [
												{
													key: "logout",
													icon: <LogoutOutlined />,
													label: "退出登录",
												},
											],
											onClick({ key }) {
												if (key === "logout") {
													modal.confirm({
														title: "退出登录",
														content: "确定要退出登录吗？",
														onOk() {
															localStorage.removeItem("token");
															router.invalidate();
														},
													});
												}
											},
										}}
									>
										{dom}
									</Dropdown>
								);
							},
						}}
						actionsRender={(props) => {
							if (props.isMobile) return [];
							if (typeof window === "undefined") return [];
							return [
								props.layout !== "side" && document.body.clientWidth > 1400 ? (
									<SearchInput key="SearchInput" />
								) : undefined,
								<InfoCircleFilled key="InfoCircleFilled" />,
								<QuestionCircleFilled key="QuestionCircleFilled" />,
								<GithubFilled key="GithubFilled" />,
							];
						}}
						headerTitleRender={(logo, title, _) => {
							const defaultDom = (
								<a href="/">
									{logo}
									{title}
								</a>
							);
							if (typeof window === "undefined") return defaultDom;
							if (document.body.clientWidth < 1400) {
								return defaultDom;
							}
							if (_.isMobile) return defaultDom;
							return (
								<>
									{defaultDom}
									<MenuCard />
								</>
							);
						}}
						menuFooterRender={(props) => {
							if (props?.collapsed) return undefined;
							return (
								<div
									style={{
										textAlign: "center",
										paddingBlockStart: 12,
									}}
								>
									<div>© 2021 Made with love</div>
									<div>by Ant Design</div>
								</div>
							);
						}}
						onMenuHeaderClick={(e) => console.log(e)}
						menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
						{...{
							fixSiderbar: true,
							layout: "mix",
							splitMenus: true,
						}}
					>
						<PageContainer
							token={{
								paddingInlinePageContainerContent: num,
							}}
							title={false}
						>
							{/* <ProCard
								style={{
									minHeight: minHeight,
								}}
							> */}
							<Outlet />
							{/* </ProCard> */}
						</PageContainer>

						<SettingDrawer
							// pathname={pathname}
							// enableDarkTheme
							getContainer={(e: unknown) => {
								if (typeof window === "undefined") return e;
								return document.getElementById("test-pro-layout");
							}}
							settings={settings}
							onSettingChange={(changeSetting) => {
								setSetting(changeSetting);
							}}
							disableUrlParams={true}
						/>
					</ProLayout>
				</ConfigProvider>
			</ProConfigProvider>
			{contextHolder}
		</div>
	);
}

export default LayoutComponent;
