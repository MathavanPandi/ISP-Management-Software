# UI/UX Screen Specifications: Mizaj ISP Management

**Design Language:** Modern SaaS, Clean, Data-Dense, High-Contrast.  
**Primary Colors:** Navy (#1A2B4C), Mizaj Orange (#FF6B00), Electric Blue (#007AFF).

---

## 1. Admin Dashboard
*   **Purpose:** High-level operational and financial health overview.
*   **User Role:** Super Admin, CXO.
*   **Layout:** Bento-grid style with top KPI cards and bottom charts.
*   **KPIs:** Total Revenue (MTD), New Subscribers (Today), Active Tickets, Churn Rate.
*   **Charts:** Weekly Revenue (Area Chart), Subscriber Growth (Bar Chart), Ticket Category Split (Pie Chart).
*   **Alerts:** "OLT-BLR-01 is Down", "50+ Invoices Overdue".
*   **Mobile:** Stacked widgets, horizontal scroll for charts.

## 2. Subscriber List
*   **Purpose:** Search and manage the entire customer base.
*   **User Role:** Support, Sales, Admin.
*   **Filters:** Status (Active/Suspended), Plan Type, Area, Franchise.
*   **Table Columns:** ID, Name, Status (Chip), Plan, Expiry Date, Balance (₹), Connection Type.
*   **Buttons:** "Onboard New", "Export CSV", "Bulk SMS".
*   **Empty State:** "No subscribers found. Start by adding a new connection."

## 3. Subscriber Profile (360 View)
*   **Purpose:** Deep dive into a single customer's history.
*   **User Role:** Support, Admin.
*   **Layout:** Left sidebar (Profile Summary), Right Tabs (Timeline, Billing, Tickets, Network, Inventory).
*   **Timeline:** Vertical feed of every login, payment, and ticket.
*   **Buttons:** "Renew Plan", "Change Speed", "Suspend", "Raise Ticket".
*   **Status Indicators:** Signal Strength (Green/Yellow/Red), Online/Offline status.

## 4. New Connection Form
*   **Purpose:** Onboard a new customer with KYC.
*   **User Role:** Sales Executive.
*   **Structure:** 4-Step Wizard (1. Personal Info, 2. Plan & Area, 3. KYC Upload, 4. Payment).
*   **Forms:** Name, Mobile, Aadhaar No, Plan Selection, Geo-location Picker.
*   **Validations:** Real-time mobile OTP verification, Aadhaar format check.
*   **Success State:** "Installation Ticket TKT-102 created and assigned to Rajesh."

## 5. Plan Recharge Screen
*   **Purpose:** Rapid renewal of existing plans.
*   **User Role:** Counter Staff, Franchise.
*   **Layout:** Search bar top, Plan cards middle, Payment summary right.
*   **Buttons:** "Pay via UPI QR", "Pay via Cash", "Apply Coupon".
*   **Alerts:** "Plan expires in 2 days. Renew now to avoid suspension."

## 6. Bill Payment Screen
*   **Purpose:** Record manual payments or generate links.
*   **User Role:** Finance, Collection Agent.
*   **Form:** Invoice Selection, Amount, Payment Mode, Reference No.
*   **Status Indicators:** "Payment Verified", "Pending Approval".
*   **Error State:** "Transaction ID already exists in the system."

## 7. Dues Dashboard
*   **Purpose:** Track outstanding payments and aging.
*   **User Role:** Finance Manager.
*   **KPIs:** Total Outstanding, 0-30 Days Dues, 30-60 Days Dues, 90+ Days Dues.
*   **Table Columns:** Subscriber, Days Overdue, Last Payment, Amount Due.
*   **Buttons:** "Send Bulk Reminders", "Assign for Collection".

## 8. Payment Reconciliation Screen
*   **Purpose:** Match gateway settlements with system records.
*   **User Role:** Finance Manager.
*   **Layout:** Split screen (System Records vs. Gateway Statement).
*   **Actions:** "Auto-Match", "Manual Reconcile", "Flag Discrepancy".
*   **Status:** Matched (Green), Mismatch (Red), Pending (Yellow).

## 9. Complaint Management Screen
*   **Purpose:** Manage support tickets.
*   **User Role:** Support Lead, Agent.
*   **Layout:** Kanban Board (Open, Assigned, In Progress, Resolved).
*   **Filters:** Priority, Category, Assigned Tech, SLA Status.
*   **Empty State:** "All clear! No open tickets for this area."

## 10. Ticket Detail View
*   **Purpose:** Resolve a specific complaint.
*   **User Role:** Support Agent, Technician.
*   **Layout:** Chat-style communication log between agent and customer.
*   **Buttons:** "Assign Tech", "Request Closure OTP", "Escalate to NOC".
*   **Forms:** Internal Notes, Resolution Summary.

## 11. Installation Task Screen
*   **Purpose:** Manage new fiber/wireless setups.
*   **User Role:** Field Supervisor.
*   **Table Columns:** Ticket ID, Customer, Area, Assigned Tech, Material Issued.
*   **Status:** Survey Pending, Feasible, Installation In Progress, Completed.

## 12. Engineer Mobile App Home
*   **Purpose:** Daily task management for field staff.
*   **User Role:** Technician.
*   **Layout:** Vertical list of tasks (Faults vs. Installations).
*   **KPIs:** Tasks Completed Today, Pending Tasks, Distance Traveled.
*   **Buttons:** "Start Navigation", "Call Customer", "Update Status".

## 13. Expense Entry Screen
*   **Purpose:** Track OPEX (Fuel, Rent, Repairs).
*   **User Role:** Admin, Branch Manager.
*   **Form:** Category, Amount, Date, Description, Receipt Upload.
*   **Status:** Pending Approval, Approved, Reimbursed.

## 14. Reports Dashboard
*   **Purpose:** Visual data analytics.
*   **User Role:** Admin, CXO.
*   **Layout:** Grid of charts (Revenue, Churn, New Sales, SLA Performance).
*   **Filters:** Date Range, Branch, Franchise.
*   **Buttons:** "Download PDF Report", "Schedule Email".

## 15. Audit Log Viewer
*   **Purpose:** System security and mutation tracking.
*   **User Role:** Super Admin.
*   **Table Columns:** Timestamp, User, Module, Action, Old Value, New Value, IP.
*   **Filters:** User, Module, Date.

## 16. Network Infrastructure Screen
*   **Purpose:** Manage OLTs, POPs, and Fiber.
*   **User Role:** NOC Engineer.
*   **Layout:** Map View with node status overlays.
*   **KPIs:** Total OLTs, Ports Available, Bandwidth Usage.
*   **Alerts:** "High Latency on BLR-POP-02".

## 17. Inventory Management Screen
*   **Purpose:** Track serialized stock (ONUs, Routers).
*   **User Role:** Store Manager.
*   **Table Columns:** Serial No, MAC, Item Type, Status (In Stock/Assigned/Faulty).
*   **Buttons:** "Inward Stock", "Issue to Tech", "Mark as Dead".

## 18. Franchise Dashboard
*   **Purpose:** Partner revenue and subscriber tracking.
*   **User Role:** Franchise Partner.
*   **KPIs:** My Subscribers, My Collection, My Commission.
*   **Charts:** Monthly Growth, Collection Trend.

## 19. Customer Self-Service Portal
*   **Purpose:** End-user account management.
*   **User Role:** Customer.
*   **Layout:** Clean mobile-first dashboard.
*   **Actions:** "Quick Recharge", "Raise Complaint", "Download Invoice".
*   **KPIs:** Days Remaining, Current Speed, Data Used.

## 20. Notification Template Settings
*   **Purpose:** Manage SMS/WhatsApp/Email templates.
*   **User Role:** Admin.
*   **Layout:** List of triggers (Activation, Expiry, etc.).
*   **Form:** Template Name, Channel, Message Body (with variables like {{name}}).
*   **Buttons:** "Send Test Message", "Save Template".
