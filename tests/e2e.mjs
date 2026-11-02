// ブラウザでの通し操作（Playwright・Chromium、iPhone 幅 390×844）
//   node tests/e2e.mjs
// 主な画面と、v0.6 の学習記録の引き継ぎ、一部のデータだけ古いときの警告を確かめる。
import fs from 'fs';
import http from 'http';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, r));
const U = `http://localhost:${server.address().port}/`;

let fail = 0, pass = 0;
const ok = (cond, msg) => { if (cond) pass++; else { fail++; console.log('FAIL', msg); } };
const browser = await chromium.launch();

async function newPage({ state = null, route = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true, serviceWorkers: 'block' });
  if (state) await ctx.addInitScript((s) => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('lemma.v2', s); } }, JSON.stringify(state));
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') page.errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  if (route) await route(page);
  return page;
}
const next = (page) => page.locator('button:has-text("次")').first().click();

try {
  // 1. 起動・今日・入力採点・判定がおかしい？・内蔵問題
  {
    const page = await newPage();
    await page.goto(U + '#today'); await page.waitForTimeout(1200);
    ok(await page.locator('#lv button').count() === 6, '難易度ボタンが6つ（基礎〜最難関）');
    ok(await page.locator('.banner').count() === 0, '起動時に警告が出ない');
    await page.evaluate("__lemma.open(['I-EXP-001', 'A-INT-005', 'q01'])"); await page.waitForTimeout(800);
    ok((await page.locator('.chip').allInnerTexts()).some(t => t.includes('入力して採点')), '入力して採点のチップ');
    await page.locator('#conf button').nth(2).click();
    const inputs = page.locator('#inputs input');
    const vals = ['1', '0', '-10', '0', '9', '-16', '-16<k<9'];
    for (let i = 0; i < vals.length; i++) await inputs.nth(i).fill(vals[i]);
    await page.click('#judge'); await page.waitForTimeout(500);
    ok((await page.locator('.verdict').innerText()).includes('完答'), 'I-EXP-001 を正しく答えて完答');
    await next(page); await page.waitForTimeout(600);
    await page.locator('#conf button').nth(1).click();
    await page.locator('#inputs input').nth(0).fill('(4,26)');
    await page.locator('#inputs input').nth(1).fill('(28,42),(10,59)');
    await page.click('#judge'); await page.waitForTimeout(400);
    ok((await page.locator('#feedback').innerText()).includes('1つ正解'), '一部だけ正しいと「2つのうち1つ正解」');
    await page.click('#giveup'); await page.waitForTimeout(400);
    await page.locator('.dispute').first().click(); await page.waitForTimeout(300);
    ok((await page.locator('.verdict').innerText()).includes('完答'), '判定がおかしい？で完答に変わる');
    await next(page); await page.waitForTimeout(600);
    ok((await page.locator('.chip').allInnerTexts()).some(t => t.includes('数I・2次関数')), '内蔵問題 q01 の分野チップ');
    ok(await page.locator('#conf button').count() === 3, '内蔵問題に自信度ボタン');
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('lemma.v2')));
    ok(st.pstat['I-EXP-001'] && st.pstat['A-INT-005'], '結果が問題ID で記録される');
    ok(page.errors.length === 0, `ページのエラーなし ${page.errors}`);
  }
  // 2. 基礎だけのセット・計算・設定（テーマ・CSV）・グラフ・定着度
  {
    const page = await newPage();
    await page.goto(U + '#today'); await page.waitForTimeout(1200);
    for (const k of ['1', '2', '3', '4', '5']) await page.click(`#lv button[data-l="${k}"]`);
    await page.locator('.hero').first().click(); await page.waitForTimeout(1200);
    ok((await page.locator('.chip').allInnerTexts()).includes('基礎'), '基礎だけ選ぶと基礎の問題が出る');
    await page.goto(U + '#drill'); await page.waitForTimeout(600);
    await page.locator('.drill-card').first().click(); await page.waitForTimeout(500);
    ok(await page.locator('.drill input').count() > 0, '計算トレーニングが始まる');
    await page.goto(U + '#settings'); await page.waitForTimeout(600);
    await page.locator('.segment.theme button:has-text("ダーク")').click();
    ok(await page.evaluate(() => document.documentElement.dataset.theme) === 'dark', 'ダークモード');
    await page.goto(U + '#graph'); await page.waitForTimeout(800);
    ok(await page.locator('canvas').count() > 0, 'グラフ画面');
    await page.goto(U + '#map'); await page.waitForTimeout(600);
    ok((await page.locator('#view').innerText()).includes('定着度'), '定着度画面');
    ok(page.errors.length === 0, `ページのエラーなし ${page.errors}`);
  }
  // 3. v0.6 の学習記録を入れた端末
  {
    const old = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/state-v0.6.json'), 'utf8'));
    const page = await newPage({ state: old });
    await page.goto(U + '#today'); await page.waitForTimeout(1200);
    await page.goto(U + '#map'); await page.waitForTimeout(600);
    await page.goto(U + '#settings'); await page.waitForTimeout(600);
    const dl = page.waitForEvent('download');
    await page.click('#csvall');
    const csv = fs.readFileSync(await (await dl).path(), 'utf8');
    ok(csv.split('\n').filter(l => l.trim()).length === old.log.length + 1, `CSV に v0.6 の記録 ${old.log.length}件がすべて出る`);
    await page.evaluate("__lemma.open(['I-EXP-001'])"); await page.waitForTimeout(800);
    await page.locator('#conf button').nth(1).click();
    const all = page.locator('#inputs input');
    const wrong = ['2', '0', '-10', '0', '9', '-16', '-16<k<9'];   // 1つ目だけ違う
    for (let i = 0; i < wrong.length; i++) await all.nth(i).fill(wrong[i]);
    await page.click('#judge'); await page.waitForTimeout(300);
    await page.click('#giveup'); await page.waitForTimeout(300);
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('lemma.v2')));
    ok(Object.keys(old.pstat).every(k => st.pstat[k]), 'v0.6 の復習状態がすべて残る');
    ok(st.practice.fields.join() === old.practice.fields.join(), '選んでいた分野が残る');
    ok(st.log.length === old.log.length + 1, '学習記録が続きに足される');
    ok(page.errors.length === 0, `ページのエラーなし ${page.errors}`);
  }
  // 4. 一部の data/ だけ古い（f-I-01.json の版が違う）
  {
    const page = await newPage({ route: (p) => p.route('**/data/f-I-01.json', async (r) => {
      const res = await r.fetch(); const d = await res.json(); d._meta = { dataVersion: 'old000000000' };
      await r.fulfill({ response: res, body: JSON.stringify(d) });
    }) });
    await page.goto(U + '#today'); await page.waitForTimeout(1200);
    await page.evaluate("__lemma.open(['I-EXP-001'])"); await page.waitForTimeout(800);
    const b = page.locator('.banner');
    ok(await b.count() === 1 && (await b.innerText()).includes('data/f-I-01.json'), '古い本文ファイルを読むと警告が出る');
    ok(await page.locator('#inputs input').count() > 0, '警告が出ても問題は解ける');
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`e2e: ${pass} 件 OK${fail ? `、${fail} 件失敗` : ''}`);
process.exitCode = fail ? 1 : 0;
