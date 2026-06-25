import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const sa = JSON.parse(readFileSync(new URL('../serviceAccount.json', import.meta.url)));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const CATS = ['hot-drinks','cold-drinks','sandwiches','pastries','filled','tartlets','cakes','ice-cream','alcohol','friday','shop','popups'];
function kind(v){ if(!v) return 'empty'; if(typeof v!=='string') return 'other'; if(v.startsWith('data:')) return 'base64'; if(v.startsWith('http')) return 'http'; return 'local'; }

console.log('collection            docs  local http b64 empty');
for (const c of CATS) {
  const snap = await db.collection(c).get();
  const t = { empty:0, base64:0, http:0, local:0 };
  snap.forEach(d => { const dt=d.data(); t[kind(dt.img||dt.imageURL||'')]++; });
  console.log(c.padEnd(20), String(snap.size).padStart(4), String(t.local).padStart(5), String(t.http).padStart(4), String(t.base64).padStart(4), String(t.empty).padStart(5));
}
// badges (icon JSON)
const bsnap = await db.collection('badges').get();
let bl=0,bh=0;
bsnap.forEach(d=>{ try{const o=JSON.parse(d.data().icon); kind(o.img)==='http'?bh++:bl++;}catch{} });
console.log('badges(icon.img)'.padEnd(20), String(bsnap.size).padStart(4), String(bl).padStart(5), String(bh).padStart(4));
process.exit(0);
