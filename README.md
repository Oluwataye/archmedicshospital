# 🏥 ARCHMEDICS Hospital System (The Handbook)

**Hi there, Future Tech Genius! 👋**

Welcome to the **Archmedics Hospital Management System**. This is a super cool program that helps hospitals run smoothly. Imagine a big digital brain that remembers every patient, every medicine, and every doctor's appointment. That's what this is!

Think of this project like a giant Lego set. You have different pieces (features) that fit together to build a complete hospital.

---

## 🧐 What Can This Do?

*   **Doctors** can see their patients. 👨‍⚕️
*   **Nurses** can give medicine (digitally!). 👩‍⚕️
*   **Cashiers** can take payments. 💰
*   **Admins** (that's you!) can see everything happening. 👑

---

## 🛠️ What You Need (The Toolbelt)

Before we start building, you need 3 special tools on your computer. Ask an adult if you need help installing them!

1.  **Node.js** (The Engine): This runs the code.
    *   Download the "LTS" version from [nodejs.org](https://nodejs.org/).
2.  **Git** (The Time Machine): This saves your work so you never lose it.
    *   Download from [git-scm.com](https://git-scm.com/).
3.  **VS Code** (The Notebook): This is where we write the code.
    *   Download from [code.visualstudio.com](https://code.visualstudio.com/).

---

## 🚀 How to Run It (Let's Go!)

To turn on the hospital system, we need to open **two** windows. It's like turning on the TV *and* the cable box.

### Window 1: The Brain (Backend)
1.  Open your **Command Prompt** (terminal).
2.  Go to the project folder.
    *   *Tip: Type `cd archmedics-hms-offline-main` and hit Enter.*
3.  Type this magic spell and hit Enter:
    ```bash
    npm run start:prod
    ```
    *Wait until it says "Server running on port 3001".*

### Window 2: The Face (Frontend)
1.  Open a **NEW** Command Prompt window.
2.  Go to the project folder again.
    *   *Tip: Type `cd archmedics-hms-offline-main` and hit Enter.*
3.  Type this spell:
    ```bash
    npm run dev
    ```
    *Wait until it says "Ready in..."*

### Open the Hospital
Click on the link `http://localhost:5173` (or whatever it shows) to open the hospital in your web browser!

---

## ☁️ How to Save to GitHub (The "Cloud")

This is super important! **GitHub** is like a cloud locker where you keep your code safe. If your computer breaks, your code is safe in the locker.

Here is how you put your work in the locker. You do this **every time** you finish a cool new feature.

### Step 1: Pack the Box (Git Add)
First, we gather all the files we changed.
Type this in your terminal:
```bash
git add .
```
*(Don't forget the dot at the end! It means "everything".)*

### Step 2: Seal the Box (Git Commit)
Now we tape the box shut and write a label on it so we know what's inside.
Type this:
```bash
git commit -m "I added a cool new button"
```
*(Change the message inside the quotes to describe what you actually did!)*

### Step 3: Send it to the Cloud (Git Push)
Now we send the box to GitHub!
Type this:
```bash
git push
```

**🎉 That's it!** You successfully saved your work to the internet. You are a real developer now!

---

## 🔑 Secret Passwords (Don't Tell Spies!)

When you log in, use these keys:

*   **Super Admin**: `admin@archmedics.com` (Password: `admin123`)
*   **Doctor**: `doctor@archmedics.com` (Password: `doctor123`)
*   **Nurse**: `nurse@archmedics.com` (Password: `nurse123`)

---

## 🐛 Uh Oh! Something Broke? (Troubleshooting)

*   **"Command not found"**: Did you install Node.js?
*   **"Port already in use"**: You might have the server running twice. Close all the black windows and try again.
*   **Red errors on screen**: Don't panic! Read the error message. It usually tells you exactly what went wrong.

---

**Have fun building! 🧱**
