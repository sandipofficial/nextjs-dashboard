export interface FormErrors {
    [key: string]: string | undefined;
  }
  
  export enum SignupRoutes {
    BASIC_DETAILS = '/auth/signup/step-one',
    ADDRESS_DEATILS = '/auth/signup/step-two',
    OTP_DEATAILS = '/auth/signup/step-three',
    PROFILE_DEATILS = '/auth/signup/review',
  }
  