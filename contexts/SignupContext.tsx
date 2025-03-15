'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  NewSignUpInitialValuesType,
  NewSignUpType,
  newSignUpInitialValuesSchema,
} from '@/schemas';

const defaultDeal: NewSignUpInitialValuesType = {
  firstName: '',
  lastName: '',
  email: '',
  gender: undefined,
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  mobileNumber: '',
  otp: '',
  address_street: '',
  address_city: '',
  address_state: '',
  address_country: '',
  address_zipCode: '',
};



const LOCAL_STORAGE_KEY = 'multi-page-form-data';

type SignupContextType = {
  newSignUpData: NewSignUpInitialValuesType;
  updateNewDealDetails: (dealDetails: Partial<NewSignUpType>) => void;
  dataLoaded: boolean;
  resetLocalStorage: () => void;
};

export const SignupContext = createContext<SignupContextType | null>(null);

export const SignupContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [newSignUpData, setNewSignUpData] =
    useState<NewSignUpInitialValuesType>(defaultDeal);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(newSignUpData);
    }
  }, [newSignUpData, dataLoaded]);

  const updateNewDealDetails = useCallback(
    (dealDetails: Partial<NewSignUpType>) => {
      setNewSignUpData({ ...newSignUpData, ...dealDetails });
    },
    [newSignUpData]
  );

  const saveDataToLocalStorage = (
    currentDealData: NewSignUpInitialValuesType
  ) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDealData));
  };

  const readFromLocalStorage = () => {
    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return setNewSignUpData(defaultDeal);
    const validated = newSignUpInitialValuesSchema.safeParse(
      JSON.parse(loadedDataString)
    );

    if (validated.success) {
      setNewSignUpData(validated.data);
    } else {
      setNewSignUpData(defaultDeal);
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setNewSignUpData(defaultDeal);
  };

  const contextValue = useMemo(
    () => ({
      newSignUpData,
      dataLoaded,
      updateNewDealDetails,
      resetLocalStorage,
    }),
    [newSignUpData, dataLoaded, updateNewDealDetails]
  );

  return (
    <SignupContext.Provider value={contextValue}>
      {children}
    </SignupContext.Provider>
  );
};

export function useSignupContext() {
  const context = useContext(SignupContext);
  if (context === null) {
    throw new Error(
      'useSignupContext must be used within a SignupContextProvider'
    );
  }
  return context;
}
