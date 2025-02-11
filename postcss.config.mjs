/** @type {import('postcss-load-config').Config} */
const config = {
  // Add PostCSS plugins here
  plugins: {
    // Tailwind CSS for utility-first CSS framework
    tailwindcss: {},
    // Autoprefixer for vendor prefixing
    autoprefixer: {},
    // Conditionally add cssnano for CSS minification in production
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};

export default config;