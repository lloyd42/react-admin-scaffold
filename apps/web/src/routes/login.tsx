import { createFileRoute } from "@tanstack/react-router";
import LoginComponent from "@/pages/login";

export const Route = createFileRoute("/login")({
	component: LoginComponent,
});
