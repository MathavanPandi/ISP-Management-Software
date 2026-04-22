-- Supabase SQL Schema for Mizaj ISP Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- 'Super Admin', 'Finance Manager', 'Support Lead', etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    role_id UUID REFERENCES roles(id),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ISP Providers Table
CREATE TABLE IF NOT EXISTS isp_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    support_contact TEXT,
    portal_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES isp_providers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    speed_mbps INTEGER NOT NULL,
    data_limit_gb INTEGER, -- NULL for unlimited
    price_base DECIMAL(10, 2) NOT NULL,
    validity_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider_id, name) -- Support upsert
);

-- 5. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    branch_type TEXT NOT NULL, -- 'Store', 'Office', 'Warehouse', etc.
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    isp_provider_id UUID REFERENCES isp_providers(id),
    plan_id UUID REFERENCES plans(id),
    account_id TEXT UNIQUE, -- ISP Account ID - Support upsert
    registered_mobile TEXT,
    registered_email TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Due Soon', 'Overdue', 'Disconnected', 'Hold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no TEXT UNIQUE NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    amount_base DECIMAL(10, 2) NOT NULL,
    tax_gst DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'overdue', 'refunded')),
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('UPI', 'Cash', 'Card', 'Bank Transfer')),
    transaction_id TEXT UNIQUE,
    gateway_ref TEXT,
    status TEXT DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed')),
    recorded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Payment Reconciliations Table
CREATE TABLE IF NOT EXISTS payment_reconciliations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    gateway_statement_id TEXT,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'matched' CHECK (status IN ('matched', 'mismatch', 'flagged')),
    discrepancy_notes TEXT,
    reconciled_by UUID REFERENCES auth.users(id)
);

-- 9. Approvals Table
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL, -- 'expense', 'manual_payment', 'discount', 'recharge'
    entity_id UUID NOT NULL,
    requested_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    comments TEXT,
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    report_type TEXT NOT NULL, -- 'GST', 'Revenue', 'Churn', 'Inventory', 'Audit'
    parameters JSONB,
    generated_by UUID REFERENCES auth.users(id),
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Attachments Table
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL, -- 'location_kyc', 'ticket_photo', 'expense_receipt'
    entity_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Notification Templates Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    trigger TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('Email', 'WhatsApp', 'Push')),
    subject TEXT,
    body TEXT NOT NULL,
    variables JSONB, -- Array of allowed variables
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES auth.users(id),
    template_id UUID REFERENCES notification_templates(id),
    title TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type TEXT NOT NULL, -- 'ONU', 'Router', 'Fiber Cable', etc.
    serial_no TEXT UNIQUE,
    mac_address TEXT UNIQUE,
    status TEXT DEFAULT 'In Stock' CHECK (status IN ('In Stock', 'Assigned', 'Faulty', 'Dead')),
    assigned_to_location_id UUID REFERENCES locations(id),
    assigned_to_user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Management Policies (Allow full access to authenticated users for now)
-- In a production app, you would restrict these to 'Super Admin' role check
CREATE POLICY "Full access to authenticated users" ON roles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON isp_providers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON locations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON payment_reconciliations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON approvals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON reports FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON attachments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON notification_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access to authenticated users" ON inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Initial Roles
INSERT INTO roles (name, description) VALUES 
('Super Admin', 'Full system access'),
('Finance Manager', 'Revenue and billing management'),
('Support Lead', 'Support and ticketing management'),
('Field Supervisor', 'Operations and network management'),
('Sales Exec', 'Lead and subscriber onboarding');

-- 15. Trigger for Automatic Profile Creation
-- This function will be called whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role_id)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        (SELECT id FROM public.roles WHERE name = 'Super Admin' LIMIT 1) -- Set default role to Super Admin for first user or similar
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
