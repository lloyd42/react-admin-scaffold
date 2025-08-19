import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/admin/")({
	beforeLoad: () => {
		throw redirect({
			to: "/admin/page1",
		});
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
