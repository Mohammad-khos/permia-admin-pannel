/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // برای جلوگیری از رفتارهای عجیب با کتاب‌خونه‌هایی مثل RHF / TanStack / Radix
    reactCompiler: false,
  },
};

export default nextConfig;
