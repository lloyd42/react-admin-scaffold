import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ConfigProvider } from "antd";
import type { AuthContext } from "../auth";
import "../index.css";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
	auth: AuthContext;
	queryClient: QueryClient;
}>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "react-admin-scaffold",
			},
			{
				name: "description",
				content: "react-admin-scaffold is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.png",
			},
		],
	}),
});

function RootComponent() {
	return (
		<>
			<ConfigProvider>
				<Outlet />
			</ConfigProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
