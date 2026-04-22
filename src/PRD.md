# Product Requirement Document (PRD): NetRenew Central
## Centralized ISP Recharge & Due Date Management System

**Version:** 1.0  
**Status:** Implementation Ready  
**Date:** April 1, 2026

---

## 1. Project Overview
NetRenew Central is a specialized SaaS platform designed for multi-location enterprises to centralize the management of ISP (Internet Service Provider) connections, track renewal due dates, manage recharge approvals, and prevent internet downtime across branches, stores, and offices.

---

## 2. User Roles & Permission Matrix

| Feature / Module | Super Admin (HO IT) | IT Manager | Branch Manager | Finance / Accounts |
|------------------|---------------------|------------|----------------|--------------------|
| Dashboard        | Full View           | Full View  | Branch Only    | Financial View     |
| Location Master  | CRUD                | CRUD       | View Only      | View Only          |
| ISP Plan Master  | CRUD                | CRUD       | View Only      | View Only          |
| Due Tracker      | All Locations       | All        | Own Branch     | View Only          |
| Recharge Entry   | Yes                 | Yes        | Yes            | No                 |
| Approvals        | Final Approval      | Review     | No             | Payment Verify     |
| Reports          | All                 | All        | Own Branch     | Financial Only     |
| System Settings  | Yes                 | No         | No             | No                 |

---

## 3. Module Specifications

### 3.1 Dashboard (KPIs & Insights)
*   **Objective:** Provide a real-time snapshot of the network's renewal health.
*   **KPI Definitions:**
    *   **Total Locations:** Count of all active branch records.
    *   **Due in 3 Days:** Critical count of connections expiring within 72 hours.
    *   **Due in 7 Days:** Warning count of connections expiring within a week.
    *   **Overdue:** Count of connections where `Next Due Date < Current Date`.
    *   **Monthly Budget:** Sum of all active plan amounts normalized to monthly.
*   **Screen Behavior:** Interactive cards that filter the "Due Tracker" when clicked.

### 3.2 Due Tracker (Live Monitoring)
*   **Objective:** Actionable list of upcoming renewals.
*   **Fields:** Location Name, ISP, Account ID, Days Remaining, Amount, Status.
*   **Statuses:** `Active` (>7 days), `Due Soon` (1-7 days), `Overdue` (<0 days), `Recharge Pending`.
*   **User Actions:** 
    *   "Initiate Recharge" (Opens Recharge Entry Form).
    *   "Send Reminder" (Triggers Email/WhatsApp to Branch Manager).
*   **Screen Behavior:** Row highlighting (Red for Overdue, Yellow for Due Soon).

### 3.3 Location Master
*   **Objective:** Maintain a single source of truth for all physical sites.
*   **Fields:** 
    *   `Location ID`, `Name`, `Branch Type` (Store/Office/WH), `City`, `State`.
    *   `ISP Provider`, `Connection Type`, `Plan ID`.
    *   `Account ID`, `Registered Mobile`, `Registered Email`.
    *   `Admin Owner`, `Priority` (High/Med/Low), `Backup Available` (Y/N).
*   **Validations:** 
    *   Unique `Account ID` per ISP.
    *   Mandatory `Registered Mobile` (10 digits).
*   **Business Rules:** Every location must have at least one primary ISP assigned.

### 3.4 ISP & Plan Master
*   **Objective:** Catalog of approved vendors and their service offerings.
*   **Fields:** 
    *   Provider: `Name`, `Support Contact`, `Portal URL`, `Login Credentials` (Encrypted).
    *   Plan: `Plan Name`, `Bandwidth`, `Amount`, `Billing Cycle` (Monthly/Quarterly/Yearly).
*   **User Actions:** Bulk upload plans via CSV.

### 3.5 Payment Management & Integration (New)
*   **Objective:** Centralize all ISP payments with support for Indian payment methods and automated reconciliation.
*   **Supported Methods:**
    *   **UPI:** GPay, PhonePe, Paytm, BHIM.
    *   **Cards:** Debit/Credit (Visa, Mastercard, RuPay).
    *   **Net Banking:** All major Indian banks.
    *   **Manual:** Bank Transfer (NEFT/IMPS), Cash (with proof upload).
*   **Payment Statuses:** `Pending`, `Payment Initiated`, `Success`, `Failed`, `Cancelled`, `Pending Approval`, `Settled`.
*   **Business Rules:**
    1.  Successful payment automatically updates `lastRechargeDate` and `nextDueDate` based on the selected plan.
    2.  Duplicate payment prevention (lock transaction for 5 mins if same location/amount).
    3.  Manual bank transfers require UTR/Reference number and receipt upload for approval.
    4.  Failed payments trigger a "Retry" option and notify the IT admin.

### 3.6 Approvals Workflow
*   **Objective:** Multi-stage verification of recharge payments.
*   **Approval Logic:**
    1.  **Level 1 (IT Review):** Verify if the plan selected is correct.
    2.  **Level 2 (Finance):** Verify the payment proof/transaction ID against bank statement.
*   **Statuses:** `Draft` -> `Pending Review` -> `Pending Payment Verification` -> `Approved` -> `Completed`.

### 3.7 Recharge History
*   **Objective:** Audit trail of all financial transactions.
*   **Fields:** `Transaction ID`, `Location`, `Amount`, `Date`, `Payment Mode`, `Reference No`, `Proof Attachment`.
*   **Search & Filter:** Filter by Date Range, ISP, Location, and Status.

### 3.8 Reports & Analytics
*   **Objective:** Data-driven insights for budgeting and vendor performance.

### 3.9 Notification Templates (New)
*   **Objective:** Centralized management of automated communication content.
*   **Channels:** Email, WhatsApp, Push Notifications.
*   **Triggers:** Due Soon (T-3, T-1), Overdue (Day 0, Day +1), Payment Success, Payment Failed, Approval Required.
*   **Features:**
    *   Dynamic variables (e.g., `{location_name}`, `{due_date}`, `{amount}`).
    *   Subject line editing for Emails.
    *   Rich text/Markdown support for message bodies.
    *   Version history/Audit log of template changes.

---

## 4. Process Workflows

### 4.1 Recharge Entry Workflow
1.  User selects a location from "Due Tracker".
2.  System auto-populates Plan Amount and Account ID.
3.  User enters `Payment Mode` and `Transaction Reference`.
4.  User uploads `Payment Proof` (Image/PDF).
5.  On Submit, status changes to `Pending Approval`.
6.  Notification sent to IT Manager.

### 4.2 Overdue Escalation Workflow
*   **T-Minus 3 Days:** Email to Branch Manager.
*   **T-Minus 1 Day:** WhatsApp to Branch Manager + IT Manager.
*   **Day 0 (Due Date):** SMS to Admin Owner.
*   **Day +1 (Overdue):** Escalation Email to HO IT Head.

---

## 5. Technical Logic & Automation

### 5.1 Daily Due-Date Automation
*   **Trigger:** Daily at 00:01 AM.
*   **Logic:** 
    *   `Days Remaining = Next Due Date - Current Date`.
    *   Update `Location Status` based on `Days Remaining`.
    *   If `Days Remaining == 0` and `Status != 'Recharged'`, mark as `Overdue`.

### 5.2 Attachment Handling
*   **Storage:** Cloud Storage (S3/Firebase Storage).
*   **Naming Convention:** `RECH_{LocationID}_{Date}_{TXN_ID}.pdf`.
*   **Validation:** Max 5MB, formats: JPG, PNG, PDF.

### 5.3 Audit Log Format
| Timestamp | User | Action | Module | Old Value | New Value |
|-----------|------|--------|--------|-----------|-----------|
| 2026-04-01| IT_01| Update | Location| Plan A    | Plan B    |

---

## 6. Database Schema Overview (Conceptual)

### Table: `locations`
*   `id` (PK), `name`, `isp_id` (FK), `plan_id` (FK), `next_due_date`, `status`, etc.

### Table: `isp_providers`
*   `id` (PK), `name`, `support_phone`, `portal_url`.

### Table: `transactions`
*   `id` (PK), `location_id` (FK), `amount`, `txn_ref`, `proof_url`, `status`.

---

## 7. Screen Flow
1.  **Login** -> **Dashboard**
2.  **Dashboard** -> Click "Due Soon" -> **Due Tracker (Filtered)**
3.  **Due Tracker** -> Click "Recharge" -> **Recharge Form** -> **Success Message**
4.  **Sidebar** -> **Approvals** -> View Request -> **Approve/Reject**
5.  **Sidebar** -> **Location Master** -> Add/Edit Location.
