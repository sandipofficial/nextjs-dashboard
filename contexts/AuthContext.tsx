"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NewSignUpInitialValuesType,
  NewSignUpType,
  newSignUpInitialValuesSchema,
  LoginInitialValuesType,
  LoginType,
  LoginInitialValuesSchema,
} from "@/schemas";

const SIGNUP_STORAGE_KEY = "multi-page-signup-data";
const LOGIN_STORAGE_KEY = "multi-page-login-data";

const defaultSignupData: NewSignUpInitialValuesType = {
  firstName: "",
  lastName: "",
  email: "",
  gender: undefined,
  password: "",
  confirmPassword: "",
  dob: "",
  mobileNumber: "",
  otp: "",
  address_street: "",
  address_city: "",
  address_state: "",
  address_country: "",
  address_zipCode: "",
};

const defaultLoginData: LoginInitialValuesType = {
  email: "",
  password: "",
};

// AuthContext Type
type AuthContextType = {
  newSignUpData: NewSignUpInitialValuesType;
  updateNewSignUpData: (data: Partial<NewSignUpType>) => void;
  loginData: LoginInitialValuesType;
  updateLoginData: (data: Partial<LoginType>) => void;
  dataLoaded: boolean;
  resetAuthStorage: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [newSignUpData, setNewSignUpData] =
    useState<NewSignUpInitialValuesType>(defaultSignupData);
  const [loginData, setLoginData] =
    useState<LoginInitialValuesType>(defaultLoginData);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    readAuthDataFromStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveAuthDataToStorage();
    }
  }, [newSignUpData, loginData, dataLoaded]);

  const updateNewSignUpData = useCallback((data: Partial<NewSignUpType>) => {
    setNewSignUpData((prev) => ({ ...prev, ...data }));
  }, []);

  const updateLoginData = useCallback((data: Partial<LoginType>) => {
    setLoginData((prev) => ({ ...prev, ...data }));
  }, []);

  const saveAuthDataToStorage = () => {
    localStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(newSignUpData));
    localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginData));
  };

  const readAuthDataFromStorage = () => {
    const signupDataString = localStorage.getItem(SIGNUP_STORAGE_KEY);
    const loginDataString = localStorage.getItem(LOGIN_STORAGE_KEY);

    if (signupDataString) {
      const validatedSignup = newSignUpInitialValuesSchema.safeParse(
        JSON.parse(signupDataString)
      );
      setNewSignUpData(
        validatedSignup.success ? validatedSignup.data : defaultSignupData
      );
    }

    if (loginDataString) {
      const validatedLogin = LoginInitialValuesSchema.safeParse(
        JSON.parse(loginDataString)
      );
      setLoginData(
        validatedLogin.success ? validatedLogin.data : defaultLoginData
      );
    }
  };

  const resetAuthStorage = () => {
    localStorage.removeItem(SIGNUP_STORAGE_KEY);
    localStorage.removeItem(LOGIN_STORAGE_KEY);
    setNewSignUpData(defaultSignupData);
    setLoginData(defaultLoginData);
  };

  const contextValue = useMemo(
    () => ({
      newSignUpData,
      updateNewSignUpData,
      loginData,
      updateLoginData,
      dataLoaded,
      resetAuthStorage,
    }),
    [newSignUpData, loginData, dataLoaded, updateNewSignUpData, updateLoginData]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}
