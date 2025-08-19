import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/table/")({
	beforeLoad: () => {
		throw redirect({
			to: "/table/issue",
		});
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
