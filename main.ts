import * as fs from "node:fs";
import * as path from "node:path";

// The entry: one word describing my Wi-Fi. "Almost" — almost connected,
// almost fast, almost working. Six letters, funny because it is true:
// home Wi-Fi is always almost there and never quite there.
const WORD = "Almost";

const outDir = process.env.OUTPUT_DIR ?? "/output";
const entry = WORD;

// Sealed gate: /output/entry.txt must be UTF-8 text of 1-20 characters,
// not only white space. "Almost" is 6 characters.
if (entry.length < 1 || entry.length > 20) {
  throw new Error(`entry length ${entry.length} outside gate 1-20`);
}
if (entry.trim() !== entry) throw new Error("entry has leading/trailing whitespace");
if (entry.trim().length === 0) throw new Error("entry is only whitespace");
// Exactly one word: no spaces, tabs or newlines inside.
if (/\s/.test(entry)) throw new Error("entry must be exactly one word");
if (/[^\x20-\x7E]/.test(entry)) throw new Error("entry has non-ASCII characters");
// Judge criterion 4: avoid the words everyone reaches for. The entry must
// not be one of the tired Wi-Fi cliches — the joke has to earn its place
// with a fresh angle, not a word the whole field will also submit.
const CLICHES = ["Slow", "Dead", "Loading", "Buffering", "Weak", "Broken", "Laggy", "Offline"];
if (CLICHES.includes(entry)) throw new Error("entry is a tired Wi-Fi cliche");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "entry.txt"), entry, "utf8");

// Round-trip check: the file must read back byte-identical to the word.
const back = fs.readFileSync(path.join(outDir, "entry.txt"), "utf8");
if (back !== entry) throw new Error("round-trip mismatch");
console.log(`entry ok: ${entry.length} chars, 1 word`);
