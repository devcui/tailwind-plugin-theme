// Copyright (c) Tailwind Labs, Inc. (Original)
//
// Licensed under the MIT License. See LICENSE file for details.

import path from 'node:path';

export function normalizeWindowsSeperators(p: string) {
  return path.sep === '\\' ? p.replaceAll('\\', '/') : p;
}
