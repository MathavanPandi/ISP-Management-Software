# Product Requirement Document (PRD): Mizaj ISP Management System

**Version:** 1.0  
**Status:** Draft for Implementation  
**Target Market:** India (ISP/Broadband/FTTH)

---

## 1. Product Overview
Mizaj ISP is an enterprise-grade ERP designed to automate the end-to-end operations of an Internet Service Provider. It integrates sales (leads), operations (installation/network), finance (billing/GST), and support (ticketing) into a single source of truth.

---

## 2. User Roles & RBAC Matrix

| Role | Dashboard | Subscribers | Billing | Tickets | Inventory | Network | Admin Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Super Admin** | Full | Full | Full | Full | Full | Full | Full |
| **Finance Manager**| Revenue | View | Full | View | View | - | - |
| **Support Lead** | Support | View | - | Full | - | View | - |
| **Field Supervisor**| Ops | View | - | Assign | Full | Full | - |
| **Sales Exec** | Sales | Create | - | - | - | - | - |
| **Technician** | App Only| View | - | Update | Use | - | - |
| **Franchise/LCO** | Partner | Own Only | Own Only | Own Only | - | - | - |

---

## 3. Module Specifications

### 3.1 Subscriber Management
*   **Objective:** Centralized repository for all customer data and lifecycle states.
*   **Main Users:** Sales, Support, Admin.
*   **Key Fields:** Subscriber ID (Auto-gen), Name, Mobile (Primary/Alt), Email, Address (Geo-tagged), ID Proof (Aadhaar/PAN), Plan ID, Connection Type (FTTH/Wireless), OLT/Port Mapping, ONU Serial, MAC Address.
*   **Status Flow:** Lead $\rightarrow$ KYC Pending $\rightarrow$ Installation Pending $\rightarrow$ Active $\rightarrow$ Suspended (Overdue) $\rightarrow$ Disconnected $\rightarrow$ Terminated.
*   **Buttons/Actions:** Renew Plan, Change Plan, Suspend Manually, Terminate, View Timeline, Download KYC.
*   **Validations:** Mobile must be 10 digits; Email unique; MAC address format; Aadhaar 12 digits.
*   **Automation Rules:** 
    *   Auto-suspend at 00:00 on expiry.
    *   Auto-reactivate on payment success.
*   **Reports:** Active/Inactive list, Churn report, Area-wise density.

### 3.2 Billing & Payments (Indian Context)
*   **Objective:** GST-compliant invoicing and multi-channel payment collection.
*   **Main Users:** Finance, Customer, Collection Agent.
*   **Key Fields:** Invoice No, Date, Base Amount, GST (9% CGST + 9% SGST), Total, Payment Method (UPI/Card/Cash), Transaction ID, Gateway Ref.
*   **Status Flow:** Unpaid $\rightarrow$ Partially Paid $\rightarrow$ Paid $\rightarrow$ Overdue $\rightarrow$ Refunded.
*   **Buttons/Actions:** Generate Invoice, Record Manual Payment, Send Payment Link, Generate UPI QR, Print Receipt.
*   **Validations:** Negative amounts not allowed; Duplicate Transaction ID check.
*   **Automation Rules:** 
    *   Generate invoice 3 days before expiry.
    *   Send SMS reminder on invoice generation.
*   **Reports:** GST GSTR-1 ready report, Collection by Mode, Outstanding Aging.
*   **API Needs:** Razorpay/PhonePe/GPay Business APIs.

### 3.3 Complaint Management (Ticketing)
*   **Objective:** SLA-driven resolution of technical and non-technical issues.
*   **Main Users:** Support Agent, Technician, Customer.
*   **Key Fields:** Ticket ID, Category (No Internet/Slow/Fiber Cut), Priority (P1-P4), Assigned Tech, Root Cause, Resolution Notes, Closure OTP.
*   **Status Flow:** Open $\rightarrow$ Assigned $\rightarrow$ In Progress $\rightarrow$ Resolved $\rightarrow$ Closed.
*   **Buttons/Actions:** Assign, Reassign, Mark Resolved, Request Closure OTP, Escalate.
*   **Validations:** Cannot close without Resolution Notes; Root Cause mandatory for P1.
*   **SLA Matrix:** 
    *   Critical (P1): 4 Hours
    *   High (P2): 8 Hours
    *   Medium (P3): 24 Hours
*   **Automation Rules:** Auto-assign to nearest tech based on geo-location.

---

## 4. System Workflows & Logic

### 4.1 Subscription Billing Logic
1.  **Prepaid:** Payment first $\rightarrow$ Plan Start. If balance runs out, speed drops to FUP or Suspends.
2.  **Postpaid:** Usage period $\rightarrow$ Invoice generation at month-end $\rightarrow$ 7-day payment window $\rightarrow$ Suspension if unpaid.
3.  **FUP (Fair Usage Policy):** Once Data Limit (e.g., 3300GB) is reached, speed throttles from 100Mbps to 2Mbps.

### 4.2 Payment Reconciliation Logic
*   **Daily Sync:** Fetch gateway settlements $\rightarrow$ Match `gateway_ref` with system `transaction_id`.
*   **Exceptions:** If amount mismatch > ₹1, flag for manual review.
*   **Auto-Post:** If match found, update Subscriber Balance and mark Invoice as Paid.

---

## 5. Data Architecture (Table Suggestions)

### Table: `subscribers`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `miz_id` | String | Unique ISP ID (e.g., MIZ-1001) |
| `name` | String | Full Name |
| `status` | Enum | Active, Suspended, etc. |
| `plan_id` | UUID | FK to `plans` |
| `balance` | Decimal | Current wallet/dues balance |

### Table: `invoices`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `sub_id` | UUID | FK to `subscribers` |
| `amount_base` | Decimal | Before Tax |
| `tax_gst` | Decimal | 18% Total |
| `total` | Decimal | Final Payable |

---

## 6. UI/UX Layouts

### 6.1 Sidebar Menu Structure
*   **Dashboard** (Home)
*   **Sales** (Leads, Surveys)
*   **Operations** (Subscribers, Installations)
*   **Support** (Tickets, Mass Outages)
*   **Finance** (Invoices, Payments, Expenses)
*   **Network** (OLTs, POPs, IP Pools)
*   **Inventory** (Stock, Assets)
*   **Reports** (Analytics, GST)
*   **Settings** (Plans, Users, Templates)

### 6.2 Technician Mobile App Layout
*   **Home:** Today's Task Count (Installations vs. Faults).
*   **Task List:** Sorted by Priority and Distance.
*   **Task Detail:** Customer Name, Phone (Click to Call), Address (Open in Maps).
*   **Actions:** "Start Job" (Geo-tag), "Upload Photo", "Enter Closure OTP".
*   **Inventory:** View personal stock (ONUs, Patch cords).

---

## 7. Notification Event List
1.  **Welcome:** On Activation (Email/SMS).
2.  **Invoice:** 3 days before expiry (WhatsApp).
3.  **Expiry Alert:** On Suspension (SMS).
4.  **Payment Success:** Receipt link (WhatsApp).
5.  **Ticket Raised:** Ticket ID & ETA (SMS).
6.  **Tech Assigned:** Tech Name & Photo (WhatsApp).
7.  **Mass Outage:** Area-wide alert (App Push).

---

## 8. Audit Log Structure
Every mutation must log:
*   `timestamp`: ISO 8601
*   `user_id`: Who performed the action
*   `module`: e.g., "Billing"
*   `action`: e.g., "Manual_Credit"
*   `old_value`: JSON string
*   `new_value`: JSON string
*   `ip_address`: Source IP

---

## 9. Future AI Features
*   **Churn Prediction:** Flag users with >3 tickets in 30 days as "High Churn Risk".
*   **Predictive Maintenance:** Alert if OLT signal levels drop by >3dBm across 5+ users.
*   **Smart Bot:** Handle "How to pay?" and "Check my data usage" via WhatsApp AI.

---
**End of PRD**
