import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ConfigProvider } from "antd";
import type { AuthContext } from "../auth";
import "../index.css";
import { Spinner } from "@/components/spinner";

function RouterSpinner() {
	const isLoading = useRouterState({ select: (s) => s.status === "pending" });
	return <Spinner show={isLoading} />;
}

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
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	return (
		<>
			<HeadContent />
			<ConfigProvider>
				{isFetching ? <RouterSpinner /> : <Outlet />}
			</ConfigProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
