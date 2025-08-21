import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import LoginComponent from "@/pages/login";

export const Route = createFileRoute("/login")({
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
	beforeLoad: ({ context, search }) => {
		const token = localStorage.getItem("token");
		if (!token) {
			sessionStorage.clear();
		}
		if (context.auth.isAuthenticated) {
			throw redirect({ to: search.redirect || "/" });
		}
	},
	component: LoginComponent,
});
