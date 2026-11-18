import { doc as prettierDoc } from "prettier";
import type { AstPath, Doc, Options, Printer } from "prettier";
import type {
  ParserNode
} from "./parser/VelocityParserNodes";
import {
  AttributeNode,
  HtmlTagNode,
  HtmlTextNode,
  VelocityDirectiveNode,
  VelocityReferenceNode,
} from "./parser/VelocityParserNodes";
import { concatChildren, printClosingTag, printOpeningTag } from "./printer";

const { breakParent, group } = prettierDoc.builders;

type TextToDoc = (text: string, options: Options) => Promise<Doc>;  

const CSS_PARSER_OPTIONS = {
  parser: "css",
  __isHTMLStyleAttribute: true,
  __embeddedInHtml: true,
} as Options;
const JS_PARSER_OPTIONS = {
  parser: "babel",
  __embeddedInHtml: true,
  __babelSourceType: "script",
} as Options;

export const embed: NonNullable<Printer<ParserNode>["embed"]> = (path, _options) => {
  const node = path.node;

  if (node instanceof AttributeNode) {
    if (node.name !== "style" || node.value.length === 0) {
      return null;
    }
    return async (textToDoc: TextToDoc): Promise<Doc> => {
      const styleDoc = await textToDoc(node.unescapedValue, CSS_PARSER_OPTIONS);
      return group([node.name, '="', concatChildren(node, styleDoc), '"']);
    };
  }

  if (
    node instanceof HtmlTagNode &&
    (node.tagName === "script" || node.tagName === "style")
  ) {
    /**
     * Safely format "invalid" css
     */
    const preformatted = node.isPreformatted();
    const scriptText = node.children
      .map((child) => {
        if (child instanceof HtmlTextNode) {
          return child.text;
        } else if (
          child instanceof VelocityReferenceNode ||
          child instanceof VelocityDirectiveNode
        ) {
          if (!preformatted) {
            throw new Error("Node is not preformatted, but has velocity nodes.");
          }
          return child.tokens.map((token) => token.textValue).join("");
        } else {
          throw new Error(`Unexpected child type in <${node.tagName}>: ${child.constructor.name}`);
        }
      })
      .join(preformatted ? "" : " ");
    const parserOptions = inferParserOptions(node);
    const formatOptions =
      scriptText !== "" && !preformatted ? parserOptions : null;

    // Use the `path` handed to the callback, not the one captured above:
    // prettier reuses and mutates the outer AstPath while traversing.
    return async (
      textToDoc: TextToDoc,
      print: (path: AstPath) => Doc,
      callbackPath: AstPath<ParserNode>
    ): Promise<Doc> => {
      const body =
        formatOptions != null
          ? await textToDoc(scriptText, formatOptions)
          : scriptText;
      return [
        breakParent,
        printOpeningTag(node, callbackPath, print),
        concatChildren(node, body),
        printClosingTag(node),
      ];
    };
  }

  return null;
};

function inferParserOptions(node: HtmlTagNode): Options | null {
  if (node.tagName === "style") {
    return CSS_PARSER_OPTIONS;
  }
  return node.scriptParser === "babel" ? JS_PARSER_OPTIONS : null;
}
