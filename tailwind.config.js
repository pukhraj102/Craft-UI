/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
  colors: {
    /* =========================
       BACKGROUNDS (DEPTH STACK)
    ========================= */
    bg: {
      light: "#f8fafc",        // Page background
      dark: "#0b1220",         // Lifted dark (NOT black)

      cardLight: "#ffffff",   // Primary surface
      cardDark: "#111827",    // Dark card (clear separation)

      panelLight: "#f1f5f9",  // Toolbars / tabs (light)
      panelDark: "#0f172a",   // Toolbars / tabs (dark)
    },

    /* =========================
       TEXT HIERARCHY
    ========================= */
    text: {
      light: "#020617",
      dark: "#e5e7eb",

      mutedLight: "#64748b",
      mutedDark: "#9ca3af",

      subtleLight: "#94a3b8",
      subtleDark: "#6b7280",
    },

    /* =========================
       BORDERS / DIVIDERS
    ========================= */
    border: {
      light: "#e5e7eb",
      dark: "#1f2937",        // Stronger than before
      subtleDark: "#111827",  // Inner dividers
    },

    /* =========================
       ACCENT (UNCHANGED)
    ========================= */
    accent: "#7c3aed",
  },
},

    // extend: {
    //   colors: {
    //     bg: {
    //       light: "#f8fafc",
    //       dark: "#0f172a",
    //       cardLight: "#ffffff",
    //       cardDark: "#020617",
    //     },
    //     text: {
    //       light: "#020617",
    //       dark: "#e5e7eb",
    //       mutedLight: "#64748b",
    //       mutedDark: "#94a3b8",
    //     },
    //     border: {
    //       light: "#e2e8f0",
    //       dark: "#1e293b",
    //     },
    //     accent: "#7c3aed",
    //   },
    // },
  },
  plugins: [],
}
