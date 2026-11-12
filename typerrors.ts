
> @grgmddn/prettier-plugin-velocity-html@1.0.0 check
> tsc --noEmit

src/index.ts(26,7): error TS2322: Type '(path: AstPath<ParserNode>, _options: ParserOptions<ParserNode>) => ((textToDoc: TextToDoc, print: (path: AstPath) => Doc, callbackPath: AstPath<ParserNode>) => Promise<Doc>) | undefined' is not assignable to type '(path: AstPath<any>, options: Options) => Doc | ((textToDoc: (text: string, options: Options) => Promise<Doc>, print: (selector?: string | number | AstPath<...> | (string | number)[] | undefined, args?: unknown) => Doc, path: AstPath<...>, options: Options) => Doc | ... 1 more ... | undefined) | null'.
  Types of parameters '_options' and 'options' are incompatible.
    Type 'Partial<RequiredOptions>' is missing the following properties from type 'ParserOptions<ParserNode>': locStart, locEnd, originalText
src/parser/VelocityParserNodes.ts(17,10): error TS2564: Property '_revealedConditionalCommentStart' has no initializer and is not definitely assigned in the constructor.
src/parser/VelocityParserNodes.ts(119,11): error TS2564: Property '_parent' has no initializer and is not definitely assigned in the constructor.
src/parser/VelocityParserNodes.ts(343,10): error TS2564: Property 'column' has no initializer and is not definitely assigned in the constructor.
src/parser/VelocityParserNodes.ts(518,11): error TS2564: Property 'renderDefinition' has no initializer and is not definitely assigned in the constructor.
src/parser/VelocityParserNodes.ts(519,11): error TS2564: Property '_tagName' has no initializer and is not definitely assigned in the constructor.
src/parser/VelocityParserNodes.ts(520,10): error TS2564: Property 'isSelfClosing' has no initializer and is not definitely assigned in the constructor.
src/parser/VelocityParserNodes.ts(522,10): error TS2564: Property 'forceCloseTag' has no initializer and is not definitely assigned in the constructor.
src/parser/VelocityParserNodes.ts(724,10): error TS2564: Property 'tagName' has no initializer and is not definitely assigned in the constructor.
src/printer.ts(100,52): error TS2345: Argument of type '"attributes"' is not assignable to parameter of type 'ArrayProperties<ParserNode>'.
src/printer.ts(272,30): error TS2339: Property 'parent' does not exist on type 'VelocityToken'.
src/printer.ts(277,17): error TS2339: Property 'isFirstChild' does not exist on type 'VelocityToken'.
src/printer.ts(284,19): error TS2339: Property 'isOnlyChild' does not exist on type 'VelocityToken'.
src/printer.ts(294,19): error TS2339: Property 'hasLeadingSpaces' does not exist on type 'VelocityToken'.
src/printer.ts(302,19): error TS2339: Property 'hasTrailingSpaces' does not exist on type 'VelocityToken'.
src/printer.ts(310,21): error TS2339: Property 'prev' does not exist on type 'VelocityToken'.
src/printer.ts(311,32): error TS2339: Property 'prev' does not exist on type 'VelocityToken'.
src/printer.ts(322,13): error TS2345: Argument of type 'VelocityToken' is not assignable to parameter of type 'ParserNode'.
  Type 'VelocityToken' is missing the following properties from type 'ParserNode': endToken, _startLocation, _endLocation, _isPreformatted, and 23 more.
src/printer.ts(327,21): error TS2339: Property 'isInlineRenderMode' does not exist on type 'VelocityToken'.
src/printer.ts(331,33): error TS2339: Property 'hasLeadingSpaces' does not exist on type 'VelocityToken'.
src/printer.ts(332,56): error TS2345: Argument of type 'VelocityToken' is not assignable to parameter of type 'ParserNode'.
  Type 'VelocityToken' is missing the following properties from type 'ParserNode': endToken, _startLocation, _endLocation, _isPreformatted, and 23 more.
src/printer.ts(346,19): error TS2339: Property 'next' does not exist on type 'VelocityToken'.
src/printer.ts(349,20): error TS2339: Property 'forceBreak' does not exist on type 'VelocityToken'.
src/printer.ts(351,32): error TS2339: Property 'next' does not exist on type 'VelocityToken'.
src/printer.ts(353,11): error TS2345: Argument of type 'VelocityToken' is not assignable to parameter of type 'ParserNode'.
  Type 'VelocityToken' is missing the following properties from type 'ParserNode': endToken, _startLocation, _endLocation, _isPreformatted, and 23 more.
src/printer.ts(357,50): error TS2339: Property 'isBlockRenderMode' does not exist on type 'VelocityToken'.
src/printer.ts(365,21): error TS2339: Property 'isInlineRenderMode' does not exist on type 'VelocityToken'.
src/printer.ts(367,21): error TS2339: Property 'hasTrailingSpaces' does not exist on type 'VelocityToken'.
src/printer.ts(371,48): error TS2345: Argument of type 'VelocityToken' is not assignable to parameter of type 'ParserNode'.
  Type 'VelocityToken' is missing the following properties from type 'ParserNode': endToken, _startLocation, _endLocation, _isPreformatted, and 23 more.
src/printer.ts(378,17): error TS2339: Property 'isLastChild' does not exist on type 'VelocityToken'.
src/printer.ts(384,33): error TS2339: Property 'parent' does not exist on type 'VelocityToken'.
src/printer.ts(390,6): error TS2345: Argument of type '"children"' is not assignable to parameter of type 'ArrayProperties<ParserNode>'.
