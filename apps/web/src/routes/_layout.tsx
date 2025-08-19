import { createFileRoute, redirect } from "@tanstack/react-router";
import LayoutComponent from "@/components/layout";

export const Route = createFileRoute("/_layout")({
	beforeLoad: ({ location }) => {
		const token = localStorage.getItem("token");
		if (!token) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: LayoutComponent,
});
