````markdown
# 🐢 Sabancı Turtles Team Creator

A fun and interactive web-based app designed to help **me and my friends easily create football (halı saha) teams**. This project was built for personal use to speed up the team formation process before matches and is **strictly licensed to prevent unauthorized use or duplication**.

## ⚠️ License

**All rights reserved.**
This project is **exclusive** to the owner and **may not be copied, distributed, or used by others** without explicit permission.

---

## 📑 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license-1)

---

## ✨ Features

- Interactive football (soccer) field
- Drag & drop-style player assignment
- Add/remove players dynamically
- Two-team layout (Team 1 / Team 2)
- Localization support: Turkish 🇹🇷 and English 🇬🇧
- Responsive design using TailwindCSS

---

## 🛠 Installation

To run the app locally:

1. **Clone the repository** or download the files.
2. Open `index.html` in a browser (no build step required).
3. Make sure `app.jsx`, `styles.css`, and `index.html` are in the same directory.

> 🖥 This app compiles JSX directly in the browser using **Babel Standalone**. No Node.js or bundler is needed.

---

## ▶️ Usage

- Add player names using the input on the left.
- Click on a player to select.
- Click on Team 1 or Team 2 boxes to assign the selected player.
- Players appear on the field and can be moved by clicking their icon and then clicking the new location.
- Teams can have up to **7 players each**.
- Remove players or clear entire teams if needed.

---

## ⚙️ Configuration

You can set the **default language** in the source code by changing:

```jsx
const [language, setLanguage] = useState('tr'); // or 'en'
````

-----

## 📦 Dependencies

This project uses:

  - [React 18](https://reactjs.org/) (via UMD)
  - [ReactDOM 18](https://reactjs.org/)
  - [TailwindCSS](https://tailwindcss.com/) (via CDN)
  - [Babel Standalone](https://babeljs.io/docs/en/babel-standalone)

All dependencies are loaded via **CDN**, so no installation is required.

-----

## 🧪 Examples

Open `index.html` in your browser and start building teams\!

Default players include:

  - Mert.

-----

## 🧯 Troubleshooting

  - **JSX not compiling?** Ensure you're connected to the internet (Babel & React loaded via CDN).
  - **Nothing rendering?** Check browser console for syntax errors in `app.jsx`.

-----

## 👤 Contributors

  - **Original Developer**: [mert-gng-99(me)](https://github.com/mert-gng-99) 🎉
    This project was made **by me, for my friends**, to simplify organizing football(Halı Saha) matches.

-----

## 📄 License

```
All rights reserved.

This software is the intellectual property of the original developer.
Unauthorized use, reproduction, or distribution is strictly prohibited.
For personal use only.
