import { execSync } from "node:child_process";

const steps = [
  { name: "lint", command: "npm run lint" },
  { name: "test", command: "npm test" },
  { name: "test:coverage", command: "npm run test:coverage" },
  { name: "audit", command: "npm audit" },
  { name: "build", command: "npm run build" }
];

for (const step of steps) {
  console.log(`\n[prepublish] Running ${step.name}...`);
  execSync(step.command, { stdio: "inherit" });
}

console.log("\n[prepublish] All checks passed.");
