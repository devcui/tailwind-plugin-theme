# tailwind plugin theme

extend tailwind compilation to compile the corresponding css according to the json theme.

## JSON

`./assets/tw-theme.json`

```json
{
  "$schema": "../schema.json",
  "themes": [
    { "name": "theme-a", "input": "./assets/a.css" },
    { "name": "theme-b", "input": "./assets/b.css" },
    { "name": "theme-c", "input": "./assets/c.css" },
    { "name": "theme-d", "input": "./assets/d.css" },
    { "name": "theme-e", "input": "./assets/e.css" },
    { "name": "theme-f", "input": "./assets/f.css" }
  ]
}
```

## How to use

- cli

`npx @rymcu/tailwind-plugin-theme --input=<json> --output=<output>`

- options

```
Usage:
tailwind-plugin-theme [options]

Options:
-i, --input ··········· Input json file
-o, --output ·········· Output path
-w, --watch ··········· Watch for changes and rebuild as needed
-m, --minify ·········· Optimize and minify the output
--optimize ········ Optimize the output without minifying
--cwd ············· The current working directory [default: `.`]
-h, --help ············ Display usage information

```

## Example

```
git clone https://github.com/rymcu/tailwind-plugin-theme.git
cd tailwind-plugin-theme
pnpm i
npm run dev:build
```
