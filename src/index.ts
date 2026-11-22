// This is the library entry point
import type { Plugin } from "prettier";
import type { ParserNode } from "./parser/VelocityParserNodes";
import parseVelocityHtml from "./parser/parser";
import { preprocess } from "./preprocess";
import { embed } from "./embed";
import printer from "./printer";

// Break the AST cycles (parent/prev/next) and only walk real child nodes.
// Prettier 3 walks the AST to call `embed` on every node.
const VISITOR_KEYS = ["children", "attributes"] as const;

const plugin: Plugin<ParserNode> = {
  parsers: {
    "velocity-html": {
      parse: parseVelocityHtml,
      astFormat: "velocity-html-ast",
      locStart: (node) => node.startOffset,
      locEnd: (node) => node.endOffset,
    },
  },
  printers: {
    "velocity-html-ast": {
      print: printer,
      embed,
      preprocess: (ast, options) => preprocess(ast, options),
      getVisitorKeys: (node: object) =>
        VISITOR_KEYS.filter((key) => key in node),
    },
  },
  languages: [
    {
      name: "Velocity+HTML",
      parsers: ["velocity-html"],
      extensions: [".vm"],
    },
  ],
};

export const { languages, parsers, printers } = plugin;
