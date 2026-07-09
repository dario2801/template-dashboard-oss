import "@testing-library/jest-dom"

// Clerk reads these at import time. The values are fake and never leave the test run.
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_ZmFrZS1mb3ItdGVzdHMk"
process.env.CLERK_SECRET_KEY = "sk_test_fake_for_tests"
