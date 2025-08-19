import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/list/")({
	beforeLoad: () => {
		throw redirect({
			to: "/list/sub",
		});
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
