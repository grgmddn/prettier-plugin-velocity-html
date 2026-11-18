import { RootNode, type ParserNode } from "./parser/VelocityParserNodes";
import {
  HtmlTextNode,
  NodeWithChildren
} from "./parser/VelocityParserNodes";

import type { Options } from "prettier";

const PREPROCESS_PIPELINE: ((ast: RootNode, options: Options) => void)[] = [
  extractWhitespaces,
  // cleanVoidNodes,
];

export function preprocess(ast: ParserNode, options: Options): ParserNode {
  if (!(ast instanceof RootNode)) {
    throw new Error("Expected RootNode as the parser result");
  }
  for (const fn of PREPROCESS_PIPELINE) fn(ast, options);
  return ast;
}

function extractWhitespaces(ast: RootNode): void {
  ast.walk((node) => {
    if (node instanceof NodeWithChildren) {
      node.children = node.children.reduce(
        (newChildren, child, childIndex, children) => {
          if (!child.isSelfOrParentPreformatted) {
            if (child instanceof HtmlTextNode) {
              child.trimWhitespace();

              const previousSibling = children[childIndex - 1];
              if (previousSibling != null) {
                previousSibling.hasTrailingSpaces = child.hasLeadingSpaces;
              }

              if (child.isFirstChild && child.parent.startNode == null) {
                const previousNode = child.parent.prev;
                if (previousNode != null) {
                  previousNode.hasTrailingSpaces = child.hasLeadingSpaces;
                }
              }

              const nextSibling = children[childIndex + 1];
              if (nextSibling != null) {
                nextSibling.hasLeadingSpaces = child.hasTrailingSpaces;
              }

              if (child.isLastChild && child.parent.endNode == null) {
                const nextNode = child.parent.next;
                if (nextNode != null) {
                  nextNode.hasLeadingSpaces = child.hasTrailingSpaces;
                }
              }
              if (child.text === "") {
                return newChildren;
              } else {
                return [...newChildren, child];
              }
            }
          }
          return [...newChildren, child];
        },
        [] as ParserNode[]
      );
    }
  });
}
