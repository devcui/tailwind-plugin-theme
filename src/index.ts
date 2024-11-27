#!/usr/bin/env node

// Copyright (c) Tailwind Labs, Inc. (Original)
// Copyright (c) 2024 devcui (Modified)
//
// Licensed under the MIT License. See LICENSE file for details.

import * as build from './commands/build/index.ts';
import { Arg, args } from './utils/args.ts';
import { help } from './commands/help/index.ts';
import { buildTheme } from './commands/theme.ts';

const sharedOptions = {
  '--help': {
    type: 'boolean',
    description: 'Display usage information',
    alias: '-h',
  },
} satisfies Arg;

const flags = args({
  ...build.options(),
  ...sharedOptions,
});
const command = flags._[0];

// Right now we don't support any sub-commands. Let's show the help message
// instead.
if (command) {
  help({
    invalid: command,
    usage: ['tailwind-plugin-theme [options]'],
    options: { ...build.options(), ...sharedOptions },
  });
  process.exit(1);
}

// Display main help message if no command is being used.
//
// E.g.:
//
//   - `tailwindcss`                // should show the help message
//
// E.g.: implicit `build` command
//
//   - `tailwindcss -o output.css`  // should run the build command, not show the help message
//   - `tailwindcss > output.css`   // should run the build command, not show the help message
if ((process.stdout.isTTY && !flags['--output']) || flags['--help']) {
  help({
    usage: [
      'tailwind-plugin-theme [--input input.css] [--output output.css] [--watch] [options…]',
    ],
    options: { ...build.options(), ...sharedOptions },
  });
  process.exit(0);
}

// Handle the build command
buildTheme(flags);
