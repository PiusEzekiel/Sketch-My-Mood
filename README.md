# 🎨 Sketch My Mood

**Sketch My Mood** is an AI-powered art therapy application that transforms your emotional state into stunning visual masterpieces. Using Google's Gemini API, the app analyzes your mood, refines it into an artistic prompt, extracts a unique "Mood DNA" color palette, and generates a one-of-a-kind image in your chosen artistic style.

---

## ✨ Features

- **Emotional Refinement**: Uses `gemini-3-flash-preview` to translate simple mood descriptions into deep, evocative artistic prompts.
- **AI Art Generation**: Leverages `gemini-2.5-flash-image` for high-quality, expressive visual sketches.
- **Mood DNA**: Automatically extracts a 5-color palette representing your current emotional state.
- **Artistic Styles**: Choose from Abstract, Cyberpunk, Watercolor, Renaissance, Charcoal, or Surrealism.
- **Session Gallery**: Save your creations to local history.
- **Smart Sharing**: Share your art directly via the Web Share API or download it for high-res use.
- **Responsive Design**: A sleek, dark-themed UI built with Tailwind CSS that works beautifully on mobile and desktop.
- **Session Limits**: Built-in logic to limit generations to 5 per session (via local storage) to keep the experience focused and intentional.

---

## 🚀 Tech Stack

- **Frontend**: React (ES6 Modules)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Intelligence**: [@google/genai](https://www.npmjs.com/package/@google/genai)
  - `gemini-3-flash-preview` (Logic & Palette)
  - `gemini-2.5-flash-image` (Image Generation)

---

## 🛠️ Getting Started

### 1. Prerequisites
- A Google Gemini API Key. You can get one for free at [Google AI Studio](https://aistudio.google.com/).

### 2. Installation
Clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/sketch-my-mood.git
cd sketch-my-mood
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your API key:
```env
API_KEY=your_gemini_api_key_here
```

### 4. Running Locally
Since this project uses modern ES6 modules and import maps, you can run it using any simple static file server.

**Using VS Code Live Server:**
Right-click `index.html` and select **Open with Live Server**.

**Using Node.js (npx):**
```bash
npx serve .
```

---

## ☁️ Deployment to Render

To host this app on [Render](https://render.com), follow these steps:

1. **Push your code to GitHub** (Ensure `.env` is in your `.gitignore`).
2. **Create a new Static Site** on Render.
3. **Connect your GitHub repository**.
4. **Build Command**: (Leave empty or use a no-op like `echo skip`).
5. **Publish Directory**: `.` (The root directory).
6. **Environment Variables**:
   - Go to the "Environment" tab in your Render dashboard.
   - Add a new key: `API_KEY` with your Gemini API key as the value.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
