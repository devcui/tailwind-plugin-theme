// Copyright (c) Tailwind Labs, Inc. (Original)
//
// Licensed under the MIT License. See LICENSE file for details.

import EnhancedResolve from 'enhanced-resolve';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const localResolve = createRequire(import.meta.url).resolve;
export function resolve(id: string) {
  return localResolve(id);
}

const resolver = EnhancedResolve.ResolverFactory.createResolver({
  fileSystem: new EnhancedResolve.CachedInputFileSystem(fs, 4000),
  useSyncFileSystemCalls: true,
  extensions: ['.css'],
  mainFields: ['style'],
  conditionNames: ['style'],
});
export function resolveCssId(id: string, base: string) {
  return resolver.resolveSync({}, base, id);
}
