import { CommonTokenFactory, type CharStream, type TokenSource } from "antlr4ng";
import type { VelocityHtmlLexer } from "./generated/VelocityHtmlLexer";
import { VelocityToken } from "./VelocityToken";

export class VelocityTokenFactory extends CommonTokenFactory {
  public constructor(private readonly lexer: VelocityHtmlLexer) {
    super();
  }

  public override create(
    source: [TokenSource | null, CharStream | null],
    type: number,
    text: string | undefined,
    channel: number,
    start: number,
    stop: number,
    line: number,
    column: number
  ): VelocityToken {
    const t = new VelocityToken({ source, type, text, channel, start, stop, line, column });
    if (!text && this.copyText && source[1] !== null) {
      t.text = source[1].getTextFromRange(start, stop);
    }
    t.isInsideString = this.lexer.isVtlReferenceInsideString;
    this.lexer.isVtlReferenceInsideString = false;
    return t;
  }
}
