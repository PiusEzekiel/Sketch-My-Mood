<div align="center">

  <img src="https://raw.githubusercontent.com/pollinations/pollinations/main/assets/logo.svg" alt="Pollinations Logo" width="100" />
  
  # 🎨 Sketch My Mood
  
  <a href="https://pollinations.ai">
    <img src="https://img.shields.io/badge/Built%20with-Pollinations-8a2be2?style=for-the-badge&logo=data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20viewBox%3D%220%200%20124%20124%22%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2262%22%20r%3D%2262%22%20fill%3D%22%23ffffff%22/%3E%3C/svg%3E&logoColor=white&labelColor=6a0dad" alt="Built with Pollinations.ai" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />

  <br />

  **Paint your emotions.** *An AI-driven art therapy application that transforms the texture of your heart into visual masterpieces.*

</div>

---

## 📖 About The Project

**Sketch My Mood** is a sanctuary where feelings become art. By leveraging the power of **Pollinations.ai**, this application listens to your emotional state, refines it into poetic imagery, and generates high-resolution artwork that mirrors your soul.

Unlike standard image generators, this app focuses on **emotional intelligence**:
1.  **Analyzes** your raw mood description.
2.  **Extracts** a "Mood DNA" color palette (5 distinctive hex codes).
3.  **Refines** the concept into a complex artistic prompt using LLMs.
4.  **Generates** a 4K resolution sketch in your chosen art style.

---

## ✨ Features

-   **🧠 Poetic Intelligence**: Uses **Pollinations Text API** (OpenAI-compatible) to translate simple words like "anxious" into detailed, evocative scene descriptions.
-   **🎨 High-Fidelity Art**: Leverages the **Flux Model** via Pollinations.ai to generate stunning, coherent, and texture-rich images.
-   **🧬 Emotional DNA**: Automatically extracts a 5-color palette representing the visual fingerprint of your current mood.
-   **🖼️ Curated Styles**: Switch instantly between distinct artistic movements:
    * *Abstract, Cyberpunk, Watercolor, Renaissance, Charcoal, Surrealism.*
-   **⚡ Zero-Latency UX**: Features a custom "living" gallery with staggered animations and immediate feedback.
-   **📱 Mobile-First Design**: A cinematic, dark-themed UI built with **Tailwind CSS** that feels like a native app.
-   **💾 Local Archive**: Automatically saves your session history to local storage, allowing you to revisit your emotional journey.
-   **🧘 Mindful Limits**: Built-in logic limits sessions to **6 sketches** to encourage intentionality over mass production.

---

## 🚀 Tech Stack

-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Generative AI**: [Pollinations.ai](https://pollinations.ai/)
    -   `text.pollinations.ai` (Prompt Engineering & Logic)
    -   `image.pollinations.ai` (Flux Model Generation)

---

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone the repo
    cd Sketch-My-Mood
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory.  
    *(Note: Pollinations is free to use, but an API key is recommended for higher rate limits)*.
    ```env
    VITE_POLLINATIONS_API_KEY=your_key_here
    ```
    > Get your free key at [enter.pollinations.ai](https://enter.pollinations.ai)

4.  **Start the development server**
    ```sh
    npm run dev
    ```

---

## ☁️ Deployment

This project is built with **Vite**, so it requires a build step. Here is how to deploy it on **Render**:

1.  **Push** your code to GitHub.
2.  Create a **New Static Site** on Render.
3.  **Settings**:
    * **Build Command**: `npm run build`
    * **Publish Directory**: `dist`
4.  **Environment Variables**:
    * Add `VITE_POLLINATIONS_API_KEY` in the Render Environment tab.

---

## ❤️ Acknowledgements

This project is powered by the incredible open-source work of **Pollinations.ai**.

<a href="https://pollinations.ai">
  <img src="https://raw.githubusercontent.com/pollinations/pollinations/main/assets/logo-text.svg" alt="Pollinations.ai" width="200" />
</a>

* **Free & Open Source**: Democratizing access to state-of-the-art AI models.
* **Unified API**: Seamlessly combining text and image generation.
* **Community**: Built for developers, by developers.

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with 💜 and ☕</p>
</div>