import * as React from "react";
import type { UserProfileResult } from "./components/layout";

export interface AuthContext {
	isAuthenticated: boolean;
	user: UserProfileResult | undefined;
	set: (value: UserProfileResult | undefined) => void;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<UserProfileResult | undefined>();
	const isAuthenticated = !!user;

	const set = React.useCallback((value: UserProfileResult | undefined) => {
		setUser(value);
	}, []);

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, set }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
