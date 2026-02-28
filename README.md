# 🐦 Nestbox — PigeonHole Web UI


## 🌟 Why Nest Box & PigeonHole?

People wanted a web-based app but sharing secrets shouldn't be scary.    
With Nestbox, your files are encrypted on *your* device, with your keys, before they ever leave. No servers see them. No logs store them. No third parties have access.

**Your files. Your keys. Your control.**

**Made with ❤️ for privacy-conscious people everywhere.**

---


> **Secure, encrypted file sharing with zero-knowledge architecture**
> Send files confidently knowing they're encrypted end-to-end before leaving your device.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![OpenPGP](https://img.shields.io/badge/OpenPGP-4096--bit-green?style=flat-square)

---

## ✨ Key Features

- **🔐 End-to-End Encryption** — RSA 4096-bit encryption entirely on your device. Not on servers, not in transit — only in your control.
- **🚀 Zero-Knowledge** — PigeonHole can't see your files, your keys, or your secrets. Ever.
- **💣 Self-Destructing Files** — One-time secrets that vanish after the first download.
- **👥 Multiple Recipients** — Share encrypted files with up to 3 people at once (while in beta)
- **👻 Transient Keys** — Send files to anyone, even without a PigeonHole account.
- **⏰ Smart Expiration** — Set your own rules: 1 hour, 1 day, 1 week, 1 month.
- **📊 Real-Time Progress** — Watch your files encrypt, upload, download, and decrypt in real-time.
- **🎨 Dark Mode & Light Mode** — Your preference, your comfort.
- **🔑 Multi-Account Support** — Manage keys for multiple identities seamlessly.

---

## 🏗️ Architecture

### The Security Model

**What happens on your device stays on your device.**

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build** | Vite (next-gen tooling) |
| **UI** | Material-UI v7 |
| **State** | Zustand (lightweight & fast) |
| **Crypto** | OpenPGP.js (battle-tested) |
| **HTTP** | Axios (updated to latest) |
| **Compression** | pako + custom tar |
| **Routing** | React Router v6 |
| **Auth** | Auth0 + PigeonHole JWT |
---

## 📖 How It Works

### Sending a Secret

1. **Upload** files via drag-and-drop or file picker
2. **Add** recipient email addresses (max 3)
3. **Configure** expiration time and options
4. **Click** Send — and watch the magic happen
5. **Share** Your recipient receives a notification

### Receiving a Secret

1. Navigate to **Receive Secrets**
2. See all secrets sent to you
3. **Download** one (downloads encrypted)
4. **Decrypt** automatically with your private key
5. **Extract** and use your files
6. If it was a one-time secret, it's already gone

### Multi-Account Support

Store keys for multiple identities. Switch between accounts instantly. Your keys stay encrypted in localStorage — only decrypted when you need them.

---

## 🔒 Security Highlights

### Key Storage
- Private keys encrypted with **AES-GCM**
- Stored in **localStorage** (never transmitted)
- **Per-email-address** encryption keys
- Keys **never leave your browser**

**Requires:** Web Crypto API, localStorage, ES2020 JavaScript

---


## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Key generation failed" | Browser may not support Web Crypto API. Try a modern browser or clear localStorage. |
| "Token exchange failed" | Verify Auth0 Client ID and API base URL. Check browser console. |
| "User not found" | Recipient may not have a PigeonHole account. Use Transient Key option. |
| "Decryption failed" | Secret may be encrypted for a different key. Try signing out and back in. |

---

## 📄 License

Review [LICENSE](./LICENSE)

---

## 🆘 Support & Documentation

Find how to get help and support on [https://pigeono.io/about/contribute/](https://pigeono.io/about/contribute/)

