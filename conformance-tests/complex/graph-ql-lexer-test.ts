// extracted from https://github.com/graphql/graphql-js/blob/1951bce42092123e844763b6a8e985a8a3327511/src/language/__tests__/lexer-test.js
// skip imports to simplify test case

function lexOne(str: string) {
  const lexer = new Lexer(new Source(str));
  return lexer.advance();
}

function lexSecond(str: string) {
  const lexer = new Lexer(new Source(str));
  lexer.advance();
  return lexer.advance();
}

function expectSyntaxError(text: string) {
  return expect(() => lexSecond(text)).to.throw();
}

describe('Lexer', () => {
  it('disallows uncommon control characters', () => {
    expectSyntaxError('\u0007').to.deep.equal({
      message: 'Syntax Error: Cannot contain the invalid character "\\u0007".',
      locations: [{ line: 1, column: 1 }],
    });
  });

  it('accepts BOM header', () => {
    expect(lexOne('\uFEFF foo')).to.contain({
      kind: TokenKind.NAME,
      start: 2,
      end: 5,
      value: 'foo',
    });
  });

  it('tracks line breaks', () => {
    expect(lexOne('foo')).to.contain({
      kind: TokenKind.NAME,
      start: 0,
      end: 3,
      line: 1,
      column: 1,
      value: 'foo',
    });
    expect(lexOne('\nfoo')).to.contain({
      kind: TokenKind.NAME,
      start: 1,
      end: 4,
      line: 2,
      column: 1,
      value: 'foo',
    });
    expect(lexOne('\rfoo')).to.contain({
      kind: TokenKind.NAME,
      start: 1,
      end: 4,
      line: 2,
      column: 1,
      value: 'foo',
    });
    expect(lexOne('\r\nfoo')).to.contain({
      kind: TokenKind.NAME,
      start: 2,
      end: 5,
      line: 2,
      column: 1,
      value: 'foo',
    });
    expect(lexOne('\n\rfoo')).to.contain({
      kind: TokenKind.NAME,
      start: 2,
      end: 5,
      line: 3,
      column: 1,
      value: 'foo',
    });
    expect(lexOne('\r\r\n\nfoo')).to.contain({
      kind: TokenKind.NAME,
      start: 4,
      end: 7,
      line: 4,
      column: 1,
      value: 'foo',
    });
    expect(lexOne('\n\n\r\rfoo')).to.contain({
      kind: TokenKind.NAME,
      start: 4,
      end: 7,
      line: 5,
      column: 1,
      value: 'foo',
    });
  });

  it('records line and column', () => {
    expect(lexOne('\n \r\n \r  foo\n')).to.contain({
      kind: TokenKind.NAME,
      start: 8,
      end: 11,
      line: 4,
      column: 3,
      value: 'foo',
    });
  });
});
