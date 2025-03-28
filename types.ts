export interface FormErrors {
    [key: string]: string | undefined;
  }

  export enum LandingPageRoutes{
    LOGIN = '/auth/login',
    SIGN_UP = '/auth/signup',
    DASHBOARD = '/dashboard',
    HOMEPAGE = '/',
    RESET_PASSWORD_REQUEST = '/auth/login/reset-password/request',
    RESET_PASSWORD = '/auth/login/reset-password',
    FORGOT_USER = '/auth/login/forgot-user'
  }
  
  export enum SignupRoutes {
    BASIC_DETAILS = '/auth/signup/step-one',
    ADDRESS_DEATILS = '/auth/signup/step-two',
    OTP_DEATAILS = '/auth/signup/step-three',
    PROFILE_DEATILS = '/auth/signup/step-four',
    REVIEW = '/auth/signup/review'
  }
  
  export enum DashboardRoutes {
    PROFILE = "/dashboard/profile",
    EDIT_PROFILE =  "/dashboard/profile/edit",
    KYC = "/dashboard/profile/edit/kyc"
  }