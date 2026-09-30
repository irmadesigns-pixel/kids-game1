#!/usr/bin/env node
// Records everything the characters say as MP3 clips (Google Cloud Text-to-Speech) into voice/.
//
//   GOOGLE_TTS_API_KEY=... node tools/build-voice.mjs         record new sentences, drop unused clips
//   node tools/build-voice.mjs --dry                          only list what would be recorded
//
// The sentences are rebuilt from the game data in index.html (characters, clothes, colours, worlds, riddles),
// so new items are picked up automatically. The templates below mirror the say(...) calls in index.html: when a
// sentence there changes, change it here too. Anything without a clip is spoken by the tablet voice instead.
//
// Voices: the game voice speaks everything; characters with their own `voice` (see CHARS) additionally get
// their own recording of what they say about themselves (greeting, intros, giggles, magic words ...).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const GAME_VOICE = 'Laomedeia', RATE = 0.9, voiceName = v => `de-DE-Chirp3-HD-${v}`;
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
// `who` is the speaker: 'game' for the game voice, or the id of a character with its own voice.
const sentences = t => t.split(/(?<=[.!?])\s+/);
const clips = { game: new Set() }, spoken = [];
const line = (text, units = [text], who = 'game') => { spoken.push({ text, who }); units.forEach(u => (clips[who] = clips[who] || new Set()).add(u)); };
const split = text => line(text, sentences(text));
const own = (c, text) => line(text, [text], c.voice ? c.id : 'game'); // what a character says about itself

// Start, navigation, album
line('Hallo! Wer spielt heute mit?'); line('Wer spielt mit?');
line('Das Fotoalbum!'); line('Das Album ist noch leer.');
CHARS.forEach(c => {
  const names = [c.name, c.alt].filter(Boolean); // alt: the name suggested in the parents' menu, e.g. "Peach"
  names.forEach(n => { own(c, `Hallo, ich bin ${n}! Wohin gehen wir heute?`); own(c, `Ich bin ${n}!`); THEMES.forEach(t => line(`${n}: ${t.name}!`)); });
  ['Hihi!', 'Das kitzelt!', 'Ich sehe toll aus!', 'Danke schön!', 'Du bist super!', 'Juhu!', ...(c.taps || [])].forEach(t => own(c, t));
  ['Simsalabim!', 'Abrakadabra!', 'Hokuspokus!', 'Weg damit!', 'Wohin gehen wir jetzt?'].forEach(t => own(c, t));
  THEMES.forEach(t => { own(c, (c.intro || {})[t.id] || t.intro); own(c, t.fitQ); });
  [...SONGS, XMAS_SONG].forEach(s => own(c, `Musik! Wir tanzen zu ${s.name}!`));
});
// Dressing up
CATS.forEach(c => line(c.say));
line('Magst du ein Rätsel? Tipp auf den Stern!');
Object.values(COLORS).forEach(c => line(c.name + '!'));
ITEMS.forEach(k => colorsOf(k).forEach(c => {
  const name = cap(phrase(k, c)) + '!', call = k.call ? ' ' + k.call : '';
  line(name + (k.sayExtra ? ' ' + k.sayExtra : '') + call); // put on
  line(name + call); // tapped again
  if (k.call) line(k.call); // pet tapped
}));
['Klick! Das kommt ins Fotoalbum.', 'Cheese! Ein tolles Foto!', 'Wunderschön! Das Foto ist im Album.'].forEach(t => line(t));
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
THEMES.forEach(th => ITEMS.forEach(k => {
  const verb = k.g === 'pl' ? 'passen' : 'passt';
  if (k.themes.includes(th.id)) split(`Ja! ${cap(phrase(k))} ${verb} super ${th.fitTo}!`);
  if (isWrongFor(k, th)) split(`Hmm, ${phrase(k)} ${verb} nicht ${th.fitTo}. Versuch es nochmal!`);
}));
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
// Riddle: what comes next (colours or shapes repeat); wrong answers read the row aloud
line('Was kommt als Nächstes?'); line('Hmm, lass uns die Reihe zusammen sagen!'); line('Und was kommt dann?');
ALL.forEach(c => PRAISE.forEach(p => split(`${p}! ${COLORS[c].name}!`)));
Object.values(SHAPES).forEach(S => { line(S.name + '!'); PRAISE.forEach(p => split(`${p}! ${S.g === 'm' ? 'Der' : 'Das'} ${S.name}!`)); });
// Riddle: biggest and smallest
line('Hmm, schau genau: Was ist am größten?'); line('Hmm, schau genau: Was ist am kleinsten?');
[...new Set(THEMES.flatMap(th => th.counts))].forEach(o => ['größte', 'kleinste'].forEach(word => {
  const noun = COUNTS[o].one.split(' ')[1], art = { m: 'der', f: 'die', n: 'das' }[COUNTS[o].g];
  line(`Wo ist ${art} ${word} ${noun}?`);
  PRAISE.forEach(p => split(`${p}! ${cap(art)} ${word} ${noun}!`));
}));

/* ---------- record ---------- */
const VOICES = Object.fromEntries(Object.keys(clips).map(w => [w, voiceName(w === 'game' ? GAME_VOICE : CHARS.find(c => c.id === w).voice)]));
const idOf = (w, t) => createHash('sha1').update(`${VOICES[w]}|${RATE}|${t}`).digest('hex').slice(0, 12);
const maps = Object.fromEntries(Object.entries(clips).map(([w, set]) => [w, Object.fromEntries([...set].sort((a, b) => a.localeCompare(b, 'de')).map(t => [t, idOf(w, t)]))]));

// Same lookup as Voice.plan() in index.html: longest run of sentence parts that has a clip, then the rest;
// the speaker's own clips first, then the game voice.
const covered = (text, L) => {
  const p = sentences(text);
  for (let i = 0; i < p.length;) { let j = p.length; while (j > i && !L[p.slice(i, j).join(' ')]) j--; if (j === i) return false; i = j; }
  return true;
};
const gaps = spoken.filter(({ text, who }) => !(maps[who] && covered(text, maps[who])) && !covered(text, maps.game));
if (gaps.length) throw new Error('Not covered:\n' + gaps.map(g => g.text).join('\n'));

const jobs = Object.entries(maps).flatMap(([w, L]) => Object.entries(L).map(([t, id]) => ({ w, t, id }))).filter(j => !existsSync(new URL(j.id + '.mp3', OUT)));
const total = Object.values(maps).reduce((a, L) => a + Object.keys(L).length, 0), chars = jobs.reduce((a, j) => a + j.t.length, 0);
console.log(`${spoken.length} sentences, ${total} clips (${Object.entries(maps).map(([w, L]) => `${w} ${Object.keys(L).length}`).join(', ')}), ${jobs.length} new (${chars} characters)`);
if (DRY) { jobs.forEach(j => console.log(`  [${j.w}] ${j.t}`)); process.exit(0); }

const KEY = process.env.GOOGLE_TTS_API_KEY;
if (jobs.length && !KEY) { console.error('GOOGLE_TTS_API_KEY is not set'); process.exit(1); }
mkdirSync(OUT, { recursive: true });
async function record({ w, t, id }) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY },
      body: JSON.stringify({ input: { text: t }, voice: { languageCode: 'de-DE', name: VOICES[w] }, audioConfig: { audioEncoding: 'MP3', speakingRate: RATE } })
    });
    if (res.ok) { writeFileSync(new URL(id + '.mp3', OUT), Buffer.from((await res.json()).audioContent, 'base64')); return; }
    if (attempt >= 5 || ![429, 500, 502, 503].includes(res.status)) throw new Error(`${res.status} for "${t}": ${await res.text()}`);
    await new Promise(r => setTimeout(r, 1000 * 2 ** attempt));
  }
}
let done = 0;
const queue = jobs.slice();
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let job; (job = queue.shift());) { await record(job); if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`); }
}));

// Index for the game (one line per clip keeps diffs readable), then drop clips nothing uses any more.
const block = L => Object.entries(L).map(([t, id]) => `  ${JSON.stringify(t)}: "${id}"`).join(',\n');
const speakers = Object.keys(maps).filter(w => w !== 'game');
writeFileSync(new URL('index.json', OUT), `{\n"voices": ${JSON.stringify(VOICES)},\n"rate": ${RATE},\n"lines": {\n${block(maps.game)}\n},\n"speakers": {\n` +
  speakers.map(w => `${JSON.stringify(w)}: {\n${block(maps[w])}\n}`).join(',\n') + `\n}\n}\n`);
const keep = new Set(Object.values(maps).flatMap(L => Object.values(L)).map(id => id + '.mp3'));
const stale = readdirSync(OUT).filter(f => f.endsWith('.mp3') && !keep.has(f));
stale.forEach(f => unlinkSync(new URL(f, OUT)));
console.log(`Recorded ${done} clips, removed ${stale.length} unused.`);
