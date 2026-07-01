/**
 * CIA Triad Game Unit Tests - Lightweight Node-native verification script
 */

const assert = require("assert");
const { QUESTION_BANK, calculateScore, evaluateLearningOutcome } = require("./game-core.js");

console.log("=========================================");
console.log("RUNNING CIA TRIAD GAME CORE TESTS...");
console.log("=========================================");

try {
  // Test 1: Verify question bank integrity
  console.log("Test 1: Verifying Question Bank structure...");
  assert.ok(QUESTION_BANK.C, "Confidentiality zone is missing.");
  assert.ok(QUESTION_BANK.I, "Integrity zone is missing.");
  assert.ok(QUESTION_BANK.A, "Availability zone is missing.");
  assert.strictEqual(QUESTION_BANK.C.length, 3, "Confidentiality should have exactly 3 questions.");
  assert.strictEqual(QUESTION_BANK.I.length, 3, "Integrity should have exactly 3 questions.");
  assert.strictEqual(QUESTION_BANK.A.length, 3, "Availability should have exactly 3 questions.");
  console.log("✔ Question bank verified successfully.");

  // Test 2: Verify score calculation logic
  console.log("Test 2: Verifying calculateScore calculation rules...");
  const basePoints = 100;
  // Speed bonus case (0 seconds elapsed) -> returns basePoints + (0.5 * basePoints) = 150
  assert.strictEqual(calculateScore(basePoints, 0, 60), 150, "Zero elapsed time should reward maximum points + speed bonus.");
  // Decayed bonus case (30 seconds elapsed) -> returns 100 + (0.5 * 100 * 0.5) = 125
  assert.strictEqual(calculateScore(basePoints, 30, 60), 125, "Mid-range elapsed time should reward decayed speed bonus.");
  // Exceeded time limit case (60 seconds elapsed) -> returns 100 * 0.5 = 50 (floor)
  assert.strictEqual(calculateScore(basePoints, 60, 60), 50, "Exceeding time limit should reward minimum floor points.");
  console.log("✔ Score calculations verified successfully.");

  // Test 3: Verify learning outcome logic
  console.log("Test 3: Verifying evaluateLearningOutcome output classifications...");
  // Case A: 100% Accuracy (9/9 correct) -> CISO
  const perfectScores = {
    C: { correct: 3, total: 3 },
    I: { correct: 3, total: 3 },
    A: { correct: 3, total: 3 }
  };
  const perfectOutcome = evaluateLearningOutcome(perfectScores);
  assert.strictEqual(perfectOutcome.accuracy, 100);
  assert.strictEqual(perfectOutcome.title, "Chief Information Security Officer (CISO)");
  assert.strictEqual(perfectOutcome.badge, "👑");

  // Case B: 66% Accuracy (6/9 correct) -> SOC Security Analyst (>= 50%)
  const analystScores = {
    C: { correct: 2, total: 3 },
    I: { correct: 2, total: 3 },
    A: { correct: 2, total: 3 }
  };
  const analystOutcome = evaluateLearningOutcome(analystScores);
  assert.ok(analystOutcome.accuracy >= 66 && analystOutcome.accuracy < 67);
  assert.strictEqual(analystOutcome.title, "SOC Security Analyst");

  // Case C: 0% Accuracy (0/9 correct) -> SecOps Recruit
  const failedScores = {
    C: { correct: 0, total: 3 },
    I: { correct: 0, total: 3 },
    A: { correct: 0, total: 3 }
  };
  const failedOutcome = evaluateLearningOutcome(failedScores);
  assert.strictEqual(failedOutcome.accuracy, 0);
  assert.strictEqual(failedOutcome.title, "SecOps Recruit");
  console.log("✔ Learning outcomes mapping verified successfully.");

  console.log("\n=========================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY! [PASS]");
  console.log("=========================================");
  process.exit(0);

} catch (error) {
  console.error("\n❌ TEST SUITE FAILED:");
  console.error(error);
  process.exit(1);
}
