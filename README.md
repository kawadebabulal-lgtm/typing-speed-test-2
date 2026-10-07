# ⌨️ Typing Speed Test App

A lightweight, interactive web-based Typing Speed Test application built with HTML, CSS, JavaScript, and served via a Python Flask backend.

---

## 🚀 Features

* **Custom Paragraph Input**: Enter or paste any custom paragraph to test typing speed.
* **Real-time Metrics**: Automatically tracks:
  * ⏱️ **Timer**: Accurate time elapsed during typing.
  * ⚡ **WPM (Words Per Minute)**: Dynamically calculated based on completed characters.
  * 🎯 **Accuracy Percentage**: Measures precision against the original text.
* **Auto-completion Detection**: Automatically detects when typing is complete, stops the timer, and displays the final score card.
* **Flask Integration**: Served smoothly through a lightweight Python Flask local server.

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, CSS3, JavaScript (ES6)
* **Backend**: Python 3, Flask

---

## 📂 Project Structure

```text
typing-speed-test-2/
├── app.py              # Flask server routes
├── index.html          # Web application structure
├── style.css           # UI styling and layout
├── script.js           # Typing logic, timer, and WPM calculation
└── requirements.txt    # Python dependencies
