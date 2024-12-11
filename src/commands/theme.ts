// Copyright (c) 2024 devcui
//
// Licensed under the MIT License. See LICENSE file for details.

import { drainStdin } from './build/utils';
import fs from 'node:fs';
import { eprintln } from '../utils/renderer';
import { handle, options } from './build';
import { Result } from 'src/utils/args';

export interface Theme {
  name: string;
  input: string;
}

export interface WrappedTheme {
  $schema: string;
  themes: Theme[];
}

export interface ThemeContent {
  name: string;
  css: string;
}

const json = String.raw;

/**
 * read theme json from cli argument
 */
export async function readJson(commandArg: string | null): Promise<Theme[]> {
  let content: string = json`{}`;
  if (commandArg) {
    if (commandArg === '-') {
      content = await drainStdin();
    } else {
      content = await fs.promises.readFile(commandArg, 'utf-8');
    }
  }
  const wrappedTheme: WrappedTheme = JSON.parse(content);
  if (!wrappedTheme.themes) {
    eprintln(
      'Invalid theme file. Please check if the file is a valid JSON file.',
    );
    process.exit(1);
  }
  return wrappedTheme.themes;
}

export async function buildTheme(args: Result<ReturnType<typeof options>>) {
  const themes: Theme[] = await readJson(args['--input']);
  const themeArgs = generateArgs(themes, args);
  await Promise.all(
    themeArgs.map(async (arg) => {
      eprintln(`building ${arg['--input']} file...`);
      await handle(arg);
    }),
  );
}

export function generateArgs(
  themes: Theme[],
  args: Result<ReturnType<typeof options>>,
): Result<ReturnType<typeof options>>[] {
  return themes.map((theme) => {
    return {
      ...args,
      '--input': theme.input,
      '--output': `${args['--output']}/${theme.name}.css`,
    };
  });
}
