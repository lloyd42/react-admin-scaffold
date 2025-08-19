import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/list/sub/")({
	beforeLoad: () => {
		throw redirect({
			to: "/list/sub/page1",
		});
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
