import { execSync } from "child_process";


// Versão requerida
const REQUIRED_MAJOR = 24;

// Pega a versão atual do Node
const currentVersion = process.versions.node;
const [major] = currentVersion.split(".").map(Number);

if (major !== REQUIRED_MAJOR) {
  console.error("\n🚨 Invalid Node.js version detected!");
  console.error(`This project requires Node.js v${REQUIRED_MAJOR}.x to run.`);
  console.error(`You are currently using Node.js v${currentVersion}.\n`);
  console.error("👉 Please switch to the correct version (e.g., using nvm):");
  console.error(`   nvm install ${REQUIRED_MAJOR}`);
  console.error(`   nvm use ${REQUIRED_MAJOR}\n`);
  process.exit(1); // ❌ cancela o npm install
} else {
  console.log(`✅ Node.js version ${currentVersion} is compatible!`);
}
