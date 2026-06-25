// One-off migration: move all menu/shop/badge/popup images to Cloudinary,
// rewriting the corresponding Firestore field to the Cloudinary secure_url.
//
// Usage:
//   node scripts/migrate-img-cloudinary.mjs            # DRY RUN (no writes)
//   node scripts/migrate-img-cloudinary.mjs --apply    # perform uploads + Firestore writes
//
// Idempotent: values already on http(s) are skipped.
// Local files are NOT deleted (kept as fallback).

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { v2 as cloudinary } from 'cloudinary';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const APPLY = process.argv.includes('--apply');

// ── creds ──────────────────────────────────────────────
const sa = JSON.parse(readFileSync(path.join(ROOT, 'serviceAccount.json')));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const env = Object.fromEntries(
  readFileSync(path.join(ROOT, 'cloudinary.env'), 'utf8')
    .split('\n').filter(Boolean)
    .map(l => l.split('=').map(s => s.trim())).filter(a => a.length === 2)
);
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// ── helpers ────────────────────────────────────────────
const isHttp = v => typeof v === 'string' && v.startsWith('http');
const isData = v => typeof v === 'string' && v.startsWith('data:');
const isLocal = v => typeof v === 'string' && v && !isHttp(v) && !isData(v);

// Resolve a Firestore local path to a real file on disk.
function resolveLocal(p) {
  let rel = p.replace(/^(\.\.\/)+/, '').replace(/^\//, ''); // strip ../ and leading /
  const abs = path.join(ROOT, rel);
  return existsSync(abs) ? abs : null;
}

const uploadCache = new Map(); // dedupe identical sources within a run

async function toCloudinary(source, publicHint) {
  if (uploadCache.has(source)) return uploadCache.get(source);
  if (!APPLY) { uploadCache.set(source, '<dry-run-url>'); return '<dry-run-url>'; }
  const res = await cloudinary.uploader.upload(source, {
    folder: 'bulweb/menu',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'image',
  });
  uploadCache.set(source, res.secure_url);
  return res.secure_url;
}

const stats = { skippedHttp: 0, migratedLocal: 0, migratedBase64: 0, missingFile: 0, errors: 0 };

// ── 1. menu categories + shop: field `img` ─────────────
const IMG_COLLECTIONS = ['hot-drinks','cold-drinks','sandwiches','pastries','filled','tartlets','cakes','ice-cream','alcohol','friday','shop'];

for (const col of IMG_COLLECTIONS) {
  const snap = await db.collection(col).get();
  for (const doc of snap.docs) {
    const v = doc.data().img;
    if (!v) continue;
    if (isHttp(v)) { stats.skippedHttp++; continue; }

    let src = null, label = '';
    if (isData(v)) { src = v; label = 'base64'; }
    else if (isLocal(v)) {
      const f = resolveLocal(v);
      if (!f) { console.log(`  ⚠ MISSING FILE  ${col}/${doc.id}: ${v}`); stats.missingFile++; continue; }
      src = f; label = v;
    } else continue;

    try {
      const url = await toCloudinary(src);
      console.log(`  ${col}/${doc.id}: [${label}] -> ${url}`);
      if (APPLY) await doc.ref.update({ img: url });
      isData(v) ? stats.migratedBase64++ : stats.migratedLocal++;
    } catch (e) { console.log(`  ✗ ERROR ${col}/${doc.id}: ${e.message}`); stats.errors++; }
  }
}

// ── 2. popups: field `imageURL` ────────────────────────
{
  const snap = await db.collection('popups').get();
  for (const doc of snap.docs) {
    const v = doc.data().imageURL;
    if (!v || isHttp(v)) { if (isHttp(v)) stats.skippedHttp++; continue; }
    let src = isData(v) ? v : resolveLocal(v);
    if (!src) { console.log(`  ⚠ MISSING FILE popups/${doc.id}: ${v}`); stats.missingFile++; continue; }
    try {
      const url = await toCloudinary(src);
      console.log(`  popups/${doc.id}: [imageURL] -> ${url}`);
      if (APPLY) await doc.ref.update({ imageURL: url });
      isData(v) ? stats.migratedBase64++ : stats.migratedLocal++;
    } catch (e) { console.log(`  ✗ ERROR popups/${doc.id}: ${e.message}`); stats.errors++; }
  }
}

// ── 3. badges: field `icon` is a JSON string with .img ─
{
  const snap = await db.collection('badges').get();
  for (const doc of snap.docs) {
    let obj;
    try { obj = JSON.parse(doc.data().icon); } catch { continue; }
    const v = obj.img;
    if (!v || isHttp(v)) { if (isHttp(v)) stats.skippedHttp++; continue; }
    let src = isData(v) ? v : resolveLocal(v);
    if (!src) { console.log(`  ⚠ MISSING FILE badges/${doc.id}: ${v}`); stats.missingFile++; continue; }
    try {
      const url = await toCloudinary(src);
      obj.img = url;
      console.log(`  badges/${doc.id}: [icon.img] ${v} -> ${url}`);
      if (APPLY) await doc.ref.update({ icon: JSON.stringify(obj) });
      isData(v) ? stats.migratedBase64++ : stats.migratedLocal++;
    } catch (e) { console.log(`  ✗ ERROR badges/${doc.id}: ${e.message}`); stats.errors++; }
  }
}

console.log('\n────────────────────────────');
console.log(APPLY ? 'APPLIED' : 'DRY RUN (no writes)');
console.log(JSON.stringify(stats, null, 2));
process.exit(stats.errors ? 1 : 0);
