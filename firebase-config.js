/**
 * Конфигурация веб-приложения Firebase (из Firebase Console → Project settings).
 * Authentication → Sign-in method: включите «Электронная почта/пароль».
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCtLQB1YB7jBh7XVFcChC8b0S28ckrIX-E",
  authDomain: "project-5429488667658138383.firebaseapp.com",
  projectId: "project-5429488667658138383",
  storageBucket: "project-5429488667658138383.firebasestorage.app",
  messagingSenderId: "668963040289",
  appId: "1:668963040289:web:b542e502b41141f1c0c760",
  measurementId: "G-ZG5YQSRL8V"
};

/** Вернёт true, если конфиг заполнен (не заглушки). */
export function isFirebaseConfigured() {
  const k = firebaseConfig.apiKey || "";
  return (
    k.length > 0 &&
    !k.includes("YOUR_") &&
    firebaseConfig.projectId &&
    !String(firebaseConfig.projectId).includes("YOUR_")
  );
}
