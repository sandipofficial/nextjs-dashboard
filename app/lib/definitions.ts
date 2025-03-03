// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Role = {
  id: string; // Unique Role ID
  name: "Customer" | "Admin" | "Accountant"; // Enum defining role names
  description?: string; // Optional description of role responsibilities
  createdAt: Date;
  updatedAt: Date;
};


export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  mobileNumber: string;
  dob: string;
  gender?: "Male" | "Female" | "Other";
  profilePictureUrl?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  roleId: string;
  role?: Role;
  kycStatus: "Pending" | "Verified" | "Rejected";
  panNumber?: string;
  preferredLanguage?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  isVerified: boolean;
  loginAttempts?: number;
  bankAccounts?: BankAccount[]; // One-to-Many Relationship
  savedCards?: string[];
};


export type BankAccount = {
  id: string; // Unique Bank Account ID
  userId: string; // Foreign key referencing User.id
  bankName: string;
  accountNumber: string; // Encrypted/Masked for security
  accountType: "Savings" | "Checking" | "Business";
  ifscCode?: string; // Used for Indian banks
  currency: string; // Currency of the bank account (USD, INR, etc.)
  isPrimary: boolean; // Whether this is the primary account
  createdAt: Date;
  updatedAt: Date;
  status: "Active" | "Inactive" | "Closed";
};



export type Customer = {
  id: string;
  userId: string; // Foreign key referencing User.id (owner of the customer)
  name: string;
  email: string;
  phoneNumber?: string;
  imageUrl?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  gstNumber?: string; // For tax purposes (India)
  taxId?: string; // For global tax compliance
  createdAt: Date;
  updatedAt: Date;
  status: "Active" | "Inactive"; // Customer status
};


export type Invoice = {
  id: string;
  customerId: string; // Foreign key referencing Customer.id
  amount: number; // Invoice total amount before tax & discount
  currency: string; // Currency of the transaction (USD, INR, etc.)
  date: Date; // Invoice issue date
  dueDate: Date; // Payment due date
  status: "pending" | "paid" | "overdue" | "canceled"; // Invoice payment status
  taxAmount?: number; // Tax applied to the invoice
  discountAmount?: number; // Discount applied, if any
  totalAmount: number; // Final payable amount after tax & discount
  paymentMethod?: "Credit Card" | "Bank Transfer" | "UPI" | "Cash"; // Payment method
  transactionId?: string; // Reference to payment transaction
  notes?: string; // Additional invoice notes
  createdAt: Date;
  updatedAt: Date;
};


export type Revenue = {
  id: string;
  userId: string; // Foreign key referencing User.id (business owner)
  month: string; // Format: YYYY-MM (e.g., "2024-03")
  totalRevenue: number; // Total revenue for the month
  currency: string; // Currency of the revenue (USD, INR, etc.)
  totalInvoices: number; // Number of invoices in the month
  paidInvoices: number; // Number of successfully paid invoices
  pendingInvoices: number; // Number of pending invoices
  taxCollected?: number; // Total tax collected
  discountGiven?: number; // Total discounts given
  createdAt: Date;
  updatedAt: Date;
};



