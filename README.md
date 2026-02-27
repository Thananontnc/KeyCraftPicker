# ⌨️ KeyCraft Picker

A web application for mechanical keyboard part selection — helping users choose compatible parts, plan their builds, and calculate total costs with ease.

🔗 **Live Demo:** [https://keycraft-server.eastasia.cloudapp.azure.com](https://keycraft-server.eastasia.cloudapp.azure.com)

---

## 👥 Team Members

| Name | GitHub |
|------|--------|
| Thananon Chounudom | [@thananon](https://github.com/thananon) |
| Prathomporn Bunjua | [@prathomporn](https://github.com/prathomporn) |

> ⚠️ Replace the GitHub links above with the correct profile URLs.

---

## 📖 Project Description

Building a mechanical keyboard requires selecting many compatible components — cases, PCBs, switches, and keycaps. Beginners often struggle to know which parts work together, leading to costly mistakes.

**KeyCraft Picker** solves this by providing a step-by-step keyboard builder with automatic compatibility checking, price calculation, and build sharing — all in one place.

### 🎯 Target Users
- Beginners who want to build a mechanical keyboard
- Keyboard hobbyists planning their builds before purchasing

---

## ✨ Features

- 🔐 User authentication (Register / Login / Logout)
- 👤 User profiles with avatar upload and bio
- 🔧 Step-by-step Keyboard Builder (Case → PCB → Switch → Keycap)
- ✅ Automatic compatibility checking (layout, mounting type, pin type)
- 💰 Automatic total price calculation
- 💾 Save, rename, edit, and delete keyboard builds
- ❤️ Favorite builds (sorted first in your list)
- 🔗 Share builds via public shareable links
- 🖼️ Component image gallery for saved builds
- 🌟 Preset build recommendations (e.g. "The Creamy Dream", "The Thocky King")
- 🛠️ Admin dashboard to manage keyboard parts

---

## 🖼️ Screenshots

### Home Page
![Home Page](<img width="1512" height="855" alt="Screenshot 2569-02-27 at 14 03 50" src="https://github.com/user-attachments/assets/809327df-514f-45db-afd1-cd3a6067ed68" />)


### Keyboard Builder
![Keyboard Builder](screenshots/builder.png)

### Part Browser
![Part Browser](screenshots/parts.png)

### Build Detail
![Build Detail](screenshots/build-detail.png)

> Replace the screenshot paths above with your actual images.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Vanilla CSS |
| Backend | Next.js (App Router, Route Handlers) |
| Database | MongoDB |
| Deployment | Azure Virtual Machine |

---

## 🗄️ Data Models

**User** — ID, Username, Password, Role, Avatar, Bio, createdAt

**Parts** — ID, Name, Type, Price, Image, Specs (layout, mounting type, supported layout)

**Builds** — ID, UserID, Name, Parts (Case, PCB, Switch, Keycap), TotalPrice, createdAt, updatedAt

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/keycraft-picker.git

# Install dependencies
cd keycraft-picker
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
