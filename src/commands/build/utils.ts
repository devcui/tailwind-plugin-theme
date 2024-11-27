// Copyright (c) Tailwind Labs, Inc. (Original)
//
// Licensed under the MIT License. See LICENSE file for details.
import fs from 'node:fs/promises';
import path from 'node:path';

export function drainStdin() {
  return new Promise<string>((resolve, reject) => {
    let result = '';
    process.stdin.on('data', (chunk) => {
      result += chunk;
    });
    process.stdin.on('end', () => resolve(result));
    process.stdin.on('error', (err) => reject(err));
  });
}

export async function outputFile(file: string, contents: string) {
  try {
    const currentContents = await fs.readFile(file, 'utf8');
    if (currentContents === contents) return; // Skip writing the file
    // eslint-disable-next-line no-empty
  } catch {}

  // Ensure the parent directories exist
  await fs.mkdir(path.dirname(file), { recursive: true });

  // Write the file
  await fs.writeFile(file, contents, 'utf8');
}
