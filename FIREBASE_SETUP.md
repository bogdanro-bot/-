# Настройка Firebase Authentication

Сайт использует **Firebase Auth** (вход и регистрация по **email и паролю**).

## 1. Создать проект Firebase

1. Откройте [Firebase Console](https://console.firebase.google.com/).
2. **Add project** (или выберите существующий проект).

## 2. Подключить веб-приложение

1. В проекте: **Project settings** (шестерёнка) → вкладка **General**.
2. В блоке **Your apps** нажмите значок **Web** `</>`.
3. Зарегистрируйте приложение (имя любое).
4. Скопируйте объект `firebaseConfig` (поля `apiKey`, `authDomain`, `projectId` и т.д.).

## 3. Включить вход по email/паролю

1. В меню слева: **Authentication** → **Get started**.
2. Вкладка **Sign-in method**.
3. Включите провайдер **Email/Password** (только email/password, без Google, если не нужно).

## 4. Вставить ключи в проект

Откройте файл **`firebase-config.js`** в корне сайта и замените значения:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

на те, что выдал Firebase.

## 5. Как открывать сайт

Модули ES (`import`) и Firebase по HTTPS работают надёжнее, если сайт открыт через **локальный сервер**, а не как `file:///...`.

Примеры:

- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) в VS Code / Cursor
- Или в терминале из папки проекта: `npx --yes serve .` и откройте указанный адрес (например `http://localhost:3000`).

После настройки конфигурации экран входа исчезнет после успешной регистрации или входа, и отобразится основной сайт.
