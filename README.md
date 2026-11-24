# A Magical Birthday Surprise for Naina ❤️

A simple, romantic, and beautifully designed birthday surprise experience made for mobile phones and desktop, featuring the romantic Bollywood soundtrack **"Tum Se Hi" (Jab We Met)**, smooth animations, interactive action buttons, and memory keepsakes.

```
birthday-surprise/
├── index.html          # Clean structure with romantic chapters
├── css/style.css       # Mobile-first glassmorphism, responsive styles & animations
├── js/
│   ├── main.js         # Configuration, surprises logic, actions & Bollywood music
│   ├── animations.js   # Canvas stars, fireworks, confetti, balloons, Bollywood synth & haptics
│   ├── gallery.js      # Mobile story slideshow, double-tap hearts & secret memory notes
│   └── countdown.js    # 27 Nov IST countdown logic & calendar export (.ics)
├── assets/
│   ├── images/         # photo1.jpg … photo6.jpg
│   └── music/          # tose_naina.wav ("Tose Naina Jab Se Mile" acoustic arrangement)
├── run.bat             # One-click local launch script
└── README.md
```

---

## 🎶 Bollywood Music Experience ("Tose Naina Jab Se Mile")
Instead of standard generic birthday tunes, the experience features the iconic, soulful Bollywood melody **"Tose Naina Jab Se Mile"** (dedicated to Naina):
- **Audio Track**: Includes a studio-quality stereo acoustic arrangement of **"Tose Naina Jab Se Mile"** (`assets/music/tose_naina.wav`) with acoustic guitar plucks, warm bass, and lush strings.
- **Interactive Button**: Tap **`[ 🎵 Play "Tose Naina" Melody ]`** in the cake section anytime to hear the melody with fireworks!
- **Offline / Mobile Fallback**: The Web Audio API synthesizer also plays the melody natively, ensuring music always starts seamlessly on both Android and iPhone.
- **Easy Customization**: Want to change or add your own audio file? Simply place your MP3/WAV file in `assets/music/` and update `CONFIG.musicFile` in `js/main.js`!

---

## 🌟 Beautiful Features & Action Buttons

### 📱 1. Mobile-First Phone Experience
- **Touch & Haptic Feedback**: Every action button provides tactile tap micro-animations and phone vibration (`navigator.vibrate`).
- **Touch Sparks & Stardust**: Tapping or dragging across the phone screen spawns glowing stardust and floating hearts.
- **Double-Tap to Heart (Instagram Style)**: Double-tapping any photo pops a glowing 3D heart with sound and increments the live love counter.
- **Full-Screen Mobile Story Slideshow**: Tap **"▶️ Watch as Story Slideshow 📱"** to view photos like Instagram/WhatsApp stories with auto-progressing timer bars, pause on hold, and tap navigation!
- **Floating Thumb Dock**: Bottom-docked glass pill with music visualizer, quick "Send Hug" button, chapters menu, and volume control, tailored for iPhone and Android safe-area insets.

### 🎁 2. Actionable Buttons for Every Surprise
1. **Countdown & Love**:
   - **🥳 Celebrate Right Now!**: Instantly unlock full birthday celebration mode anytime!
   - **🤗 Send a Virtual Hug**: Live hug counter that showers the screen with affectionate stickers & harp sounds.
   - **📅 Save to Phone Calendar**: Generates & downloads a `.ics` calendar reminder for 27 November.
2. **Interactive Cake & Candle Ceremony**:
   - **💨 Blow Out the Candles!**: Blows out candle flames with soft smoke particles, plays cheer fanfare, and launches fireworks!
   - **🔪 Cut the Birthday Cake 🍰**: Slices the cake, floats a sweet celebratory slice forward with a personalized toast!
   - **🎈 Pop Party Balloons!**: Tap balloons directly or press the button to pop them with confetti!
   - **🎵 Play "Tum Se Hi" Melody**: Plays the acoustic Bollywood melody with sparklers.
3. **Memories & Milestones Timeline**:
   - **💫 Relive This**: Expands personal quotes and emotional reflections.
   - **🥰 Quick Emoji Reactions**: Tap reaction pills (`🥰`, `✨`, `🥹`) to react to individual memories!
4. **The Hand-Written Letter**:
   - **💌 Open The Letter**: Unfolds the 3D vintage envelope, breaks the wax seal, and types out the letter.
   - **⚡ Show Full Letter Instantly**: Quick-reveal button.
   - **💬 Reply to Naina on WhatsApp**: Opens WhatsApp with a pre-filled heartfelt reply!
5. **Redeemable Birthday Love Coupons**:
   - 5 unique coupons (*Coffee Date*, *Movie VIP Marathon*, *Late Night Ice Cream*, *Queen Day*, *Unlimited Hugs*).
   - **🎟️ Tap to Redeem! ✨**: Stamps the coupon as `CLAIMED! ✅` with a gold particle burst.
   - **📲 Claim on WhatsApp**: Immediately creates a WhatsApp message to redeem the coupon together!
6. **The Grand Mystery Box**:
   - **🎁 Tap to Unwrap Your Gift!**: Shakes the gift box, lifts the lid, and triggers a 360° fireworks burst.
7. **Cosmic Wishing Star & Finale**:
   - **🚀 Cast Wish into the Stars ✨**: Type or pick a wish and watch it shoot into the night sky!
   - **🎆 Launch Sky Fireworks Show**: Continuous sky fireworks.
   - **💖 Share on WhatsApp**: Native phone share sheet or WhatsApp link.

---

## 🚀 How to Run Locally
Double-click [`run.bat`](file:///c:/Users/himansu\Downloads\birthday-surprise\run.bat), or in terminal:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.
To preview birthday celebration mode any day: `http://localhost:8000/?mode=birthday`.

---

## 🎨 How to Customize
Open `js/main.js` and edit the `CONFIG` block at the top:
- Replace `CONFIG.photos` with your own images or captions.
- Edit `CONFIG.memories`, `CONFIG.letter`, and `CONFIG.finalMessage`.
- Put your favorite song file in `assets/music/` and change `CONFIG.musicFile`.
