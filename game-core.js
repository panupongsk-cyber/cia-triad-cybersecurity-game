/**
 * CIA Triad Cybersecurity Game - Core Logic & Question Bank
 * written in English for the CPE & IIE Programs at Naresuan University
 */

const QUESTION_BANK = {
  C: [
    {
      id: "C1",
      type: "multiple-choice",
      title: "Wi-Fi Eavesdropping",
      scenario: "An attacker is sniffing wireless network packets outside Naresuan University. You need to transmit sensitive grade records to the server. Which method guarantees confidentiality in transit?",
      options: [
        "Base64 encode the grade payload and send it over plain HTTP to the main server.",
        "Transmit the data over an encrypted HTTPS (TLS) session with verified certificates.",
        "Hash the grade file using a SHA-256 algorithm before sending it over plain HTTP.",
        "Encrypt the payload using a static, hardcoded XOR cipher key in the frontend code."
      ],
      correct: 1,
      hint: "Encoding (like Base64) is reversible without keys. Hashing ensures integrity but does not encrypt. Static keys in JS are visible to everyone.",
      explanation: "HTTPS uses Transport Layer Security (TLS) to establish an encrypted tunnel. This prevents eavesdroppers from sniffing the plaintext content of the transmission, guaranteeing confidentiality.",
      points: 100
    },
    {
      id: "C2",
      type: "multiple-choice",
      title: "Role Privilege Escalation",
      scenario: "During an audit, you find that any registered guest user can modify student transcripts by changing their HTTP request parameter 'role' from 'guest' to 'registrar'. How should you fix this?",
      options: [
        "Hide the 'role' field in the HTML input form using client-side style='display:none'.",
        "Perform authorization checks on the server side using Role-Based Access Control (RBAC).",
        "Obfuscate the client-side JavaScript code to hide the underlying request parameters.",
        "Add a CAPTCHA challenge widget on the submission form to block automated tampering."
      ],
      correct: 1,
      hint: "Clients cannot be trusted. Anything done on the front-end can be modified by an attacker using proxy tools or DevTools.",
      explanation: "Access controls must be enforced on the server. Role-Based Access Control (RBAC) validates that the authenticated session possesses the required permissions on the server before executing operations.",
      points: 100
    },
    {
      id: "C3",
      type: "multiple-choice",
      title: "The Phishing Portal",
      scenario: "You receive an urgent email from 'support@naresuan-it-portal.com' (note the domain discrepancy) claiming your portal password will expire in 2 hours. It links to a login page that looks identical to the real portal. What is the threat here?",
      options: [
        "A distributed denial of service attack attempting to crash your local web computer.",
        "A phishing attack designed to steal your credentials and compromise confidentiality.",
        "A ransomware attack designed to encrypt your personal local storage and demand funds.",
        "A buffer overflow exploit designed to crash the university's main network gateway."
      ],
      correct: 1,
      hint: "Phishing emails create a false sense of urgency and clone real websites to trick users into typing secret credentials.",
      explanation: "Phishing is a social engineering technique where attackers trick victims into disclosing credentials (confidential data) using cloned web pages and deceptive domains.",
      points: 100
    }
  ],
  I: [
    {
      id: "I1",
      type: "hash-verify",
      title: "Syllabus Tampering Detection",
      scenario: "An attacker has gained access to the course file repository and modified the grades list. Identify the modified grades file by comparing the Expected cryptographic hash (SHA-256) with the actual calculated hash of the file on disk.",
      files: [
        { name: "syllabus_draft.docx", size: "142 KB", expected: "4f7a1e2b", actual: "4f7a1e2b", status: "Match" },
        { name: "grading_scheme.csv", size: "12 KB", expected: "9f0c2d1b", actual: "3e5a7b8c", status: "Tampered" },
        { name: "lecture_slides_w01.pptx", size: "8.4 MB", expected: "2d4e6f8a", actual: "2d4e6f8a", status: "Match" },
        { name: "attendance_sheet.xlsx", size: "48 KB", expected: "7c9a1b3d", actual: "7c9a1b3d", status: "Match" }
      ],
      hint: "Look at the hashes row by row. If the actual hash differs from the expected hash by even a single character, the file integrity is compromised.",
      explanation: "Cryptographic hash functions produce a unique fixed-size output for any file input. A mismatched hash indicates that the file was altered or tampered with, violating data integrity.",
      points: 120
    },
    {
      id: "I2",
      type: "multiple-choice",
      title: "Preventing Database Injection",
      scenario: "An instructor dashboard searches for students using this query: `SELECT * FROM users WHERE name = '` + input + `'`. An attacker inputs `' OR '1'='1`. What is the best way to maintain database integrity against SQL Injection?",
      options: [
        "Encrypt all user passwords and backend database credentials using a strong bcrypt hashing tool.",
        "Use parameterized queries (prepared statements) to separate query logic from user data input.",
        "Implement client-side regular expressions to strip out special input characters like quotes.",
        "Apply file-level compression and file system access passwords to make database tables unreadable."
      ],
      correct: 1,
      hint: "SQL Injection occurs when user input is treated as executable code by the SQL interpreter. Parameterized queries bind values securely.",
      explanation: "Parameterized queries ensure that user input is treated strictly as a literal value, not executable SQL syntax. This prevents database queries from being manipulated to view or overwrite data.",
      points: 100
    },
    {
      id: "I3",
      type: "multiple-choice",
      title: "Digital Signatures",
      scenario: "When distributing exam papers to other campuses, how does the dean prove that the exams are authentic and have not been modified during transmission?",
      options: [
        "By packaging the exam papers in a password-protected zip archive and emailing the password through a secondary channel.",
        "By applying a digital signature created using the dean's private key, which recipients verify using their public key.",
        "By rewriting the exams in HTML code and obfuscating the source syntax to prevent unauthorized readers from viewing them.",
        "By scheduling the file transfers to take place during late night hours when global internet traffic load is at its lowest."
      ],
      correct: 1,
      hint: "Digital signatures combine hashing with asymmetric encryption. The private key signs, and the public key verifies identity and content integrity.",
      explanation: "A digital signature ensures integrity and non-repudiation. Since only the private key owner could have signed it, and any file alteration breaks the signature verification, recipients know the file is unmodified.",
      points: 100
    }
  ],
  A: [
    {
      id: "A1",
      type: "ddos-defense",
      title: "DDoS Attack Mitigation",
      scenario: "The university enrollment portal is experiencing a Distributed Denial of Service (DDoS) attack. Traffic is spiking rapidly (100% capacity). Activate the correct mitigation tools to bring system CPU and network loads back to safe margins before the server crashes!",
      status: {
        cpu: 95,
        network: 98,
        activeTools: []
      },
      tools: [
        { name: "AES Encryption", cost: 10, effectCpu: 15, effectNetwork: 0, desc: "Encrypts database. Ineffective against volume." },
        { name: "Web Application Firewall (WAF) & Rate Limiting", cost: 30, effectCpu: -35, effectNetwork: -40, desc: "Blocks invalid HTTP request patterns and rate-limits single IPs." },
        { name: "Server Load Balancer", cost: 30, effectCpu: -25, effectNetwork: -15, desc: "Spreads network loads across auxiliary backup nodes." },
        { name: "BGP Anycast Routing", cost: 40, effectCpu: -15, effectNetwork: -35, desc: "Routes malicious traffic to scrubbing centers globally." }
      ],
      hint: "Choose tools that specifically target rate limits, load balancing, and traffic scrubbing. Encryption adds CPU load without reducing traffic volume.",
      explanation: "WAF rate-limiting, load balancing, and BGP routing are key availability solutions. They filter traffic, share workloads, and route spikes, keeping servers responsive under attack.",
      points: 150
    },
    {
      id: "A2",
      type: "multiple-choice",
      title: "Ransomware Disaster Recovery",
      scenario: "Ransomware has encrypted the server database, halting all online services. How do you recover system availability without paying the ransom?",
      options: [
        "Re-encrypt the compromised files with standard openssl tools to bypass the hacker's lock.",
        "Wipe the compromised server and restore files from an offline, read-only backup vault.",
        "Install active antivirus programs and run deep system sweeps to clean the local database.",
        "Reset the network routers and change all administrative domain credentials immediately."
      ],
      correct: 1,
      hint: "Once files are encrypted by ransomware, you cannot decrypt them without the key. Having isolated (offline) backups is the only secure recovery method.",
      explanation: "Having a verified, offline backup ensures that even if local production data is encrypted or destroyed, systems can be rebuilt and restored to maintain long-term availability.",
      points: 100
    },
    {
      id: "A3",
      type: "multiple-choice",
      title: "Eliminating Single Points of Failure",
      scenario: "The student portal went offline for 12 hours because the server's single power supply unit failed. What hardware layout guarantees availability here?",
      options: [
        "Installing high-velocity cooling fans and thermal sensors.",
        "Redundant power supplies (dual feeds) and RAID disk mirroring.",
        "Running automated daily security patches and software updates.",
        "Placing the server cabinet behind a secondary hardware router."
      ],
      correct: 1,
      hint: "Availability demands physical reliability. If a system relies on a single component, that component is a single point of failure (SPOF).",
      explanation: "Hardware redundancy (dual power supplies, RAID disk configuration, backup generators) eliminates Single Points of Failure, maintaining availability during hardware malfunctions.",
      points: 100
    }
  ]
};

/**
 * Score calculation helper with speed bonus
 */
function calculateScore(basePoints, timeElapsedSeconds, maxTimeSeconds = 60) {
  if (timeElapsedSeconds >= maxTimeSeconds) {
    return Math.floor(basePoints * 0.5); // Minimum points for correct answer
  }
  const speedRatio = (maxTimeSeconds - timeElapsedSeconds) / maxTimeSeconds;
  const speedBonus = Math.floor(basePoints * 0.5 * speedRatio);
  return basePoints + speedBonus;
}

/**
 * Grade evaluation based on final accuracy
 */
function evaluateLearningOutcome(scores) {
  const totalCorrect = scores.C.correct + scores.I.correct + scores.A.correct;
  const totalQuestions = scores.C.total + scores.I.total + scores.A.total;
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  let title = "SecOps Recruit";
  let badge = "🔒";
  let description = "You are starting your cybersecurity journey. Replay to master CIA concepts!";

  if (overallAccuracy >= 90) {
    title = "Chief Information Security Officer (CISO)";
    badge = "👑";
    description = "Masterful understanding! You successfully balanced Confidentiality, Integrity, and Availability constraints.";
  } else if (overallAccuracy >= 75) {
    title = "Cyber Incident Responder";
    badge = "🛡️";
    description = "Strong performance. You know how to triage threats and apply appropriate security safeguards.";
  } else if (overallAccuracy >= 50) {
    title = "SOC Security Analyst";
    badge = "💻";
    description = "Good baseline. You understand CIA objectives, but watch out for edge cases and design patterns.";
  }

  return {
    accuracy: overallAccuracy,
    title,
    badge,
    description
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    QUESTION_BANK,
    calculateScore,
    evaluateLearningOutcome
  };
}
