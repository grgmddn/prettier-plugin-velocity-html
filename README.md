# @grgmddn/prettier-plugin-velocity-html

A [Prettier](https://prettier.io) 3 plugin that formats HTML containing [Apache Velocity](https://velocity.apache.org/) code.

> This is a fork of [fvclaus/prettier-plugin-velocity-html](https://github.com/fvclaus/prettier-plugin-velocity-html), updated for Prettier 3. If you are on Prettier 2, use the [original package](https://www.npmjs.com/package/prettier-plugin-velocity-html). See [Attribution](#attribution).

## Installation

Install the plugin as a dev dependency:

```sh
npm install --save-dev prettier @grgmddn/prettier-plugin-velocity-html
```

Then add it to your [Prettier configuration](https://prettier.io/docs/configuration):

```json
// .prettierrc
{
  "plugins": ["@grgmddn/prettier-plugin-velocity-html"]
}
```

Or, with a JavaScript config:

```js
// prettier.config.mjs
export default {
  plugins: ["@grgmddn/prettier-plugin-velocity-html"],
};
```

Files ending in `.vm` are formatted automatically. For other extensions, set the parser in an override:

```json
{
  "plugins": ["@grgmddn/prettier-plugin-velocity-html"],
  "overrides": [{ "files": "*.htm", "options": { "parser": "velocity-html" } }]
}
```

## Usage

### CLI

```sh
npx prettier --write "src/**/*.vm"
```

To load the plugin without a config file:

```sh
npx prettier --plugin=@grgmddn/prettier-plugin-velocity-html --write "src/**/*.vm"
```

### API

```js
import * as prettier from "prettier";

const output = await prettier.format(source, {
  parser: "velocity-html",
  plugins: ["@grgmddn/prettier-plugin-velocity-html"],
});
```

## Motivation

Prettier's HTML parser is robust and can parse most Velocity code. There are only two cases it can't handle:

- HTML elements inside Velocity strings: `#set($htmlElement = "<div>")`
- Velocity fragments that aren't well-formed HTML on their own, such as a `footer.vm` containing `</div></div><div>Footer text ...</div></body></html>`

Even where Prettier can parse Velocity HTML, it is unlikely to improve the formatting. It treats every Velocity directive as text and lays it out as such:

**Original**

```velocity
#set ($serviceName = $context.serviceName)
#if ($serviceName)
  <legend>
        #encodeForHTML($serviceName)
    </legend>
#else
    <legend>
        Login to anonymous service
    </legend>
#end
```

**Prettier HTML**

```velocity
#set ($serviceName = $context.serviceName) #if ($serviceName)
<legend>#encodeForHTML($serviceName)</legend>
#else
<legend>Login to anonymous service</legend>
#end
```

**Prettier Velocity HTML**

```velocity
#set($serviceName = $context.serviceName)
#if($serviceName)
  <legend>#encodeForHTML($serviceName)</legend>
#else
  <legend>Login to anonymous service</legend>
#end
```

## How it works

Elements are rendered in one of two modes, **block** or **inline**:

- **Block** elements break their children uniformly. Whitespace is not significant, and opening and closing tags are never broken.
- **Inline** elements fill as much horizontal space as possible. Whitespace is significant, so the opening or closing tag is broken where necessary to avoid inserting whitespace that was not in the original code.

The mode is chosen from the element name. It describes how elements are laid out *in code*, not how a browser renders them. Block mode is used to improve readability wherever whitespace has no meaning.

**Inline**

```html
<span> inline </span><span> inline </span> <span> inline </span><span>
  inline</span
>
```

**Block**

```html
<datalist id="colors">
  <option>Blue</option>
  <option>Green</option>
</datalist>
```

The plugin ships with its own HTML parser, tested against all relevant test cases from Prettier's HTML parser. Output is not always identical to Prettier's HTML formatter, because some cases were simplified to avoid the complexity of Prettier's codebase.

## What's different in this fork

- Compatibility with Prettier v3.
- Published as the scoped package `@grgmddn/prettier-plugin-velocity-html`.
- ESM-only, Node.js `>=18`.
- The hosted Playground has been removed.

## Contributing

```sh
npm install
npm run build     # generate the parser and bundle
npm test          # build, then run the test suite
npm run verify    # format check, lint and type check
```

Issues and pull requests are welcome at [grgmddn/prettier-plugin-velocity-html](https://github.com/grgmddn/prettier-plugin-velocity-html/issues).

## Attribution

This package is a fork of [prettier-plugin-velocity-html](https://github.com/fvclaus/prettier-plugin-velocity-html) by [Frederik Claus](https://github.com/fvclaus), updated for compatibility with Prettier v3. The original design, parser, motivation and tests described above are his work.
