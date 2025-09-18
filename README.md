
# FastShark

Alternative client for the electronic diary “My School”.

## 🚀 Features

- Cross-platform support (iOS, Android, and Web)
- Online integration with the diary system
- Clean and user-friendly UI

## 📦 Technologies Used

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)

## 📁 Project Structure

```
app/
├── App.tsx               # Entry point of the application
├── index.ts              # Expo entry file
├── app.json              # Expo app configuration
├── eas.json              # EAS build configuration
├── tsconfig.json         # TypeScript configuration
├── babel.config.js       # Babel compiler configuration
├── declarations.d.ts     # Type declarations
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Lockfile for dependencies
├── assets/               # Images, fonts, media
├── components/           # Reusable UI components
├── config/               # App-wide configuration constants
├── styles/               # Global and reusable styles
├── api/                  # API request logic and helpers
├── store/                # State management (Zustand)
├── screens/              # App screen components
├── router/               # Navigation setup (React Navigation, etc.)
├── public/               # Static files for web (if used)
```

_Note: Some folders may not be present depending on the current stage of development._

## 🛠️ Installation

1. **Install dependencies**  
```bash
npm install
```

2. **Edit the configuration file**  
Make sure to update any necessary environment or app-level settings:

```
app/
├── config/
│   └── config.ts         # Main configuration file
```

3. **Start the development server**  
```bash
npm start
```

## 🙌 Acknowledgements

We would like to thank the contributors for their work on this project:

| Name             | GitHub                                   | Contributions                              |
|------------------|-------------------------------------------|---------------------------------------------|
| **Maxim Loza**   | [@NaximL](https://github.com/NaximL)      | Project structure, navigation, UI/UX design |
| **Ivan Demyanov**| [@rntdev1](https://github.com/rntdev1)    | Backend logic for message delivery          |

---