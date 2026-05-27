module.exports = {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  darkMode:'class',
  theme: {
    extend: {
      fontFamily: { bebas:['"Bebas Neue"','cursive'], rajdhani:['Rajdhani','sans-serif'], mono:['"IBM Plex Mono"','monospace'] },
      animation: { float:'float 3s ease-in-out infinite', 'slide-up':'slideUp 0.4s ease forwards', 'fade-in':'fadeIn 0.5s ease forwards' },
      keyframes: { float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-8px)'}}, slideUp:{from:{opacity:0,transform:'translateY(20px)'},to:{opacity:1,transform:'translateY(0)'}}, fadeIn:{from:{opacity:0},to:{opacity:1}} }
    }
  },
  plugins:[]
}
