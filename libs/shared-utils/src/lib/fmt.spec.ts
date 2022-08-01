import { fmt, printableNode } from './fmt';

describe('fmt', () => {
  describe('empty separators', () => {
    it('should format empty string', () => {
      const { value, needsNewLine } = fmt``;
      expect(value).toEqual('');
      expect(needsNewLine).toBe(false);
    });

    it('should format non empty string', () => {
      const { value, needsNewLine } = fmt`hello`;
      expect(value).toEqual('hello');
      expect(needsNewLine).toBe(false);
    });

    it('should format regular string values', () => {
      const foo = 'fooString';
      const bar = 'barString';

      const { value, needsNewLine } = fmt`${foo}${bar}`;

      expect(value).toEqual('fooStringbarString');
      expect(needsNewLine).toBe(false);
    });

    it('should format single printable node', () => {
      const foo = printableNode('fooString');

      const { value, needsNewLine } = fmt`${foo}`;

      expect(value).toEqual('fooString');
      expect(needsNewLine).toBe(false);
    });

    it('should format single printable node that needs new line', () => {
      const foo = printableNode('fooString', true);

      const { value, needsNewLine } = fmt`${foo}`;

      expect(value).toEqual('fooString');
      expect(needsNewLine).toBe(true);
    });

    it('should format printable nodes when first needs new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString');

      const { value, needsNewLine } = fmt`${foo}${bar}`;

      expect(value).toEqual('fooString\nbarString');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when second needs new line', () => {
      const foo = printableNode('fooString');
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`${foo}${bar}`;

      expect(value).toEqual('fooStringbarString');
      expect(needsNewLine).toBe(true);
    });

    it('should format printable nodes when both need new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`${foo}${bar}`;

      expect(value).toEqual('fooString\nbarString');
      expect(needsNewLine).toBe(true);
    });
  });

  describe('with separators', () => {
    it('should format regular string values', () => {
      const foo = 'fooString';
      const bar = 'barString';

      const { value, needsNewLine } = fmt`${foo} | ${bar}`;

      expect(value).toEqual('fooString | barString');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when first needs new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString');

      const { value, needsNewLine } = fmt`${foo} | ${bar}`;

      expect(value).toEqual('fooString\n | barString');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when second needs new line', () => {
      const foo = printableNode('fooString');
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`${foo} | ${bar}`;

      expect(value).toEqual('fooString | barString');
      expect(needsNewLine).toBe(true);
    });

    it('should format printable nodes when both need new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`${foo} | ${bar}`;

      expect(value).toEqual('fooString\n | barString');
      expect(needsNewLine).toBe(true);
    });
  });

  describe('with separators - new lines', () => {
    it('should format regular string values', () => {
      const foo = 'fooString';
      const bar = 'barString';

      const { value, needsNewLine } = fmt`${foo}\n${bar}`;

      expect(value).toEqual('fooString\nbarString');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when first needs new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString');

      const { value, needsNewLine } = fmt`${foo}\n${bar}`;

      expect(value).toEqual('fooString\nbarString');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when second needs new line', () => {
      const foo = printableNode('fooString');
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`${foo}\n${bar}`;

      expect(value).toEqual('fooString\nbarString');
      expect(needsNewLine).toBe(true);
    });

    it('should format printable nodes when both need new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`${foo}\n${bar}`;

      expect(value).toEqual('fooString\nbarString');
      expect(needsNewLine).toBe(true);
    });

    it('should format printable nodes when both need new line - ends with new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`${foo}\n${bar}\n`;

      expect(value).toEqual('fooString\nbarString\n');
      expect(needsNewLine).toBe(false);
    });
  });

  describe('with separators and wrappers', () => {
    it('should format regular string value', () => {
      const foo = 'fooString';
      const bar = 'barString';

      const { value, needsNewLine } = fmt`{ ${foo} | ${bar} }`;

      expect(value).toEqual('{ fooString | barString }');
      expect(needsNewLine).toBe(false);
    });

    it('should format single printable node', () => {
      const foo = printableNode('fooString');

      const { value, needsNewLine } = fmt`{ ${foo} }`;

      expect(value).toEqual('{ fooString }');
      expect(needsNewLine).toBe(false);
    });

    it('should format single printable node that needs new line', () => {
      const foo = printableNode('fooString', true);

      const { value, needsNewLine } = fmt`{ ${foo} }`;

      expect(value).toEqual('{ fooString\n }');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when first needs new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString');

      const { value, needsNewLine } = fmt`{ ${foo} | ${bar} }`;

      expect(value).toEqual('{ fooString\n | barString }');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when second needs new line', () => {
      const foo = printableNode('fooString');
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`{ ${foo} | ${bar} }`;

      expect(value).toEqual('{ fooString | barString\n }');
      expect(needsNewLine).toBe(false);
    });

    it('should format printable nodes when both need new line', () => {
      const foo = printableNode('fooString', true);
      const bar = printableNode('barString', true);

      const { value, needsNewLine } = fmt`{ ${foo} | ${bar} }`;

      expect(value).toEqual('{ fooString\n | barString\n }');
      expect(needsNewLine).toBe(false);
    });
  });
});
