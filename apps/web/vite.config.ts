import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const base = env.VITE_APP_PUBLIC_PATH || "/";
	const isProduction = mode === "production";

	return {
		base,
		plugins: [
			tailwindcss(),
			tanstackRouter({}),
			react(),
			isProduction &&
			visualizer({
				open: true,
				gzipSize: true,
				brotliSize: true,
			}),
		].filter(Boolean),
		test: {
			environment: "jsdom",
			exclude: [...configDefaults.exclude, "e2e/*"],
			root: fileURLToPath(new URL("./", import.meta.url)),
			setupFiles: ["./setup.ts"],
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			open: true,
			host: true,
			port: 3001,
			proxy: {
				"/api": {
					target: "http://localhost:3000",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
					secure: false,
				},
			},
		},
		build: {
			target: "esnext",
			minify: "esbuild",
			sourcemap: !isProduction,
			cssCodeSplit: true,
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					manualChunks: {
						"vendor-core": ["react", "react-dom", "@tanstack/react-router"],
						"vendor-ui": ["antd", "@ant-design/pro-components", "@ant-design/cssinjs", "@emotion/css"],
						"vendor-utils": [
							"axios",
							"dayjs",
							"zustand",
							"@iconify/react",
							"@ant-design/icons"
						],
						"vendor-charts": ["echarts", "echarts-for-react"],
					},
				},
			},
		},
		optimizeDeps: {
			include: ["react", "react-dom", "@tanstack/react-router", "antd", "axios", "dayjs"],
			exclude: ["@iconify/react"],
		},
		esbuild: {
			drop: isProduction ? ["console", "debugger"] : [],
			legalComments: "none",
			target: "esnext",
		},
	};
});
