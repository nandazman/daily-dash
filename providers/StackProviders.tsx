import { useNavigation } from "expo-router";
import React, { createContext, useContext, ReactNode } from "react";

type StackContextType = {
	action: {
		setNavigationVisibility: (_?: boolean) => void;
	};
};

const StackContext = createContext<StackContextType | undefined>(undefined);

type StackProviderProps = {
	children: ReactNode;
};

export const StackProviders = ({ children }: StackProviderProps) => {
	const navigation = useNavigation();

	if (!navigation) {
		throw new Error("useStack must be used within a Stack");
	}
	const action = {
		setNavigationVisibility: (state = false) => {
			navigation.setOptions({
				headerShown: state,
			});
		},
	};
	return (
		<StackContext.Provider value={{ action }}>{children}</StackContext.Provider>
	);
};

export const useStack = (): StackContextType => {
	const context = useContext(StackContext);

	if (!context) {
		throw new Error("useStack must be used within a StackProvider");
	}
	return context;
};
