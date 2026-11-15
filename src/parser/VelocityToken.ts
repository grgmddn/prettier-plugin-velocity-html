import {
  CommonToken,
  type ATNSimulator,
  type CharStream,
  type Recognizer,
  type TokenSource,
} from "antlr4ng";

export function isCollapsibleWhitespaceOnly(text: string): boolean {
  // There are many whitespace characters that we don't want to collapse.
  // See https://en.wikipedia.org/wiki/Whitespace_character
  return /^[ \t\n\r\f]+$/.exec(text) != null;
}

export const NEWLINE_REGEX = /\r\n|\r|\n/;

export interface SourceCodeLocation {
  line: number;    // 1-based
  column: number;  // 1-based
  offset: number;  // 0-based UTF-16 index into the original text (end is exclusive)
}

// Mirrors the (protected) CommonToken constructor argument.
export interface VelocityTokenDetails {
  source: [TokenSource | null, CharStream | null];
  type: number;
  channel?: number;
  start?: number;
  stop?: number;
  text?: string;
  line?: number;
  tokenIndex?: number;
  column?: number;
}

export class VelocityToken extends CommonToken {
  public isInsideString = false;

  public utf16Start?: number;

  public constructor(details: VelocityTokenDetails) {
    super(details);
  }

  public toVelocityString(recognizer?: Recognizer<ATNSimulator>): string {
    let stringRepresentation = super.toString(recognizer);
    if (this.isInsideString) {
      stringRepresentation = stringRepresentation.replace(
        "]",
        ", insideString]"
      );
    }
    return stringRepresentation;
  }

  get isWhitespaceOnly(): boolean {
    return isCollapsibleWhitespaceOnly(this.textValue);
  }

  get stringValue(): string {
    return this.text != null
      ? this.text.startsWith('"') || this.text.startsWith("'")
        ? this.text.substring(1, this.text.length - 1)
        : this.text
      : "";
  }

  get startLocation(): SourceCodeLocation {
    return {
      line: this.line,
      column: this.column + 1,
      offset: this.utf16Start ?? this.start,
    };
  }

  get endLocation(): SourceCodeLocation {
    const offset = this.startLocation.offset + this.textValue.length; // exclusive
    const lines = this.textValue.split(NEWLINE_REGEX);
    return lines.length == 1
      ? { line: this.line, column: this.column + this.textValue.length + 1, offset }
      : {
          line: this.line + (lines.length - 1),
          column: this.column + lines[lines.length - 1].length + 1, // unchanged from the original
          offset,
        };
  }

  get textValue(): string {
    return this.text != null ? this.text : "";
  }
}
