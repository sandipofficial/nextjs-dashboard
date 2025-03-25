import bcrypt from "bcryptjs";
import postgres from "postgres";
import { invoices, customers, revenue } from "../lib/placeholder-data";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in environment variables");
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

async function dropTables() {
  await sql`
    DROP TABLE IF EXISTS 
      revenue, invoices, bank_accounts, customers, users, user_roles 
    CASCADE;
  `;
}

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      mobile_number VARCHAR(20) NOT NULL,
      initials VARCHAR(10) NOT NULL,
      dob DATE NOT NULL,
      gender VARCHAR(10),
      profile_picture_url TEXT,
      address JSONB,
      role_id UUID NOT NULL,
      kyc_status VARCHAR(10) NOT NULL CHECK (kyc_status IN ('Pending', 'Verified', 'Rejected')),
      pan_number VARCHAR(20),
      preferred_language VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      last_login_at TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE,
      is_verified BOOLEAN DEFAULT FALSE,
      login_attempts INT DEFAULT 0,
      saved_cards TEXT[]
    );
  `;

  const hashedPassword = await bcrypt.hash("123456", 10);
  await sql`
    INSERT INTO users (
      first_name, last_name, email, password, mobile_number, initials, dob, gender, profile_picture_url,
      address, role_id, kyc_status, pan_number, preferred_language, created_at, updated_at, last_login_at,
      is_active, is_verified, login_attempts, saved_cards
    )
    VALUES (
      'Sandip', 'Gardi', 'user@nextmail.com', ${hashedPassword}, '9767062711', 'SG', '1995-05-10', 'Male', NULL,
      NULL, uuid_generate_v4(), 'Pending', NULL, 'English', NOW(), NOW(), NULL,
      TRUE, FALSE, 0, ARRAY[]::TEXT[]
    )
    ON CONFLICT (email) DO NOTHING;
  `;
}

async function seedBankAccounts() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      bank_name VARCHAR(255) NOT NULL,
      account_number TEXT NOT NULL,
      account_type VARCHAR(20) CHECK (account_type IN ('Savings', 'Checking', 'Business')) NOT NULL,
      ifsc_code VARCHAR(20),
      currency VARCHAR(10) NOT NULL,
      is_primary BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      status VARCHAR(10) CHECK (status IN ('Active', 'Inactive', 'Closed')) NOT NULL
    );
  `;
}

async function seedRoles() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(20) CHECK (name IN ('Customer', 'Admin', 'Accountant')) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await sql`
    INSERT INTO user_roles (name, description)
    VALUES 
      ('Customer', 'A regular customer with access to basic features.'),
      ('Admin', 'An administrator with full system control.'),
      ('Accountant', 'Manages financial records and transactions.')
    ON CONFLICT (name) DO NOTHING;
  `;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      date DATE NOT NULL,
      due_date DATE NOT NULL,
      status VARCHAR(10) NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'canceled')),
      tax_amount DECIMAL(10,2),
      discount_amount DECIMAL(10,2),
      total_amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(20) CHECK (payment_method IN ('Credit Card', 'Bank Transfer', 'UPI', 'Cash')),
      transaction_id TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone_number VARCHAR(20),
      image_url VARCHAR(255),
      street VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(100),
      country VARCHAR(100),
      zip_code VARCHAR(20),
      gst_number VARCHAR(50),
      tax_id VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      status VARCHAR(10) NOT NULL CHECK (status IN ('Active', 'Inactive'))
    );
  `;
}

async function seedRevenue() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      month VARCHAR(7) NOT NULL CHECK (month ~ '^[0-9]{4}-[0-9]{2}$'),
      total_revenue NUMERIC(15, 2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      total_invoices INT NOT NULL CHECK (total_invoices >= 0),
      paid_invoices INT NOT NULL CHECK (paid_invoices >= 0),
      pending_invoices INT NOT NULL CHECK (pending_invoices >= 0),
      tax_collected NUMERIC(15, 2),
      discount_given NUMERIC(15, 2),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      // Drop all tables in reverse order to avoid foreign key constraints
      await sql`DROP TABLE IF EXISTS revenue CASCADE`;
      await sql`DROP TABLE IF EXISTS invoices CASCADE`;
      await sql`DROP TABLE IF EXISTS customers CASCADE`;
      await sql`DROP TABLE IF EXISTS bank_accounts CASCADE`;
      await sql`DROP TABLE IF EXISTS users CASCADE`;
      await sql`DROP TABLE IF EXISTS user_roles CASCADE`;

      // Seed all tables again
      await seedRoles();
      await seedUsers();
      await seedBankAccounts();
      await seedCustomers();
      await seedInvoices();
      await seedRevenue();
    });

    return Response.json(
      { message: "Database reset and seeded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while resetting database:", error);
    return Response.json({ error }, { status: 500 });
  }
}

GET();
