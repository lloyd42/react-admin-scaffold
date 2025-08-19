import {
	AlipayOutlined,
	LockOutlined,
	MobileOutlined,
	TaobaoOutlined,
	UserOutlined,
	WeiboOutlined,
} from "@ant-design/icons";
import {
	LoginFormPage,
	ProConfigProvider,
	ProFormCaptcha,
	ProFormCheckbox,
	ProFormText,
} from "@ant-design/pro-components";
import { useNavigate } from "@tanstack/react-router";
import { Button, Divider, message, Space, Tabs, theme } from "antd";
import { type CSSProperties, useState } from "react";
import { useCaptcha, usePhoneLogin, useUsernameLogin } from "./api";
import type { PostPhoneLoginParams, PostUsernameLoginParams } from "./type";

type LoginType = "phone" | "account";

const iconStyles: CSSProperties = {
	color: "rgba(0, 0, 0, 0.2)",
	fontSize: "18px",
	verticalAlign: "middle",
	cursor: "pointer",
};

function LoginPage() {
	const navigate = useNavigate();

	const [loginType, setLoginType] = useState<LoginType>("account");
	const { token } = theme.useToken();
	const [messageApi, contextHolder] = message.useMessage();
	// const queryClient = useQueryClient();

	const items = [
		{
			label: "账号密码登录",
			key: "account",
			children: <></>,
		},
		{
			label: "手机号登录",
			key: "phone",
			children: <></>,
		},
	];

	const {
		mutate: usernameLoginMutate,
		isPending: isUsernameLoginPending,
		error: usernameLoginError,
	} = useUsernameLogin();

	const {
		mutate: phoneLoginMutate,
		isPending: isPhoneLoginPending,
		error: phoneLoginError,
	} = usePhoneLogin();

	const {
		mutate: captchaMutate,
		isPending: isCaptchaPending,
		error: captchaError,
	} = useCaptcha();

	(usernameLoginError || phoneLoginError) &&
		messageApi.error(
			loginType === "account"
				? usernameLoginError?.message
				: phoneLoginError?.message,
		);

	captchaError && messageApi.error(captchaError.message);

	const handleFinish = (value: Record<string, any>) => {
		loginType === "account" &&
			usernameLoginMutate(value as PostUsernameLoginParams, {
				onSuccess(data) {
					console.log(data);
					if (!data.success) {
						messageApi.error(data.msg);
						return;
					}
					const { token } = data.data;
					localStorage.setItem("token", token);
					messageApi.success("登录成功", 1, () => {
						navigate({ to: "/" });
					});
					// queryClient.invalidateQueries({
					// 	queryKey: ["user", "profile"],
					// });
				},
			});
		loginType === "phone" &&
			phoneLoginMutate(value as PostPhoneLoginParams, {
				onSuccess(data) {
					if (!data.success) {
						messageApi.error(data.msg);
						return;
					}
					const { token } = data.data;
					localStorage.setItem("token", token);
					messageApi.success("登录成功");
					navigate({ to: "/" });
					// queryClient.invalidateQueries({
					// 	queryKey: ["user", "profile"],
					// });
				},
			});
	};

	const handleCaptcha = (phone: string) => {
		captchaMutate(
			{ phone },
			{
				onSuccess(data) {
					if (!data.success) {
						messageApi.error(data.msg);
						return;
					}
					messageApi.success("验证码已发送");
				},
			},
		);
	};

	return (
		<div
			style={{
				backgroundColor: "white",
				height: "100vh",
			}}
		>
			<LoginFormPage
				backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
				logo="https://github.githubassets.com/favicons/favicon.png"
				backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
				title="Github"
				containerStyle={{
					backgroundColor: "rgba(255, 255, 255,1)",
					// backdropFilter: "blur(4px)",
				}}
				subTitle="全球最大的代码托管平台"
				activityConfig={{
					style: {
						boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
						color: token.colorTextHeading,
						borderRadius: 8,
						backgroundColor: "rgba(255,255,255,0.25)",
						backdropFilter: "blur(4px)",
					},
					title: "活动标题，可配置图片",
					subTitle: "活动介绍说明文字",
					action: (
						<Button
							size="large"
							style={{
								borderRadius: 20,
								background: token.colorBgElevated,
								color: token.colorPrimary,
								width: 120,
							}}
						>
							去看看
						</Button>
					),
				}}
				actions={
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<Divider plain>
							<span
								style={{
									color: token.colorTextPlaceholder,
									fontWeight: "normal",
									fontSize: 14,
								}}
							>
								其他登录方式
							</span>
						</Divider>
						<Space align="center" size={24}>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									height: 40,
									width: 40,
									border: `1px solid ${token.colorPrimaryBorder}`,
									borderRadius: "50%",
								}}
							>
								<AlipayOutlined style={{ ...iconStyles, color: "#1677FF" }} />
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									height: 40,
									width: 40,
									border: `1px solid ${token.colorPrimaryBorder}`,
									borderRadius: "50%",
								}}
							>
								<TaobaoOutlined style={{ ...iconStyles, color: "#FF6A10" }} />
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									height: 40,
									width: 40,
									border: `1px solid ${token.colorPrimaryBorder}`,
									borderRadius: "50%",
								}}
							>
								<WeiboOutlined style={{ ...iconStyles, color: "#1890ff" }} />
							</div>
						</Space>
					</div>
				}
				onFinish={(value) => {
					console.log(value);
					handleFinish(value);
				}}
				loading={
					loginType === "account" ? isUsernameLoginPending : isPhoneLoginPending
				}
			>
				<Tabs
					centered
					activeKey={loginType}
					items={items}
					onChange={(activeKey) => setLoginType(activeKey as LoginType)}
				/>
				{loginType === "account" && (
					<>
						<ProFormText
							name="username"
							fieldProps={{
								size: "large",
								prefix: (
									<UserOutlined
										style={{
											color: token.colorText,
										}}
										className={"prefixIcon"}
									/>
								),
							}}
							placeholder={"用户名: admin or test"}
							rules={[
								{
									required: true,
									message: "请输入用户名!",
								},
							]}
						/>
						<ProFormText.Password
							name="password"
							fieldProps={{
								size: "large",
								prefix: (
									<LockOutlined
										style={{
											color: token.colorText,
										}}
										className={"prefixIcon"}
									/>
								),
							}}
							placeholder={"密码: demo1234"}
							rules={[
								{
									required: true,
									message: "请输入密码！",
								},
							]}
						/>
					</>
				)}
				{loginType === "phone" && (
					<>
						<ProFormText
							fieldProps={{
								size: "large",
								prefix: (
									<MobileOutlined
										style={{
											color: token.colorText,
										}}
										className={"prefixIcon"}
									/>
								),
							}}
							name="mobile"
							placeholder={"手机号"}
							rules={[
								{
									required: true,
									message: "请输入手机号！",
								},
								{
									pattern: /^1\d{10}$/,
									message: "手机号格式错误！",
								},
							]}
						/>
						<ProFormCaptcha
							fieldProps={{
								size: "large",
								prefix: (
									<LockOutlined
										style={{
											color: token.colorText,
										}}
										className={"prefixIcon"}
									/>
								),
							}}
							captchaProps={{
								size: "large",
								loading: isCaptchaPending,
							}}
							placeholder={"请输入验证码"}
							captchaTextRender={(timing, count) => {
								if (timing) {
									return `${count} ${"获取验证码"}`;
								}
								return "获取验证码";
							}}
							name="captcha"
							rules={[
								{
									required: true,
									message: "请输入验证码！",
								},
							]}
							onGetCaptcha={async (phone) => {
								handleCaptcha(phone);
							}}
						/>
					</>
				)}
				<div
					style={{
						marginBlockEnd: 24,
					}}
				>
					<ProFormCheckbox noStyle name="autoLogin">
						自动登录
					</ProFormCheckbox>
					<a
						href="/"
						style={{
							float: "right",
						}}
					>
						忘记密码
					</a>
				</div>
			</LoginFormPage>
			{contextHolder}
		</div>
	);
}

export default () => {
	return (
		<ProConfigProvider>
			<LoginPage />
		</ProConfigProvider>
	);
};
