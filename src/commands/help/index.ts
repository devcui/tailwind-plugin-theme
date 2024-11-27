// Copyright (c) Tailwind Labs, Inc. (Original)
// Copyright (c) 2024 devcui (Modified)
//
// Licensed under the MIT License. See LICENSE file for details.

import { Arg } from '../../utils/args';
import {
  println,
  header,
  wordWrap,
  UI,
  indent,
  highlight,
} from '../../utils/renderer';
import pc from 'picocolors';

export const helpOptions: Arg = {
  '--help': {
    type: 'boolean',
    description: 'Display usage information',
    alias: '-h',
  },
};

export function help({
  invalid,
  usage,
  options,
}: {
  invalid?: string;
  usage?: string[];
  options?: Arg;
}) {
  // Available terminal width
  const width = process.stdout.columns;

  // Render header
  println(header());

  // Render the invalid command
  if (invalid) {
    println();
    println(`${pc.dim('Invalid command:')} ${invalid}`);
  }

  // Render usage
  if (usage && usage.length > 0) {
    println();
    println(pc.dim('Usage:'));
    for (const [idx, example] of usage.entries()) {
      // Split the usage example into the command and its options. This allows
      // us to wrap the options based on the available width of the terminal.
      const command = example.slice(0, example.indexOf('['));
      let options = example.slice(example.indexOf('['));

      // Make the options dimmed, to make them stand out less than the command
      // itself.
      options = options.replace(/\[.*?\]/g, (option) => pc.dim(option));

      // The space between the command and the options.
      const space = 1;

      // Wrap the options based on the available width of the terminal.
      const lines = wordWrap(
        options,
        width - UI.indent - command.length - space,
      );

      // Print an empty line between the usage examples if we need to split due
      // to width constraints. This ensures that the usage examples are visually
      // separated.
      //
      // E.g.: when enough space is available
      //
      // ```
      //   Usage:
      //     tailwindcss build [--input input.css] [--output output.css] [--watch] [options...]
      //     tailwindcss other [--watch] [options...]
      // ```
      //
      // E.g.: when not enough space is available
      //
      // ```
      //   Usage:
      //     tailwindcss build [--input input.css] [--output output.css]
      //                       [--watch] [options...]
      //
      //     tailwindcss other [--watch] [options...]
      // ```
      if (lines.length > 1 && idx !== 0) {
        println();
      }

      // Print the usage examples based on available width of the terminal.
      //
      // E.g.: when enough space is available
      //
      // ```
      //   Usage:
      //     tailwindcss [--input input.css] [--output output.css] [--watch] [options...]
      // ```
      //
      // E.g.: when not enough space is available
      //
      // ```
      //   Usage:
      //     tailwindcss [--input input.css] [--output output.css]
      //                 [--watch] [options...]
      // ```
      //
      // > Note how the second line is indented to align with the first line.
      println(indent(`${command}${lines.shift()}`));
      for (const line of lines) {
        println(indent(line, command.length));
      }
    }
  }

  // Render options
  if (options) {
    // Track the max alias length, this is used to indent the options that don't
    // have an alias such that everything is aligned properly.
    let maxAliasLength = 0;
    for (const { alias } of Object.values(options)) {
      if (alias) {
        maxAliasLength = Math.max(maxAliasLength, alias.length);
      }
    }

    // The option strings, which are the combination of the `alias` and the
    // `flag`, with the correct spacing.
    const optionStrings: string[] = [];

    // Track the max option length, which is the longest combination of an
    // `alias` followed by `, ` and followed by the `flag`.
    let maxOptionLength = 0;

    for (const [flag, { alias }] of Object.entries(options)) {
      // The option string, which is the combination of the alias and the flag
      // but already properly indented based on the other aliases to ensure
      // everything is aligned properly.
      const option = [
        alias ? `${alias.padStart(maxAliasLength)}` : alias,
        alias ? flag : ' '.repeat(maxAliasLength + 2 /* `, `.length */) + flag,
      ]
        .filter(Boolean)
        .join(', ');

      optionStrings.push(option);
      maxOptionLength = Math.max(maxOptionLength, option.length);
    }

    println();
    println(pc.dim('Options:'));

    // The minimum amount of dots between the option and the description.
    const minimumGap = 8;

    for (const { description, default: defaultValue = null } of Object.values(
      options,
    )) {
      // The option to render
      const option = optionStrings.shift() as string;

      // The amount of dots to show between the option and the description.
      const dotCount = minimumGap + (maxOptionLength - option.length);

      // To account for the space before and after the dots.
      const spaces = 2;

      // The available width remaining for the description.
      const availableWidth =
        width - option.length - dotCount - spaces - UI.indent;

      // Wrap the description and the default value (if present), based on the
      // available width.
      const lines = wordWrap(
        defaultValue !== null
          ? `${description} ${pc.dim(`[default:\u202F${highlight(`${defaultValue}`)}]`)}`
          : description,
        availableWidth,
      );

      // Print the option, the spacer dots and the start of the description.
      println(
        indent(
          `${pc.blue(option)} ${pc.dim(pc.gray('\u00B7')).repeat(dotCount)} ${lines.shift()}`,
        ),
      );

      // Print the remaining lines of the description, indenting them to align
      // with the start of the description.
      for (const line of lines) {
        println(
          indent(`${' '.repeat(option.length + dotCount + spaces)}${line}`),
        );
      }
    }
  }
}
