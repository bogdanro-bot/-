import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAnalytics,
  isSupported as analyticsIsSupported
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

let auth = null;

const authScreen = document.getElementById("authScreen");
const siteShell = document.getElementById("siteShell");
const authError = document.getElementById("authError");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const tabLogin = document.querySelector('[data-auth-tab="login"]');
const tabRegister = document.querySelector('[data-auth-tab="register"]');
const signOutBtn = document.getElementById("signOutBtn");
const authUserEmail = document.getElementById("authUserEmail");
const authBoot = document.getElementById("authBoot");

function hideBoot() {
  if (authBoot) {
    authBoot.hidden = true;
    authBoot.setAttribute("aria-busy", "false");
  }
}

function showAuthError(message) {
  if (!authError) return;
  authError.textContent = message;
  authError.hidden = false;
}

function clearAuthError() {
  if (!authError) return;
  authError.textContent = "";
  authError.hidden = true;
}

function setTab(mode) {
  if (!loginForm || !registerForm || !tabLogin || !tabRegister) return;
  const isLogin = mode === "login";
  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  tabLogin.classList.toggle("auth-tab--active", isLogin);
  tabRegister.classList.toggle("auth-tab--active", !isLogin);
  tabLogin.setAttribute("aria-selected", isLogin ? "true" : "false");
  tabRegister.setAttribute("aria-selected", !isLogin ? "true" : "false");
  clearAuthError();
}

function fillProfileFields(user) {
  if (!user) return;
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value != null && value !== "" ? String(value) : "—";
  };
  setText("profileEmail", user.email);
  setText("profileUid", user.uid);
  setText("profileVerified", user.emailVerified ? "Да" : "Нет");
  const meta = user.metadata;
  if (meta) {
    setText("profileCreated", meta.creationTime || "—");
    setText("profileLastLogin", meta.lastSignInTime || "—");
  }
}

function showSite(user) {
  hideBoot();
  if (authScreen) authScreen.hidden = true;
  if (siteShell) siteShell.hidden = false;
  if (authUserEmail && user && user.email) {
    authUserEmail.textContent = user.email;
    authUserEmail.hidden = false;
  } else if (authUserEmail) {
    authUserEmail.textContent = "";
    authUserEmail.hidden = true;
  }
  fillProfileFields(user);
  window.dispatchEvent(new CustomEvent("site-visible", { detail: { user } }));
}

function showAuthGate() {
  hideBoot();
  if (authScreen) authScreen.hidden = false;
  if (siteShell) siteShell.hidden = true;
}

function mapAuthError(code) {
  const map = {
    "auth/email-already-in-use": "Этот email уже зарегистрирован. Войдите или восстановите пароль в консоли Firebase.",
    "auth/invalid-email": "Некорректный email.",
    "auth/weak-password": "Пароль слишком слабый (минимум 6 символов).",
    "auth/user-disabled": "Аккаунт отключён.",
    "auth/user-not-found": "Пользователь не найден. Проверьте email или зарегистрируйтесь.",
    "auth/wrong-password": "Неверный пароль.",
    "auth/invalid-credential": "Неверный email или пароль.",
    "auth/too-many-requests": "Слишком много попыток. Попробуйте позже."
  };
  return map[code] || "Ошибка входа. Проверьте данные и настройки Firebase.";
}

if (!isFirebaseConfigured()) {
  showAuthError(
    "Укажите реальные ключи в файле firebase-config.js (скопируйте из Firebase Console → Project settings)."
  );
}

tabLogin?.addEventListener("click", () => setTab("login"));
tabRegister?.addEventListener("click", () => setTab("register"));

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAuthError();
  if (!isFirebaseConfigured()) {
    showAuthError("Сначала настройте firebase-config.js.");
    return;
  }
  const email = document.getElementById("loginEmail")?.value?.trim();
  const password = document.getElementById("loginPassword")?.value;
  if (!auth) return;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    showAuthError(mapAuthError(err.code));
  }
});

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAuthError();
  if (!isFirebaseConfigured()) {
    showAuthError("Сначала настройте firebase-config.js.");
    return;
  }
  const email = document.getElementById("registerEmail")?.value?.trim();
  const password = document.getElementById("registerPassword")?.value;
  if (!auth) return;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    showAuthError(mapAuthError(err.code));
  }
});

signOutBtn?.addEventListener("click", async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
});

if (isFirebaseConfigured()) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  if (firebaseConfig.measurementId) {
    analyticsIsSupported()
      .then((ok) => {
        if (ok) {
          getAnalytics(app);
        }
      })
      .catch(() => {});
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      showSite(user);
    } else {
      showAuthGate();
    }
  });
} else {
  hideBoot();
  showAuthGate();
}
