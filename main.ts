// One-Liner Marathon entry.
//
// The line is a deadpan one-liner: the speaker's calendar keeps snoozing a
// reminder for their own funeral, and the speaker chooses to read the
// machine's nagging as flattery. The joke survives a second read because
// the laugh is in that decision, not in a shock that evaporates once known.
// This file exists only to deliver those exact bytes, deterministically.
import { accessSync, closeSync, constants, mkdirSync, openSync, writeSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "My calendar keeps snoozing the reminder for my own funeral, and I've decided to take that as a compliment.";

// Where the bytes go: the harness directory when named, otherwise the
// conventional /output, otherwise a local ./out fallback.
function candidateDirs(): string[] {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv ? [fromEnv, "/output", "./out"] : ["/output", "./out"];
}

// A directory counts only if we can create it and write inside it.
function writableDir(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function pickOutputDir(): string {
  for (const dir of candidateDirs()) {
    if (writableDir(dir)) return dir;
  }
  // Last resort: ./out is created unconditionally by the caller below.
  return "./out";
}

function writeEntry(dir: string): void {
  mkdirSync(dir, { recursive: true });
  const fd = openSync(join(dir, "entry.txt"), "w");
  try {
    writeSync(fd, Buffer.from(JOKE, "utf8"));
  } finally {
    closeSync(fd);
  }
}

function main(): void {
  writeEntry(pickOutputDir());
}

main();
