import { createFileRoute } from "@tanstack/react-router";
import TablePage from "@/pages/table";

export const Route = createFileRoute("/_layout/table/issue")({
	component: TablePage,
});
