# Instructor Guide: CIA Triad Tactical Simulator

This guide outlines the learning objectives, game mechanics, and classroom delivery recommendations for using the **CIA Triad Tactical Simulator** in cybersecurity courses.

---

## 1. Educational Alignment

The game is designed for undergraduate students (e.g., Naresuan University, CPE & IIE English Programs: `305331/316331 Computer & Information Security` or `316332 Cybersecurity`).

### Learning Outcomes (CLOs)
After completing this simulation, learners will be able to:
1. **Explain the CIA Triad Objectives**: Differentiate between threats and countermeasures addressing Confidentiality, Integrity, and Availability.
2. **Identify Security Exploits**: Classify common incidents (e.g., Wi-Fi eavesdropping, SQL injection, database tampering, phishing, DDoS attacks, hardware faults) under their respective triad principles.
3. **Formulate Defense Mechanisms**: Select and apply appropriate security controls (e.g., TLS encryption, Role-Based Access Control, SHA-256 checksums, prepared statements, digital signatures, Web Application Firewalls, redundant hardware configurations, backups).

---

## 2. Technical Setup & Deployment

The simulator is built with pure, lightweight client-side Vanilla HTML5, CSS3, and ES6 JavaScript. It runs 100% locally with no database or server dependencies.

### How to Run Locally
Instructors and students can launch the game instantly.

1. Navigate to the game folder and start a lightweight Python web server:
   ```bash
   python3 -m http.server 8000
   ```
2. Open a web browser and go to:
   `http://localhost:8000`

---

## 3. Simulator Structure & Mechanics

The game consists of **3 tactical stages** representing the CIA triad.

### Stage 1: Confidentiality Zone (C)
*Focuses on restricting data access to authorized entities.*
* **Challenges**: Wi-Fi sniffing (identifying TLS/HTTPS benefits), privilege escalation (implementing server-side Role-Based Access Control), and social engineering (analyzing phishing vectors).

### Stage 2: Integrity Zone (I)
*Focuses on preventing unauthorized modification of information.*
* **Interactive Hash Verification Grid**: Students act as forensically trained analysts to compare expected SHA-256 hashes against actual file hashes in a directory listing to detect tampered spreadsheets/csv files.
* **Prepared Statements**: Understanding how parameterization prevents SQL database corruption.
* **Digital Signatures**: Implementing asymmetric signing key pairs to verify authenticity in transit.

### Stage 3: Availability Zone (A)
*Focuses on ensuring reliable access to systems and services.*
* **Interactive DDoS Mitigation Dashboard**: Students fight a live DDoS attack simulation where CPU and network bandwidth loads spike toward 100%. They must evaluate and activate the correct configuration (e.g., Web Application Firewall, load balancers, BGP traffic scrubbing) while avoiding counterproductive, resource-heavy encryption tools (AES) to stabilize the server back under 50%.
* **Ransomware Mitigation**: Applying offline read-only backup restoration sequences.
* **Hardware Redundancy**: Resolving single points of failure (SPOF) using RAID configuration and dual power supplies.

---

## 4. Classroom Delivery Strategies

### Activity Option A: In-Class Icebreaker (10–15 Minutes)
- **Deployment**: Run the game individually at the beginning of the Security Foundations week.
- **Goal**: Engage students through gamified learning before introducing the formal CIA definitions in slides.
- **Follow-up**: Debrief by asking students what challenges they encountered in each zone and how it relates to their everyday use of technology.

### Activity Option B: Competitive Score Attack (20 Minutes)
- **Goal**: Maximize final score. The scoring engine calculates points dynamically based on answer accuracy and *speed bonus* (answering quickly increases the multiplier).
- **Rules**: Students enter their real Student ID and Name at the start screen to register.
- **Outcome**: Students display their high scores stored in `localStorage`. The top three analysts are rewarded.

### Activity Option C: Assessment & Evidence Collection
- **Goal**: Collect authentic evidence of learning outcomes.
- **Evidence**: On successful completion of the game, a dynamic results dashboard is loaded. Clicking **"Generate Certificate"** launches a holographic-themed modal showing:
  1. Student Name & ID.
  2. Level completion accuracy scores for Confidentiality, Integrity, and Availability.
  3. A verification cryptographic signature hash dynamically generated from their score and date.
- **Submission**: Instructors can ask students to "Print" or "Save as PDF" (using browser print parameters) and submit the certificate as part of their laboratory worksheets package.
