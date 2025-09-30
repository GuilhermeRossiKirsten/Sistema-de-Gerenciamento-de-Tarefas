const REQUIRED_ENV_VARS = ["DATABASE_URL"];

let hasError = false;

REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    hasError = true;
  }
});

if (hasError) {
  process.exit(1);
}
