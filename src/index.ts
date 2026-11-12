// This is the library entry point
import type { Plugin } from "prettier";
import type { ParserNode, RootNode } from "./parser/VelocityParserNodes";
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
      locStart: (node) => node.startLocation.line,
      locEnd: (node) => (node.endLocation != null ? node.endLocation.line : 0),
    },
  },
  printers: {
    // TODO No preprocess in types?
    "velocity-html-ast": {
      print: printer,
      embed,
      preprocess: (ast, options) => preprocess(ast as RootNode, options),
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
