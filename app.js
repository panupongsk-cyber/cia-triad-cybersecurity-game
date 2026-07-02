/**
 * CIA Triad Cybersecurity Game - Application Logic & State Controller
 */

// Firebase initialization (nu-cybersec-games project, gameResults collection)
const _fbApp = firebase.initializeApp({
  apiKey: "AIzaSyBjpwTbjBnKbD5KKxXmw5eRAx5IOoWI9nY",
  authDomain: "nu-cybersec-games.firebaseapp.com",
  projectId: "nu-cybersec-games",
  storageBucket: "nu-cybersec-games.firebasestorage.app",
  messagingSenderId: "771818733994",
  appId: "1:771818733994:web:152ea862686c76aa912bd3"
});
const _db = firebase.firestore();
const _auth = firebase.auth();

// Game State Object
let state = {
  playerName: "GUEST",
  studentId: "N/A",
  googleUserEmail: null,
  currentZone: "C", // 'C', 'I', 'A'
  questionIndex: 0,
  score: 0,
  lives: 3,
  timeStart: 0,
  timeElapsed: 0,
  questionTimeStart: 0,
  zoneScores: {
    C: { correct: 0, total: 0, points: 0 },
    I: { correct: 0, total: 0, points: 0 },
    A: { correct: 0, total: 0, points: 0 }
  },
  currentQuestion: null,
  isQuestionLocked: false,
  timerInterval: null
};

// DOM Elements
const screens = {
  start: document.getElementById("start-screen"),
  brief: document.getElementById("brief-screen"),
  game: document.getElementById("game-screen"),
  result: document.getElementById("result-screen")
};

const topbar = {
  playerDisplayName: document.getElementById("player-display-name"),
  playerBadge: document.getElementById("player-badge"),
  bestScore: document.getElementById("best-score")
};

const scanlineToggleBtn = document.getElementById("scanline-toggle-btn");

const oauthUI = {
  btnSettings: document.getElementById("oauth-settings-btn"),
  modal: document.getElementById("oauth-settings-modal"),
  closeBtn: document.getElementById("close-oauth-modal-btn"),
  clientIdInput: document.getElementById("oauth-client-id"),
  saveBtn: document.getElementById("save-oauth-btn"),
  clearBtn: document.getElementById("clear-oauth-btn"),
  loginSection: document.getElementById("google-login-section"),
  googleBtn: document.getElementById("google-signin-btn")
};

const gameUI = {
  stageBadge: document.getElementById("stage-badge"),
  stageTitle: document.getElementById("stage-title"),
  scoreDisplay: document.getElementById("score-display"),
  livesDisplay: document.getElementById("lives-display"),
  progressPercent: document.getElementById("progress-percent"),
  progressBarFill: document.getElementById("progress-bar-fill"),
  progressText: document.getElementById("progress-text"),
  challengeTypeTag: document.getElementById("challenge-type-tag"),
  questionTitle: document.getElementById("question-title"),
  questionPrompt: document.getElementById("question-prompt"),
  interactiveArea: document.getElementById("interactive-area"),
  hintButton: document.getElementById("hint-button"),
  hintPanel: document.getElementById("hint-panel"),
  hintText: document.getElementById("hint-text"),
  feedbackPanel: document.getElementById("feedback-panel"),
  feedbackTitle: document.getElementById("feedback-title"),
  feedbackText: document.getElementById("feedback-text"),
  feedbackIcon: document.getElementById("feedback-icon"),
  nextButton: document.getElementById("next-button")
};

const resultUI = {
  evalName: document.getElementById("eval-name"),
  evalId: document.getElementById("eval-id"),
  evalBadge: document.getElementById("eval-badge"),
  evalTitle: document.getElementById("eval-title"),
  evalDesc: document.getElementById("eval-desc"),
  evalScore: document.getElementById("eval-score"),
  evalTime: document.getElementById("eval-time"),
  restartButton: document.getElementById("restart-button"),
  showCertButton: document.getElementById("show-cert-button"),
  statCVal: document.getElementById("stat-c-val"),
  statCBar: document.getElementById("stat-c-bar"),
  statIVal: document.getElementById("stat-i-val"),
  statIBar: document.getElementById("stat-i-bar"),
  statAVal: document.getElementById("stat-a-val"),
  statABar: document.getElementById("stat-a-bar")
};

const certUI = {
  certModal: document.getElementById("cert-modal"),
  closeCertButton: document.getElementById("close-cert-button"),
  certificate: document.getElementById("certificate"),
  recipientName: document.getElementById("cert-recipient-name"),
  recipientId: document.getElementById("cert-recipient-id"),
  cScore: document.getElementById("cert-c-score"),
  iScore: document.getElementById("cert-i-score"),
  aScore: document.getElementById("cert-a-score"),
  date: document.getElementById("cert-date"),
  hash: document.getElementById("cert-hash"),
  printButton: document.getElementById("print-button"),
  dismissButton: document.getElementById("dismiss-modal-button")
};

// Start Screen Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Load local best score
  const cachedBest = localStorage.getItem("cia_best_score") || "0000";
  topbar.bestScore.textContent = cachedBest.toString().padStart(4, "0");

  // Load scanline preference
  const isScanlineOff = localStorage.getItem("scanlines_disabled") === "true";
  if (isScanlineOff) {
    document.body.classList.add("no-scanlines");
    if (scanlineToggleBtn) scanlineToggleBtn.textContent = "CRT SCREEN: OFF";
  }

  // Scanline toggle click listener
  if (scanlineToggleBtn) {
    scanlineToggleBtn.addEventListener("click", () => {
      const isCurrentlyOff = document.body.classList.contains("no-scanlines");
      if (isCurrentlyOff) {
        document.body.classList.remove("no-scanlines");
        scanlineToggleBtn.textContent = "CRT SCREEN: ON";
        localStorage.setItem("scanlines_disabled", "false");
      } else {
        document.body.classList.add("no-scanlines");
        scanlineToggleBtn.textContent = "CRT SCREEN: OFF";
        localStorage.setItem("scanlines_disabled", "true");
      }
    });
  }

  // OAuth Modal settings events
  if (oauthUI.btnSettings) {
    oauthUI.btnSettings.addEventListener("click", () => {
      const savedId = localStorage.getItem("google_oauth_client_id") || "";
      oauthUI.clientIdInput.value = savedId;
      oauthUI.modal.classList.remove("is-hidden");
    });
  }
  if (oauthUI.closeBtn) {
    oauthUI.closeBtn.addEventListener("click", () => {
      oauthUI.modal.classList.add("is-hidden");
    });
  }
  if (oauthUI.saveBtn) {
    oauthUI.saveBtn.addEventListener("click", () => {
      const clientId = oauthUI.clientIdInput.value.trim();
      if (clientId) {
        localStorage.setItem("google_oauth_client_id", clientId);
        oauthUI.modal.classList.add("is-hidden");
        alert("Google OAuth Client ID saved successfully! Page reloading to apply...");
        window.location.reload();
      } else {
        alert("Please enter a valid Client ID.");
      }
    });
  }
  if (oauthUI.clearBtn) {
    oauthUI.clearBtn.addEventListener("click", () => {
      localStorage.removeItem("google_oauth_client_id");
      oauthUI.clientIdInput.value = "";
      oauthUI.modal.classList.add("is-hidden");
      alert("Google OAuth Client ID cleared. Page reloading...");
      window.location.reload();
    });
  }

  // Google OAuth GSI Initializer
  const oauthId = localStorage.getItem("google_oauth_client_id") || "69112486306-t7mofej13egi7ape3t2cgs5l19tg6sp7.apps.googleusercontent.com";
  if (oauthId && oauthUI.loginSection) {
    oauthUI.loginSection.classList.remove("is-hidden");
    
    // GSI Global Handler
    window.handleGoogleCredentialResponse = (response) => {
      try {
        const payload = JSON.parse(atob(response.credential.split(".")[1]));
        const email = payload.email || "";
        
        // Locked to nu.ac.th Naresuan University
        if (!email.toLowerCase().endsWith("@nu.ac.th")) {
          alert("ACCESS DENIED: Google Sign-In is locked to Naresuan University accounts (@nu.ac.th).");
          return;
        }

        state.playerName = payload.name || "STUDENT";
        state.googleUserEmail = email;

        // Auto-extract Student ID from email prefix if format: 660601XXXX@nu.ac.th
        const studentIdMatch = email.match(/^(\d{10})@/);
        if (studentIdMatch) {
          state.studentId = studentIdMatch[1];
        } else {
          state.studentId = "STAFF/INSTRUCTOR";
        }

        // Sign into Firebase with the Google credential (enables Firestore security rules)
        const fbCredential = firebase.auth.GoogleAuthProvider.credential(response.credential);
        _auth.signInWithCredential(fbCredential).catch(e => console.warn("Firebase sign-in:", e));

        // Show knowledge brief before starting the game
        showScreen("brief");
      } catch (err) {
        console.error("JWT credential parse error", err);
        alert("Failed to parse Google sign-in payload.");
      }
    };

    // Render button
    setTimeout(() => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: oauthId,
          callback: window.handleGoogleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          oauthUI.googleBtn,
          { theme: "outline", size: "large", width: 280 }
        );
      }
    }, 800);
  }

  // Login Form Submission
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    initializeGame();
  });

  // Next Button click
  gameUI.nextButton.addEventListener("click", () => {
    advanceGame();
  });

  // Brief screen: enter simulation button
  document.getElementById("start-game-btn").addEventListener("click", initializeGame);

  // Restart Button click
  resultUI.restartButton.addEventListener("click", () => {
    showScreen("start");
  });

  // Certificate triggers
  resultUI.showCertButton.addEventListener("click", openCertificate);
  certUI.closeCertButton.addEventListener("click", closeCertificate);
  certUI.dismissButton.addEventListener("click", closeCertificate);
  certUI.printButton.addEventListener("click", () => window.print());

  // Hint triggers
  gameUI.hintButton.addEventListener("click", () => {
    gameUI.hintPanel.classList.toggle("is-hidden");
  });

  // Setup Keyboard hooks
  document.addEventListener("keydown", handleKeyDown);
});

// Switch screens helper
function showScreen(screenId) {
  Object.keys(screens).forEach(key => {
    if (key === screenId) {
      screens[key].classList.remove("is-hidden");
    } else {
      screens[key].classList.add("is-hidden");
    }
  });
}

// Reset and setup the game state
function initializeGame() {
  const nameEl = document.getElementById("player-name");
  const idEl = document.getElementById("student-id");
  if (nameEl) state.playerName = nameEl.value.trim() || "ANALYST";
  if (idEl) state.studentId = idEl.value.trim() || "N/A";
  state.currentZone = "C";
  state.questionIndex = 0;
  state.score = 0;
  state.lives = 3;
  state.timeStart = Date.now();
  state.zoneScores = {
    C: { correct: 0, total: 3, points: 0 },
    I: { correct: 0, total: 3, points: 0 },
    A: { correct: 0, total: 3, points: 0 }
  };
  state.isQuestionLocked = false;

  // Header display
  topbar.playerDisplayName.textContent = state.playerName.toUpperCase();
  topbar.playerBadge.classList.remove("is-hidden");

  // Reset timer
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timeElapsed = Math.floor((Date.now() - state.timeStart) / 1000);
  }, 1000);

  showScreen("game");
  loadQuestion();
}

// Render active question details
function loadQuestion() {
  state.isQuestionLocked = false;
  gameUI.hintPanel.classList.add("is-hidden");
  gameUI.feedbackPanel.classList.add("is-hidden");

  const zoneQuestions = QUESTION_BANK[state.currentZone];
  state.currentQuestion = zoneQuestions[state.questionIndex];
  state.questionTimeStart = Date.now();

  // Update headers
  const zoneNames = { C: "CONFIDENTIALITY", I: "INTEGRITY", A: "AVAILABILITY" };
  gameUI.stageBadge.textContent = `ZONE: ${state.currentZone}`;
  gameUI.stageBadge.className = `zone-badge zone-${state.currentZone.toLowerCase()}`;
  
  // Set custom properties for colors
  const root = document.documentElement;
  if (state.currentZone === "C") {
    root.style.setProperty("--color-confidentiality", "#00f3ff");
    gameUI.stageBadge.style.backgroundColor = "var(--color-confidentiality)";
  } else if (state.currentZone === "I") {
    root.style.setProperty("--color-confidentiality", "#10b981");
    gameUI.stageBadge.style.backgroundColor = "var(--color-integrity)";
  } else if (state.currentZone === "A") {
    root.style.setProperty("--color-confidentiality", "#f59e0b");
    gameUI.stageBadge.style.backgroundColor = "var(--color-availability)";
  }

  gameUI.stageTitle.textContent = zoneNames[state.currentZone];
  gameUI.scoreDisplay.textContent = state.score.toString().padStart(4, "0");
  updateLivesDisplay();

  // Progress calculations
  const totalInGame = 9;
  const currentNum = (state.currentZone === "C" ? 0 : state.currentZone === "I" ? 3 : 6) + state.questionIndex + 1;
  const progressRatio = (currentNum / totalInGame) * 100;
  gameUI.progressPercent.textContent = `${Math.round(progressRatio)}%`;
  gameUI.progressBarFill.style.width = `${progressRatio}%`;
  gameUI.progressText.textContent = `Scenario ${currentNum} of ${totalInGame}`;

  // Challenge details
  gameUI.questionTitle.textContent = state.currentQuestion.title;
  gameUI.questionPrompt.textContent = state.currentQuestion.scenario;
  gameUI.hintText.textContent = state.currentQuestion.hint;

  // Render workspace content based on type
  gameUI.interactiveArea.innerHTML = "";
  gameUI.challengeTypeTag.textContent = state.currentQuestion.type.toUpperCase().replace("-", " ");

  if (state.currentQuestion.type === "multiple-choice") {
    renderMultipleChoice();
  } else if (state.currentQuestion.type === "hash-verify") {
    renderHashVerification();
  } else if (state.currentQuestion.type === "ddos-defense") {
    renderDdosDefense();
  }
}

// Update Decryption strikes representation
function updateLivesDisplay() {
  gameUI.livesDisplay.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const keySpan = document.createElement("span");
    keySpan.className = `life-point ${i <= state.lives ? "active" : ""}`;
    keySpan.textContent = "🔐";
    keySpan.setAttribute("aria-label", `Decryption key ${i}`);
    gameUI.livesDisplay.appendChild(keySpan);
  }
}

// Sub-component: MCQ
function renderMultipleChoice() {
  const container = document.createElement("div");
  container.className = "mc-grid";

  state.currentQuestion.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "mc-option";
    btn.type = "button";
    btn.id = `mc-option-${idx + 1}`;
    btn.innerHTML = `
      <span class="mc-option-num">${idx + 1}</span>
      <span class="mc-option-text">${opt}</span>
    `;
    btn.addEventListener("click", () => verifyAnswer(idx));
    container.appendChild(btn);
  });

  gameUI.interactiveArea.appendChild(container);
}

// Sub-component: Hash integrity checker
function renderHashVerification() {
  const container = document.createElement("div");
  container.className = "hash-container";

  const table = document.createElement("table");
  table.className = "hash-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>FILE NAME</th>
        <th>SIZE</th>
        <th>EXPECTED SHA-256</th>
        <th>CALCULATED SHA-256</th>
        <th>STATUS</th>
      </tr>
    </thead>
    <tbody id="hash-rows"></tbody>
  `;

  container.appendChild(table);
  gameUI.interactiveArea.appendChild(container);

  const tbody = document.getElementById("hash-rows");
  state.currentQuestion.files.forEach((file, idx) => {
    const tr = document.createElement("tr");
    tr.id = `hash-row-${idx}`;
    const isAltered = file.expected !== file.actual;
    
    tr.innerHTML = `
      <td>📄 ${file.name}</td>
      <td>${file.size}</td>
      <td><code>${file.expected}...</code></td>
      <td><code>${file.actual}...</code></td>
      <td>
        <span class="hash-badge ${isAltered ? 'hash-badge-tampered' : 'hash-badge-match'}">
          ${isAltered ? 'MISMATCH' : 'SECURE'}
        </span>
      </td>
    `;
    tr.addEventListener("click", () => {
      if (state.isQuestionLocked) return;
      // Selecting this file as tampered target
      verifyAnswer(isAltered ? 1 : 0); // Correct target is index 1 (altered)
    });
    tbody.appendChild(tr);
  });
}

// Sub-component: DDoS dashboard simulation
let ddosActiveTools = [];
let ddosCpu = 95;
let ddosNetwork = 98;

function renderDdosDefense() {
  ddosActiveTools = [];
  ddosCpu = 95;
  ddosNetwork = 98;

  const container = document.createElement("div");
  container.className = "ddos-console";

  // Left side: Real-time meters
  const metersDiv = document.createElement("div");
  metersDiv.className = "ddos-meters";
  metersDiv.innerHTML = `
    <div class="ddos-bar-container">
      <div class="ddos-bar-lbl">
        <span>PORTAL INCOMING TRAFFIC LOAD</span>
        <span id="ddos-net-val">98%</span>
      </div>
      <div class="ddos-bar-bg">
        <div id="ddos-net-fill" class="ddos-bar-fill" style="width: 98%; background-color: var(--color-danger)"></div>
      </div>
    </div>
    <div class="ddos-bar-container">
      <div class="ddos-bar-lbl">
        <span>CORE CPU CAPACITY</span>
        <span id="ddos-cpu-val">95%</span>
      </div>
      <div class="ddos-bar-bg">
        <div id="ddos-cpu-fill" class="ddos-bar-fill" style="width: 95%; background-color: var(--color-danger)"></div>
      </div>
    </div>
    <button id="ddos-verify-btn" class="btn btn-primary" style="margin-top: auto;" type="button">
      DEPLOY CONFIGURATION
    </button>
  `;

  // Right side: Active toggle list
  const toolsDiv = document.createElement("div");
  toolsDiv.className = "ddos-tools-grid";

  state.currentQuestion.tools.forEach((tool, idx) => {
    const card = document.createElement("button");
    card.className = "ddos-tool-btn";
    card.type = "button";
    card.id = `ddos-tool-${idx}`;
    card.innerHTML = `
      <div class="ddos-tool-header">
        <span>${tool.name}</span>
        <span class="ddos-tool-effect">CPU: ${tool.effectCpu >= 0 ? '+' : ''}${tool.effectCpu}% | NET: ${tool.effectNetwork >= 0 ? '+' : ''}${tool.effectNetwork}%</span>
      </div>
      <p class="ddos-tool-desc">${tool.desc}</p>
    `;
    card.addEventListener("click", () => toggleDdosTool(idx, card));
    toolsDiv.appendChild(card);
  });

  container.appendChild(metersDiv);
  container.appendChild(toolsDiv);
  gameUI.interactiveArea.appendChild(container);

  // Hook validation verify button
  document.getElementById("ddos-verify-btn").addEventListener("click", verifyDdosMitigation);
}

// Real-time DDoS meters calculations
function toggleDdosTool(index, cardElement) {
  if (state.isQuestionLocked) return;

  const tool = state.currentQuestion.tools[index];
  const foundIndex = ddosActiveTools.indexOf(index);

  if (foundIndex === -1) {
    ddosActiveTools.push(index);
    cardElement.classList.add("active");
  } else {
    ddosActiveTools.splice(foundIndex, 1);
    cardElement.classList.remove("active");
  }

  // Recalculate metrics
  ddosCpu = 95;
  ddosNetwork = 98;

  ddosActiveTools.forEach(toolIdx => {
    const t = state.currentQuestion.tools[toolIdx];
    ddosCpu += t.effectCpu;
    ddosNetwork += t.effectNetwork;
  });

  // Clamp limits 0-100
  ddosCpu = Math.max(0, Math.min(120, ddosCpu));
  ddosNetwork = Math.max(0, Math.min(120, ddosNetwork));

  // Update UI meters
  const cpuFill = document.getElementById("ddos-cpu-fill");
  const netFill = document.getElementById("ddos-net-fill");
  document.getElementById("ddos-cpu-val").textContent = `${ddosCpu}%`;
  document.getElementById("ddos-net-val").textContent = `${ddosNetwork}%`;

  cpuFill.style.width = `${Math.min(100, ddosCpu)}%`;
  netFill.style.width = `${Math.min(100, ddosNetwork)}%`;

  // Color alerts
  cpuFill.style.backgroundColor = ddosCpu > 80 ? "var(--color-danger)" : ddosCpu > 50 ? "var(--color-warning)" : "var(--color-success)";
  netFill.style.backgroundColor = ddosNetwork > 80 ? "var(--color-danger)" : ddosNetwork > 50 ? "var(--color-warning)" : "var(--color-success)";
}

// Evaluate DDoS config choice
function verifyDdosMitigation() {
  if (state.isQuestionLocked) return;

  // Correct tools list: WAF/Rate Limiter and Load Balancer (or along with Anycast), but without AES adding useless overhead
  const includesWaf = ddosActiveTools.includes(1);
  const includesBalancer = ddosActiveTools.includes(2);
  const includesAes = ddosActiveTools.includes(0);

  // Success defined as reducing CPU & Network load below 50%
  const isHealthy = ddosCpu < 50 && ddosNetwork < 50;

  if (isHealthy && !includesAes) {
    verifyAnswer(1); // Win state
  } else {
    verifyAnswer(0); // Fail state
  }
}

// Logic validation routing
function verifyAnswer(selectedIndex) {
  if (state.isQuestionLocked) return;
  state.isQuestionLocked = true;

  let isCorrect = false;
  if (state.currentQuestion.type === "multiple-choice") {
    isCorrect = selectedIndex === state.currentQuestion.correct;
    // Highlight choices
    state.currentQuestion.options.forEach((opt, idx) => {
      const optBtn = document.getElementById(`mc-option-${idx + 1}`);
      if (idx === state.currentQuestion.correct) {
        optBtn.style.borderColor = "var(--color-success)";
        optBtn.style.backgroundColor = "rgba(16, 185, 129, 0.08)";
      } else if (idx === selectedIndex) {
        optBtn.style.borderColor = "var(--color-danger)";
        optBtn.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
      }
    });
  } else if (state.currentQuestion.type === "hash-verify") {
    // 1 represents picking the single tampered file
    isCorrect = selectedIndex === 1;
    // Highlight altered file
    const tbody = document.getElementById("hash-rows");
    state.currentQuestion.files.forEach((file, idx) => {
      const row = document.getElementById(`hash-row-${idx}`);
      if (file.expected !== file.actual) {
        row.style.border = "1px solid var(--color-success)";
        row.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
      } else if (isCorrect === false && file.expected === file.actual) {
        // Mismatch logic highlights
      }
    });
  } else if (state.currentQuestion.type === "ddos-defense") {
    // 1 is win, 0 is fail
    isCorrect = selectedIndex === 1;
  }

  // Log outcomes
  const elapsed = Math.floor((Date.now() - state.questionTimeStart) / 1000);
  if (isCorrect) {
    const qScore = calculateScore(state.currentQuestion.points, elapsed);
    state.score += qScore;
    state.zoneScores[state.currentZone].correct++;
    state.zoneScores[state.currentZone].points += qScore;

    gameUI.feedbackPanel.className = "feedback-panel correct";
    gameUI.feedbackTitle.textContent = "PROTOCOL FULLY DECRYPTED [SUCCESS]";
    gameUI.feedbackIcon.textContent = "✅";
  } else {
    state.lives--;
    gameUI.feedbackPanel.className = "feedback-panel incorrect";
    gameUI.feedbackTitle.textContent = "SYSTEM INTEGRITY COMPROMISED [WARNING]";
    gameUI.feedbackIcon.textContent = "⚠️";
  }

  gameUI.feedbackText.textContent = state.currentQuestion.explanation;
  gameUI.feedbackPanel.classList.remove("is-hidden");
  gameUI.scoreDisplay.textContent = state.score.toString().padStart(4, "0");
  updateLivesDisplay();

  // Check Game Over condition
  if (state.lives <= 0) {
    gameUI.nextButton.textContent = "ABORT MISSION & VIEW REPORT [ENTER]";
  }
}

// Progress target index calculations
function advanceGame() {
  const zoneList = ["C", "I", "A"];
  const activeZoneIdx = zoneList.indexOf(state.currentZone);

  // Check Game Over state
  if (state.lives <= 0) {
    endSimulation();
    return;
  }

  if (state.questionIndex < 2) {
    state.questionIndex++;
    loadQuestion();
  } else {
    // Stage completed, proceed to next zone
    if (activeZoneIdx < 2) {
      state.currentZone = zoneList[activeZoneIdx + 1];
      state.questionIndex = 0;
      loadQuestion();
    } else {
      endSimulation();
    }
  }
}

// Complete sequence, stop clocks, display report
function endSimulation() {
  if (state.timerInterval) clearInterval(state.timerInterval);

  showScreen("result");

  // Outcome statistics calculations
  const evaluation = evaluateLearningOutcome(state.zoneScores);

  resultUI.evalName.textContent = state.playerName.toUpperCase();
  resultUI.evalId.textContent = state.studentId;
  resultUI.evalBadge.textContent = evaluation.badge;
  resultUI.evalTitle.textContent = evaluation.title;
  resultUI.evalDesc.textContent = evaluation.description;
  resultUI.evalScore.textContent = state.score.toString().padStart(4, "0");

  // Build time representation
  const minutes = Math.floor(state.timeElapsed / 60).toString().padStart(2, "0");
  const seconds = (state.timeElapsed % 60).toString().padStart(2, "0");
  resultUI.evalTime.textContent = `${minutes}:${seconds}`;

  // Breakdown bars
  const displayScore = (zone) => {
    const score = state.zoneScores[zone];
    const acc = Math.round((score.correct / score.total) * 100);
    return `${score.correct}/${score.total} (${acc}%)`;
  };

  resultUI.statCVal.textContent = displayScore("C");
  resultUI.statCBar.style.width = `${(state.zoneScores.C.correct / 3) * 100}%`;

  resultUI.statIVal.textContent = displayScore("I");
  resultUI.statIBar.style.width = `${(state.zoneScores.I.correct / 3) * 100}%`;

  resultUI.statAVal.textContent = displayScore("A");
  resultUI.statABar.style.width = `${(state.zoneScores.A.correct / 3) * 100}%`;

  // Write high score
  const cachedBest = parseInt(localStorage.getItem("cia_best_score") || "0");
  if (state.score > cachedBest) {
    localStorage.setItem("cia_best_score", state.score);
    topbar.bestScore.textContent = state.score.toString().padStart(4, "0");
  }

  saveGameStats();
}

async function saveGameStats() {
  if (!state.googleUserEmail) return;
  try {
    await _db.collection("gameResults").add({
      gameId: "cia-triad",
      playerName: state.playerName,
      email: state.googleUserEmail,
      studentId: state.studentId,
      score: state.score,
      breakdown: {
        C: state.zoneScores.C,
        I: state.zoneScores.I,
        A: state.zoneScores.A
      },
      timeTakenSeconds: state.timeElapsed,
      completedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.error("Stats save failed:", e);
  }
}

// Keyboard hooks controller
function handleKeyDown(e) {
  const key = e.key;

  // Enter triggers action paths
  if (key === "Enter") {
    if (!screens.game.classList.contains("is-hidden")) {
      if (state.isQuestionLocked) {
        // Feedback pane is active, proceed to next question
        advanceGame();
      } else if (state.currentQuestion.type === "ddos-defense") {
        // DDoS verify trigger
        verifyDdosMitigation();
      }
    }
    return;
  }

  // Answer selections 1-4 for multiple-choice scenarios
  if (!screens.game.classList.contains("is-hidden") && !state.isQuestionLocked) {
    if (state.currentQuestion.type === "multiple-choice") {
      if (["1", "2", "3", "4"].includes(key)) {
        const index = parseInt(key) - 1;
        if (index < state.currentQuestion.options.length) {
          verifyAnswer(index);
        }
      }
    }
  }
}

// Certificate generator module
function openCertificate() {
  certUI.recipientName.textContent = state.playerName.toUpperCase();
  let idText = state.studentId !== "N/A" && state.studentId.length > 0 ? `Student ID: ${state.studentId}` : "";
  if (state.googleUserEmail) {
    idText += ` | Account: ${state.googleUserEmail}`;
  }
  certUI.recipientId.textContent = idText;
  
  const calcPercent = (zone) => {
    return `${Math.round((state.zoneScores[zone].correct / 3) * 100)}%`;
  };

  certUI.cScore.textContent = calcPercent("C");
  certUI.iScore.textContent = calcPercent("I");
  certUI.aScore.textContent = calcPercent("A");

  // Date and random hash
  const today = new Date().toISOString().split("T")[0];
  certUI.date.textContent = today;
  
  // SHA-256 signature mockup based on score, name, and email
  const rawHash = `${state.playerName}_${state.score}_${state.studentId}_${state.googleUserEmail || ""}_${today}`;
  let hashVal = 0;
  for (let i = 0; i < rawHash.length; i++) {
    hashVal = (hashVal << 5) - hashVal + rawHash.charCodeAt(i);
    hashVal |= 0;
  }
  certUI.hash.textContent = `SHA256_${Math.abs(hashVal).toString(16).toUpperCase()}_NU`;

  certUI.certModal.classList.remove("is-hidden");
}

function closeCertificate() {
  certUI.certModal.classList.add("is-hidden");
}
