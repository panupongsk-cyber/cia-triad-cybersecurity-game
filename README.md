# CIA Triad Tactical Simulator

An interactive, high-fidelity web-based cybersecurity learning game designed for students to explore the core pillars of the **CIA Triad** (Confidentiality, Integrity, Availability). 

Developed for the Naresuan University Computer Engineering (CPE) & Intelligent Innovation Engineering (IIE) English Programs.

## Features

- **Interactive Stages**: Learn Confidentiality (privilege controls, encryption, social engineering), Integrity (forensic checksum auditing, prepared statements), and Availability (real-time DDoS mitigation dashboards, hardware redundancy).
- **Persistent Analytics**: Dynamic reports detailing accuracy breakdown and grade ranks (CISO, Analyst, Responder) stored in `localStorage`.
- **Holographic Certificate**: Generate and print/save a completion certificate with verifiable signature hashes.
- **Native Keyboard Support**: Controls mapped to keys `[1]-[4]` and `[ENTER]`.
- **Pure Client-Side Code**: Vanilla HTML, CSS, and JS. Zero library dependencies.

## Structure

```
cia-triad-game/
├── index.html        # Shell, terminals, result screens and certificate modal
├── styles.css        # Neon obsidian CSS typography, transitions, print overrides
├── game-core.js      # Core scenario banks, score mechanics, and outcomes evaluator
├── app.js            # Main event loops, DOM controllers, and state controller
├── game-core.test.js # Unit test verifying engine correctness
└── teacher-guide.md  # Curriculum guidelines, CLO mapping, and teaching workflows
```

## How to Play

1. Start the server locally:
   ```bash
   python3 -m http.server 8000
   ```
2. Navigate to `http://localhost:8000` in your web browser.

## Run Tests

Verify state logic and score engine formulas:
```bash
node game-core.test.js
```
