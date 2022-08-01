import { printableNode } from './fmt';
import { fmtJoin } from './fmt-join';

describe('fmtJoin', () => {
  describe('regular separator', () => {
    it('should join empty array', () => {
      const values = Array<string>();
      const { value, needsNewLine } = fmtJoin('|', values);
      expect(value).toEqual('');
      expect(needsNewLine).toBe(false);
    });

    it('should join regular string with a separator', () => {
      const values = ['foo', 'bar', 'baz', 'fizz', 'buzz'];
      const { value, needsNewLine } = fmtJoin('|', values);
      expect(value).toEqual('foo|bar|baz|fizz|buzz');
      expect(needsNewLine).toBe(false);
    });

    it('should join printable nodes with a separator', () => {
      const values = [
        printableNode('foo'),
        printableNode('bar'),
        printableNode('baz'),
        printableNode('fizz'),
        printableNode('buzz'),
      ];
      const { value, needsNewLine } = fmtJoin('|', values);
      expect(value).toEqual('foo|bar|baz|fizz|buzz');
      expect(needsNewLine).toBe(false);
    });

    it('should join printable nodes that need new lines with a separator', () => {
      const values = [
        printableNode('foo', true),
        printableNode('bar', true),
        printableNode('baz', true),
        printableNode('fizz', true),
        printableNode('buzz', true),
      ];
      const { value, needsNewLine } = fmtJoin('|', values);
      expect(value).toEqual('foo\n|bar\n|baz\n|fizz\n|buzz');
      expect(needsNewLine).toBe(true);
    });

    it('should join printable nodes that need new lines (except last one) with a separator', () => {
      const values = [
        printableNode('foo', true),
        printableNode('bar', true),
        printableNode('baz', true),
        printableNode('fizz', true),
        printableNode('buzz'),
      ];
      const { value, needsNewLine } = fmtJoin('|', values);
      expect(value).toEqual('foo\n|bar\n|baz\n|fizz\n|buzz');
      expect(needsNewLine).toBe(false);
    });
  });

  describe('separator with new line', () => {
    it('should join empty array', () => {
      const values = Array<string>();
      const { value, needsNewLine } = fmtJoin('\n', values);
      expect(value).toEqual('');
      expect(needsNewLine).toBe(false);
    });

    it('should join regular string with a separator', () => {
      const values = ['foo', 'bar', 'baz', 'fizz', 'buzz'];
      const { value, needsNewLine } = fmtJoin('\n', values);
      expect(value).toEqual('foo\nbar\nbaz\nfizz\nbuzz');
      expect(needsNewLine).toBe(false);
    });

    it('should join printable nodes with a separator', () => {
      const values = [
        printableNode('foo'),
        printableNode('bar'),
        printableNode('baz'),
        printableNode('fizz'),
        printableNode('buzz'),
      ];
      const { value, needsNewLine } = fmtJoin('\n', values);
      expect(value).toEqual('foo\nbar\nbaz\nfizz\nbuzz');
      expect(needsNewLine).toBe(false);
    });

    it('should join printable nodes that need new lines with a separator', () => {
      const values = [
        printableNode('foo', true),
        printableNode('bar', true),
        printableNode('baz', true),
        printableNode('fizz', true),
        printableNode('buzz', true),
      ];
      const { value, needsNewLine } = fmtJoin('\n', values);
      expect(value).toEqual('foo\nbar\nbaz\nfizz\nbuzz');
      expect(needsNewLine).toBe(true);
    });

    it('should join printable nodes that need new lines (except last one) with a separator', () => {
      const values = [
        printableNode('foo', true),
        printableNode('bar', true),
        printableNode('baz', true),
        printableNode('fizz', true),
        printableNode('buzz'),
      ];
      const { value, needsNewLine } = fmtJoin('\n', values);
      expect(value).toEqual('foo\nbar\nbaz\nfizz\nbuzz');
      expect(needsNewLine).toBe(false);
    });
  });
});
