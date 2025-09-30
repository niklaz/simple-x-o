# X-O Game (Tic-Tac-Toe)

A modern, responsive X-O (Tic-Tac-Toe) game built with HTML5, CSS3, and vanilla JavaScript. Works perfectly on both desktop and mobile devices.

## 🎮 Features

- **Cross-platform**: Works on desktop, tablet, and mobile
- **Touch-optimized**: Smooth touch interactions for mobile devices
- **Responsive design**: Adapts to any screen size
- **Score tracking**: Keep track of wins for both players
- **Game persistence**: Automatically saves game state and scores across browser sessions
- **Game timer**: Track how long each game takes with real-time display
- **Custom board sizes**: Choose from 3x3, 4x4, 5x5, or 6x6 boards
- **Dark mode**: Toggle between light and dark themes with persistent preference
- **Modern UI**: Beautiful gradient design with smooth animations
- **Haptic feedback**: Vibration on supported mobile devices
- **Accessibility**: High contrast, clear typography, keyboard navigation

## 🚀 How to Play

1. Open `index.html` in any modern web browser
2. Players take turns clicking/tapping cells to place X or O
3. First player to get 3 in a row (horizontal, vertical, or diagonal) wins
4. Use "New Game" to start fresh
5. Use "Clear Score" to reset the scoreboard
6. Use "Clear All Data" to reset everything (scores + current game)
7. Click the 🌙/☀️ button in the top-right to toggle dark mode
8. Watch the timer to see how fast you can complete each game
9. Select different board sizes for varied gameplay (3x3 to 6x6)

## 💾 Game Persistence

The game automatically saves your progress using browser localStorage:

- **Scores persist** across browser sessions
- **Game state is preserved** - you can refresh the page and continue where you left off
- **Automatic saving** happens after every move, score update, and game reset
- **Timer persistence** - game timer continues across page refreshes
- **Board size preference** - your chosen board size is saved and restored
- **Data management** options:
  - "Clear Score" - resets only the scoreboard
  - "Clear All Data" - completely resets everything (new game + clear scores)
- **Theme preference** is also saved and restored

## 📱 Mobile Installation

For the best mobile experience:
1. Open the game in your mobile browser
2. Add to home screen for app-like experience
3. Enjoy touch-optimized gameplay with haptic feedback

## 🛠️ Technical Details

- **No dependencies**: Pure HTML, CSS, and JavaScript
- **Progressive Web App ready**: Can be installed on mobile devices
- **Touch events**: Optimized for mobile interaction
- **Responsive breakpoints**: 768px and 480px for different screen sizes
- **Modern CSS**: Flexbox, Grid, CSS animations, and backdrop-filter
- **ES6+ JavaScript**: Class-based architecture with modern syntax
- **localStorage persistence**: Automatic game state and score saving
- **Real-time timer**: Game timer with persistence across sessions
- **Dynamic board generation**: Supports multiple board sizes with adaptive win detection
- **Dark mode support**: CSS-based theme switching with smooth transitions
- **Error handling**: Graceful fallback if localStorage is unavailable

## 🎨 Customization

The game is easily customizable:
- Colors can be changed in `style.css`
- Game logic can be modified in `script.js`
- Layout can be adjusted in `index.html`

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## 📁 File Structure

```
simple-x-o/
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Game logic and interactions
└── README.md       # This file
```

Enjoy playing! 🎉
