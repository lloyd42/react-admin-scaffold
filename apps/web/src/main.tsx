import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRouter,
	ErrorComponent,
	RouterProvider,
} from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth } from "./auth";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { worker } from "./mocks/browser";
import "dayjs/locale/zh-cn";

await worker.start({
	onUnhandledRequest: "bypass",
	serviceWorker: { url: "/mockServiceWorker.js" },
});

export const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultPendingComponent: () => <Loader />,
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	context: {
		auth: undefined!,
		queryClient,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function InnerApp() {
	const auth = useAuth();
	return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
	return (
		<AuthProvider>
			<InnerApp />
		</AuthProvider>
	);
}

const rootElement = document.getElementById("app") as HTMLDivElement;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		// <React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider locale={zhCN}>
				<App />
			</ConfigProvider>
		</QueryClientProvider>,
		// </React.StrictMode>,
	);
}
