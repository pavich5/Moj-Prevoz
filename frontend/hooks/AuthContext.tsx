import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDetails, updateUserTheme } from "../components/callApi";
import { UserDetails } from "../assets/types/types";
import { useRouter } from "expo-router";

interface AuthContextType {
  userId: string | null;
  userDetails: UserDetails | null;
  jwtToken: string | null;
  setUserId: (token: string | null) => void;
  setUserDetails: (details: UserDetails | null) => void;
  setJwtToken: (token: string | null) => void;
  isThemeWhite: boolean;
  toggleTheme: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserDetails = async (id: number) => {
    try {
      const fetchedUserDetails = await getUserDetails(id);
      setUserDetails({ ...fetchedUserDetails, id });
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };

  const initializeApp = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedJwtToken = await AsyncStorage.getItem("jwtToken");
      if (storedUserId) {
        setUserId(storedUserId);
        fetchUserDetails(Number(storedUserId));
      } else {
        console.log("No user ID found. Redirecting to login...");
        router.push("/login");
        return;
      }
      if (storedJwtToken) {
        setJwtToken(storedJwtToken);
      } else {
        console.log("No JWT token found. Redirecting to login...");
        router.push("/login");
        return;
      }
    } catch (error) {
      console.error("Failed to initialize app:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const handleSetUserId = async (id: string | null) => {
    setUserId(id);
    try {
      if (id) {
        await AsyncStorage.setItem("userId", String(id));
        fetchUserDetails(Number(id));
      } else {
        await AsyncStorage.removeItem("userId");
        setUserDetails(null);
      }
    } catch (error) {
      console.error("Failed to save userId to AsyncStorage", error);
    }
  };

  const handleSetJwtToken = async (token: string | null) => {
    setJwtToken(token);
    try {
      if (token) {
        await AsyncStorage.setItem("jwtToken", token);
      } else {
        await AsyncStorage.removeItem("jwtToken");
      }
    } catch (error) {
      console.error("Failed to save jwtToken to AsyncStorage", error);
    }
  };

  const toggleTheme = async () => {
      const newTheme = userDetails?.isThemeWhite ? "dark" : "light";
      const isThemeWhite = newTheme === "light";
      //@ts-ignore
      setUserDetails((prev) => ({ ...prev, isThemeWhite }));
      updateUserTheme(isThemeWhite, Number.parseInt(userId ?? ""));
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        userDetails,
        setUserId: handleSetUserId,
        setUserDetails,
        jwtToken,
        setJwtToken: handleSetJwtToken,
        isThemeWhite: userDetails?.isThemeWhite ?? true,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
