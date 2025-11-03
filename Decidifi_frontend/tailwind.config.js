/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [],
  },
  theme: {
    extend: {
      colors: {
        primary: "#133C68", // Black
        secondary: "#FFFFFF", // White
        'selected-sidear': "#007A6C",
        gray: {
          100: "#F7FAFC",
          200: "#EDF2F7",
          300: "#E2E8F0",
          400: "#CBD5E0",
          500: "#A0AEC0",
          600: "#718096",
          700: "#4A5568",
          800: "#2D3748",
          900: "#1A202C",
        },
        // You can define other colors if needed
      },
    },
  },
};
