import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, addDoc, updateDoc, collection } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

if (!location.pathname.startsWith('/admin') && window.__trackingAllowed) {

const CFG = {
  apiKey: "AIzaSyC_zaNtYW8wnS7nhoOzEvkNhbJeJPHWmaI",
  authDomain: "bulweb2.firebaseapp.com",
  projectId: "bulweb2",
  storageBucket: "bulweb2.firebasestorage.app",
  messagingSenderId: "260150671022",
  appId: "1:260150671022:web:6dfa58bd50a9725cec9f3f"
};

const app = getApps().length ? getApps()[0] : initializeApp(CFG);
const db = getFirestore(app);

let visitorId = localStorage.getItem('_bvid');
if (!visitorId) {
  visitorId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  localStorage.setItem('_bvid', visitorId);
}

let sessionId = sessionStorage.getItem('_bsid');
if (!sessionId) {
  sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  sessionStorage.setItem('_bsid', sessionId);
}

function device() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

function browser() {
  const ua = navigator.userAgent;
  if (ua.includes('Edg'))                              return 'Edge';
  if (ua.includes('Chrome'))                           return 'Chrome';
  if (ua.includes('Firefox'))                          return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Other';
}

function source() {
  const ref = document.referrer;
  if (!ref || ref.includes(location.hostname)) return 'direct';
  if (/google\./i.test(ref))                   return 'google';
  if (/instagram\.com/i.test(ref))             return 'instagram';
  if (/facebook\.com|fb\.com/i.test(ref))      return 'facebook';
  if (/tripadvisor/i.test(ref))                return 'tripadvisor';
  if (/t\.co|twitter\.com/i.test(ref))         return 'twitter';
  return 'other';
}

const t0 = Date.now();
let ref = null;
let saved = false;

addDoc(collection(db, '_visits'), {
  page:      location.pathname.replace(/\/$/, '') || '/',
  ts:        t0,
  device:    device(),
  browser:   browser(),
  lang:      (navigator.language || 'und').slice(0, 2),
  source:    source(),
  visitorId: visitorId,
  sessionId: sessionId,
  duration:  0,
}).then(r => { ref = r; }).catch(() => {});

function flush() {
  if (!ref || saved) return;
  saved = true;
  const secs = Math.round((Date.now() - t0) / 1000);
  updateDoc(ref, { duration: secs }).catch(() => {});
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush();
});
window.addEventListener('pagehide', flush);

} // end admin guard
