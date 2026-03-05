/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                amul: {
                    darkblue: '#1e3a8a', // deep blue for headers
                    lightblue: '#dbeafe', // light blue for backgrounds
                    red: '#ef4444',     // Amul red emphasis
                    yellow: '#fef08a'   // Amul butter yellow
                }
            }
        },
    },
    plugins: [],
}
