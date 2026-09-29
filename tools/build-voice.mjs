#!/usr/bin/env node
// Records everything the princess says as MP3 clips (Google Cloud Text-to-Speech) into voice/.
//
//   GOOGLE_TTS_API_KEY=... node tools/build-voice.mjs         record new sentences, drop unused clips
//   node tools/build-voice.mjs --dry                          only list what would be recorded
//
// The sentences are rebuilt from the game data in index.html (clothes, colours, worlds, riddles), so new
// items are picked up automatically. The templates below mirror the say(...) calls in index.html: when a
// sentence there changes, change it here too. Anything without a clip is spoken by the tablet voice instead.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const VOICE = 'de-DE-Chirp3-HD-Laomedeia', RATE = 0.9;
const ROOT = new URL('../', import.meta.url), OUT = new URL('voice/', ROOT);
const DRY = process.argv.includes('--dry');

/* ---------- game data, straight from index.html (everything above "Game state & UI" is plain data) ---------- */
const html = readFileSync(new URL('index.html', ROOT), 'utf8');
const script = html.slice(html.indexOf("'use strict';") + 13, html.indexOf('Game state & UI'));
const G = vm.runInNewContext(`(() => { ${script.slice(0, script.lastIndexOf('/*'))}
  return { K, COLORS, CATS, CHARS, THEMES, SPECIALS, COUNTS, SHAPES, NUMW, ALL, SONGS, XMAS_SONG, phrase, adj, cap }; })()`, {});
const { K, COLORS, CATS, CHARS, THEMES, SPECIALS, COUNTS, SHAPES, NUMW, ALL, SONGS, XMAS_SONG, phrase, adj, cap } = G;
const ITEMS = Object.values(K);
const PRAISE = ['Super', 'Toll', 'Richtig', 'Klasse', 'Prima', 'Wunderbar', 'Genau'];
const isWrongFor = (k, th) => k.themes.length > 0 && !k.themes.includes(th.id) && !(k.neutral || []).includes(th.id) && k.themes.every(t => th.wrongFrom.includes(t));
const colorsOf = k => (k.colors.length ? k.colors : [null]);

/* ---------- every sentence the game can say ---------- */
// A sentence is either recorded whole, or as separate clips per sentence part ("Super!" + "Die blaue Mütze!"),
// which the game plays back to back. Splitting keeps combinations like praise × item from multiplying.
const sentences = t => t.split(/(?<=[.!?])\s+/);
const clips = new Set(), spoken = [];
const line = (text, units = [text]) => { spoken.push(text); units.forEach(u => clips.add(u)); };
const split = text => line(text, sentences(text));

// Start, navigation, album
line('Hallo! Wer spielt heute mit?'); line('Wer spielt mit?'); line('Wohin gehen wir jetzt?');
line('Das Fotoalbum!'); line('Das Album ist noch leer.');
CHARS.forEach(c => {
  line(`Hallo, ich bin ${c.name}! Wohin gehen wir heute?`); line(`Ich bin ${c.name}!`);
  THEMES.forEach(t => line(`${c.name}: ${t.name}!`));
});
// Dressing up
THEMES.forEach(t => line(t.intro));
CATS.forEach(c => line(c.say));
line('Weg damit!'); line('Magst du ein Rätsel? Tipp auf den Stern!');
Object.values(COLORS).forEach(c => line(c.name + '!'));
ITEMS.forEach(k => colorsOf(k).forEach(c => {
  const name = cap(phrase(k, c)) + '!', call = k.call ? ' ' + k.call : '';
  line(name + (k.sayExtra ? ' ' + k.sayExtra : '') + call); // put on
  line(name + call); // tapped again
  if (k.call) line(k.call); // pet tapped
}));
['Hihi!', 'Das kitzelt!', 'Ich sehe toll aus!', 'Danke schön!', 'Du bist super!', 'Juhu!'].forEach(t => line(t));
['Simsalabim!', 'Abrakadabra!', 'Hokuspokus!'].forEach(t => line(t));
['Klick! Das kommt ins Fotoalbum.', 'Cheese! Ein tolles Foto!', 'Wunderschön! Das Foto ist im Album.'].forEach(t => line(t));
[...SONGS, XMAS_SONG].forEach(s => line(`Musik! Wir tanzen zu ${s.name}!`));
['Toll getanzt!', 'Das hat Spaß gemacht!', 'Bravo! Du tanzt super!'].forEach(t => line(t));
// Stars and surprises (stars keep counting, so milestones are recorded up to 500)
SPECIALS.forEach(k => {
  line(`Wow, ${k.need} Sterne! Eine Überraschung! Tipp auf das Geschenk!`);
  line(`Juhu! ${cap(phrase(k))} ${k.g === 'pl' ? 'sind' : 'ist'} neu im Kleiderschrank. Tipp darauf zum Anziehen!`);
});
for (let n = 5; n <= 500; n += 5) {
  if (!SPECIALS.some(k => k.need === n)) line(`Wow! Schon ${n} Sterne! Du bist ein Rätsel-Profi!`, [`Wow! Schon ${n} Sterne!`, 'Du bist ein Rätsel-Profi!']);
}
// Riddle: colours
ITEMS.filter(k => k.colors.length >= 3).forEach(k => k.colors.forEach(c => {
  line(`Wo ${k.g === 'pl' ? 'sind' : 'ist'} ${phrase(k, c)}?`);
  PRAISE.forEach(p => split(`${p}! ${cap(phrase(k, c))}!`));
  k.colors.forEach(w => { if (w !== c) split(`Das ist ${COLORS[w].name}. Such ${COLORS[c].name}!`); });
}));
// Riddle: what fits
THEMES.forEach(th => {
  line(th.fitQ);
  ITEMS.forEach(k => {
    const verb = k.g === 'pl' ? 'passen' : 'passt';
    if (k.themes.includes(th.id)) split(`Ja! ${cap(phrase(k))} ${verb} super ${th.fitTo}!`);
    if (isWrongFor(k, th)) split(`Hmm, ${phrase(k)} ${verb} nicht ${th.fitTo}. Versuch es nochmal!`);
  });
});
// Riddle: counting
line('Hmm, lass uns zusammen zählen!');
for (let n = 1; n <= 5; n++) { line(NUMW[n]); split(`${NUMW[n]}! Tipp auf die ${n}.`); }
THEMES.forEach(th => th.counts.forEach(o => {
  line(`Wie viele ${COUNTS[o].pl} siehst du?`);
  split(`Richtig! ${COUNTS[o].one}!`);
  for (let n = 2; n <= 5; n++) split(`Richtig! ${NUMW[n]} ${COUNTS[o].pl}!`);
}));
// Riddle: shapes
Object.values(SHAPES).forEach(S => {
  const art = S.g === 'm' ? 'der' : 'das';
  line(`Wo ist ${art} ${S.name}?`);
  ALL.forEach(c => PRAISE.forEach(p => split(`${p}! ${cap(art)} ${adj(c, false)} ${S.name}!`)));
  Object.values(SHAPES).forEach(W => { if (W !== S) split(`Das ist ein ${W.name}. Such ${S.g === 'm' ? 'den' : 'das'} ${S.name}!`); });
});

/* ---------- record ---------- */
const idOf = t => createHash('sha1').update(`${VOICE}|${RATE}|${t}`).digest('hex').slice(0, 12);
const lines = Object.fromEntries([...clips].sort((a, b) => a.localeCompare(b, 'de')).map(t => [t, idOf(t)]));

// Same lookup as Voice.plan() in index.html: longest run of sentence parts that has a clip, then the rest.
const covered = text => {
  const p = sentences(text);
  for (let i = 0; i < p.length;) { let j = p.length; while (j > i && !lines[p.slice(i, j).join(' ')]) j--; if (j === i) return false; i = j; }
  return true;
};
const gaps = spoken.filter(t => !covered(t));
if (gaps.length) throw new Error('Not covered:\n' + gaps.join('\n'));

const todo = Object.entries(lines).filter(([, id]) => !existsSync(new URL(id + '.mp3', OUT)));
const chars = todo.reduce((a, [t]) => a + t.length, 0);
console.log(`${spoken.length} sentences, ${Object.keys(lines).length} clips, ${todo.length} new (${chars} characters)`);
if (DRY) { todo.forEach(([t]) => console.log('  ' + t)); process.exit(0); }

const KEY = process.env.GOOGLE_TTS_API_KEY;
if (todo.length && !KEY) { console.error('GOOGLE_TTS_API_KEY is not set'); process.exit(1); }
mkdirSync(OUT, { recursive: true });
async function record(text, id) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY },
      body: JSON.stringify({ input: { text }, voice: { languageCode: 'de-DE', name: VOICE }, audioConfig: { audioEncoding: 'MP3', speakingRate: RATE } })
    });
    if (res.ok) { writeFileSync(new URL(id + '.mp3', OUT), Buffer.from((await res.json()).audioContent, 'base64')); return; }
    if (attempt >= 5 || ![429, 500, 502, 503].includes(res.status)) throw new Error(`${res.status} for "${text}": ${await res.text()}`);
    await new Promise(r => setTimeout(r, 1000 * 2 ** attempt));
  }
}
let done = 0;
const queue = todo.slice();
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let job; (job = queue.shift());) { await record(...job); if (++done % 50 === 0) console.log(`  ${done}/${todo.length}`); }
}));

// Index for the game (one line per clip keeps diffs readable), then drop clips nothing uses any more.
const body = Object.entries(lines).map(([t, id]) => `  ${JSON.stringify(t)}: "${id}"`).join(',\n');
writeFileSync(new URL('index.json', OUT), `{\n"voice": "${VOICE}",\n"rate": ${RATE},\n"lines": {\n${body}\n}\n}\n`);
const keep = new Set(Object.values(lines).map(id => id + '.mp3'));
const stale = readdirSync(OUT).filter(f => f.endsWith('.mp3') && !keep.has(f));
stale.forEach(f => unlinkSync(new URL(f, OUT)));
console.log(`Recorded ${done} clips, removed ${stale.length} unused.`);
