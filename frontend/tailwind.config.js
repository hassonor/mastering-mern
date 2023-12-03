export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                title: ['"Pacifico"', 'cursive'],
            },
            keyframes: {
                blowUpModal: {
                    '0%': {transform: 'scale(0)'},
                    '100%': {transform: 'scale(1)'},
                },
                blowUpModalOut: {
                    '0%': {transform: 'scale(1)', opacity: 1},
                    '100%': {transform: 'scale(0)', opacity: 0},
                }
            },
            animation: {
                blowUpIn: 'blowUpModal 0.2s ease-out forwards',
                blowUpOut: 'blowUpModalOut 0.2s ease-out forwards',
            },
        },
    },
    plugins: [],
}
