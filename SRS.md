<div align="center">

# SOFTWARE REQUIREMENTS SPECIFICATION

## School Fee Verification System

<br/><br/>

Prepared by:<br/>
**Priyanshu Agrawal**<br/>
**Roll No:** [Insert Roll Number]

<br/><br/>

| Field | Details |
| :--- | :--- |
| **Project Title** | School Fee Verification System |
| **Document Type** | Software Requirements Specification (SRS) |
| **Technology Stack** | React.js (Frontend), Node.js & Express (Backend), MongoDB |
| **Application Type** | Web Application |
| **Date** | April 2, 2026 |
| **Version** | 1.0 |
| **Status** | Draft |

</div>

<div style="page-break-after: always"></div>

## 1. Introduction

### Purpose
The main purpose of this document is to outline the plans and requirements for our School Fee Verification System. This document serves as a blueprint written before we start coding. It will explain exactly what problem we want to solve and how different users will interact with the new platform. 

### Scope
We are building a web-based portal to make paying and verifying school fees much easier. Usually, schools either manually check payment receipts or use payment gateways like Razorpay. However, real payment gateways charge a percentage fee for every transaction, which isn't ideal for a college project or a small school. Instead, our project will let students upload a screenshot of their normal bank or UPI transfer. The school will then upload their official bank statement or passbook, and our system will match the records automatically to verify the payment. 

### Definitions
- **QR Code:** A scannable barcode we will use so students can log in without typing passwords.
- **Passbook / Bank Statement:** A document provided by the bank showing a list of recent transactions.
- **Payment Verification:** The process of checking if the money sent by the student actually reached the school's bank account.

## 2. Overall System Description

### Product Perspective
This system will be an independent, standalone web application. We plan to build the front end using React so it feels fast, and run a Node.js server on the backend to handle the logic. Everything will be stored in a MongoDB database so we don't have to worry about traditional table setups.

### Product Functions
The main functions we have planned are:
- A quick login method using QR codes.
- Profiles to manage student information properly.
- A fee submission page for uploading screenshots.
- An admin portal for uploading the master bank passbook.
- An automatic checker that compares student screenshots against the passbook.
- An attendance tracker allowing teachers to securely mark student attendance.

### User Classes
There will be three primary types of users:
1. **Admin (School Management):** They will have a special dashboard where they can upload the bank passbook. They manage student records and review pending fee statuses.
2. **Teachers:** They will have their own dashboard so they can interact with the system, such as marking attendance for their assigned classes or viewing relevant student data.
3. **Students:** They will have a simpler dashboard. They log in to check how much fee is due, and they use the system to upload screenshots of their payments.

### Operating Environment
Because this is going to be a web application, people won't need to install any heavy software. They will just need an internet browser like Google Chrome or Safari. We plan to make it mobile-friendly too, since many students will use their phones to upload the screenshots.

## 3. System Features

### QR Code Based Login
Instead of writing an email and password every time, we will create a system where students can just scan a QR code from their phone camera to enter their dashboard instantly. This will save a lot of time.

### Student Dashboard
Once a student logs in, they will see a summary page. We will display basic details like their name, the total fee amount due, and their current payment status (like "Pending" or "Paid"). 

### Upload Fee Payment Screenshot
Students will have a dedicated page where they can report a payment. Whether they paid through UPI, NEFT, or standard bank transfer, they will just take a screenshot of the digital receipt and upload the image file to the portal. 

### Admin Dashboard for School
Admins will get their own secure screen. Here they will see a list of all students and their statuses. It is designed to give the school management a clear view of who has paid and who hasn't.

### Upload Bank Passbook
Rather than integrating complex payment gateways, the school's admin will simply download the daily transaction history (statement or passbook) from their bank and upload that file to the admin dashboard. 

### Automatic Payment Verification
This will be the core logic of our project. When the admin uploads the passbook, the backend will scan through the entries and automatically cross-check them against the screenshots and payment details provided by the students. If a match is found, the system will automatically update the student's record.

### Payment Status Tracking
Both admins and students will be able to see the status. If the system couldn't verify the payment automatically, it will remain "Pending", and the admin might need to review it. If it successfully matches, it will change to "Paid".

### Digital Attendance System
To make teachers' lives easier, they will have access to an attendance portal. Instead of calling out roll numbers from a physical register, a teacher can simply open the dashboard, select their assigned class, and quickly mark students as 'Present' or 'Absent' with a single click.

### Student Information Management
The system will also store and manage general student information, allowing admins to add new students, edit their profiles, or remove them when they leave the school.

## 4. Functional Requirements

- **FR1:** The system shall allow students to log in securely through a QR code scan.
- **FR2:** The system shall provide a dashboard to display student profiles and their current fee status.
- **FR3:** The system shall require students to upload an image file (screenshot) of their fee transaction.
- **FR4:** The system shall provide schools with an admin dashboard to view the fee status of all students.
- **FR5:** The system shall allow the admin to upload a digital bank passbook or statement file.
- **FR6:** The system shall contain logic to automatically compare uploaded screenshot data with the submitted bank passbook.
- **FR7:** The system shall automatically update a student's fee status to "Paid" if the payment is verified against the passbook.
- **FR8:** The system shall allow admins to manually update or add student profiles.
- **FR9:** The system shall allow teachers to mark and submit daily attendance records for their assigned classes.

## 5. Non-Functional Requirements

### Security
We will protect user data heavily. Admin pages will be restricted so that standard students cannot access them. Passwords, if used as a backup to the QR code, will be encrypted before being saved into the database.

### Performance
The website should load very quickly. We want the image uploading feature to process screenshots within just a few seconds so users don't get frustrated waiting for the portal to respond.

### Usability
The interface will be kept extremely simple. Because the goal is to make things easier than traditional methods, the buttons for uploading screenshots and passbooks should be large, clear, and obvious. 

### Reliability
We plan to host the database on MongoDB Atlas, a cloud platform. This means that even if our local server crashes during development or testing, the student and payment records will not be lost.

## 6. System Architecture Overview
We are following a standard Model-View-Controller (MVC) architecture design. The "View" will be the React.js frontend interface where users click buttons. The "Controller" will be the Node.js backend APIs that handle the business logic, such as comparing the bank passbook to the screenshots. The "Model" will be Mongoose schemas that define how our data is structured inside the MongoDB database. The frontend and backend will communicate by sending JSON data back and forth over HTTP requests.

## 7. Future Enhancements
Since this is an academic project, we have limited time. However, if we do more work in the future, we could add features like:
- Sending automated email alerts to parents if fees are overdue.
- Improving the automated verification using AI image recognition to read text from the screenshots.
- Generating automated financial reports for the school management.
