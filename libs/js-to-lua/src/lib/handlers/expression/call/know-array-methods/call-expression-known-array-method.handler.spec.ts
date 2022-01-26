import {
  arrayInferableExpression,
  arrayPolyfilledMethodNames,
  callExpression,
  identifier,
  memberExpression,
  numericLiteral,
  tableConstructor,
  tableNoKeyField,
  withPolyfillExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  arrayExpression as babelArrayExpression,
  callExpression as babelCallExpression,
  identifier as babelIdentifier,
  memberExpression as babelMemberExpression,
  numericLiteral as babelNumericLiteral,
} from '@babel/types';
import { createCallExpressionKnownArrayMethodHandlerFunction } from './call-expression-known-array-method.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../../../testUtils/mock-node';

const handleKnownArrayMethodCall =
  createCallExpressionKnownArrayMethodHandlerFunction(mockNodeWithValueHandler);

const source = '';

describe('Known Array method calls Handler', () => {
  describe('for definitely an array', () => {
    it('should handle array push method with single argument', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelArrayExpression([]),
          babelIdentifier('push')
        ),
        [babelNumericLiteral(1)]
      );

      const expected = arrayInferableExpression(
        callExpression(
          memberExpression(identifier('table'), '.', identifier('insert')),
          [
            mockNodeWithValue(babelArrayExpression([])),
            mockNodeWithValue(numericLiteral(1)),
          ]
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should handle array push method with multiple arguments', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelArrayExpression([]),
          babelIdentifier('push')
        ),
        [babelNumericLiteral(1), babelNumericLiteral(2)]
      );

      const expected = arrayInferableExpression(
        callExpression(
          memberExpression(
            withPolyfillExtra('Array')(identifier('Array')),
            '.',
            identifier('concat')
          ),
          [
            mockNodeWithValue(babelArrayExpression([])),
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(numericLiteral(1))),
              tableNoKeyField(mockNodeWithValue(numericLiteral(2))),
            ]),
          ]
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should handle array unshift method with single argument', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelArrayExpression([]),
          babelIdentifier('unshift')
        ),
        [babelNumericLiteral(5)]
      );

      const expected = arrayInferableExpression(
        callExpression(
          memberExpression(identifier('table'), '.', identifier('insert')),
          [
            mockNodeWithValue(babelArrayExpression([])),
            numericLiteral(1),
            mockNodeWithValue(numericLiteral(5)),
          ]
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should handle array unshift method with multiple arguments', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelArrayExpression([]),
          babelIdentifier('unshift')
        ),
        [babelNumericLiteral(1), babelNumericLiteral(2)]
      );

      const expected = arrayInferableExpression(
        callExpression(
          memberExpression(
            withPolyfillExtra('Array')(identifier('Array')),
            '.',
            identifier('unshift')
          ),
          [
            mockNodeWithValue(babelArrayExpression([])),
            mockNodeWithValue(numericLiteral(1)),
            mockNodeWithValue(numericLiteral(2)),
          ]
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should handle array pop method with no argument', () => {
      const given = babelCallExpression(
        babelMemberExpression(babelArrayExpression([]), babelIdentifier('pop')),
        []
      );

      const expected = arrayInferableExpression(
        callExpression(
          memberExpression(identifier('table'), '.', identifier('remove')),
          [mockNodeWithValue(babelArrayExpression([]))]
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should not handle array pop method with some arguments', () => {
      const given = babelCallExpression(
        babelMemberExpression(babelArrayExpression([]), babelIdentifier('pop')),
        [babelNumericLiteral(1)]
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(undefined);
    });

    it('should handle array shift method with no argument', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelArrayExpression([]),
          babelIdentifier('shift')
        ),
        []
      );

      const expected = arrayInferableExpression(
        callExpression(
          memberExpression(identifier('table'), '.', identifier('remove')),
          [mockNodeWithValue(babelArrayExpression([])), numericLiteral(1)]
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should not handle array shift method with some arguments', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelArrayExpression([]),
          babelIdentifier('shift')
        ),
        [babelNumericLiteral(1)]
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(undefined);
    });

    arrayPolyfilledMethodNames.forEach((methodName) => {
      it(`should handle array polyfilled method: ${methodName}`, () => {
        const given = babelCallExpression(
          babelMemberExpression(
            babelArrayExpression([]),
            babelIdentifier(methodName)
          ),
          [babelNumericLiteral(1), babelNumericLiteral(2)]
        );

        const expected = arrayInferableExpression(
          callExpression(
            memberExpression(
              withPolyfillExtra('Array')(identifier('Array')),
              '.',
              identifier(methodName)
            ),
            [
              mockNodeWithValue(babelArrayExpression([])),
              mockNodeWithValue(numericLiteral(1)),
              mockNodeWithValue(numericLiteral(2)),
            ]
          )
        );

        expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
      });
    });
  });

  describe('for possible an array', () => {
    it('should handle array push method with single argument', () => {
      const source = 'foo.push(1)';
      const given = babelCallExpression(
        babelMemberExpression(
          { ...babelIdentifier('foo'), start: 0, end: 3 },
          babelIdentifier('push')
        ),
        [babelNumericLiteral(1)]
      );

      const expected = arrayInferableExpression(
        withTrailingConversionComment(
          callExpression(
            memberExpression(identifier('table'), '.', identifier('insert')),
            [
              mockNodeWithValue({
                ...babelIdentifier('foo'),
                start: 0,
                end: 3,
              }),
              mockNodeWithValue(numericLiteral(1)),
            ]
          ),
          `ROBLOX CHECK: check if 'foo' is an Array`
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should handle array push method with multiple arguments', () => {
      const source = 'foo.push(1)';
      const given = babelCallExpression(
        babelMemberExpression(
          { ...babelIdentifier('foo'), start: 0, end: 3 },
          babelIdentifier('push')
        ),
        [babelNumericLiteral(1), babelNumericLiteral(2)]
      );

      const expected = arrayInferableExpression(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              withPolyfillExtra('Array')(identifier('Array')),
              '.',
              identifier('concat')
            ),
            [
              mockNodeWithValue({
                ...babelIdentifier('foo'),
                start: 0,
                end: 3,
              }),
              tableConstructor([
                tableNoKeyField(mockNodeWithValue(numericLiteral(1))),
                tableNoKeyField(mockNodeWithValue(numericLiteral(2))),
              ]),
            ]
          ),
          `ROBLOX CHECK: check if 'foo' is an Array`
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should handle array unshift method with single argument', () => {
      const source = 'foo.unshift(5)';
      const given = babelCallExpression(
        babelMemberExpression(
          { ...babelIdentifier('foo'), start: 0, end: 3 },
          babelIdentifier('unshift')
        ),
        [babelNumericLiteral(5)]
      );

      const expected = arrayInferableExpression(
        withTrailingConversionComment(
          callExpression(
            memberExpression(identifier('table'), '.', identifier('insert')),
            [
              mockNodeWithValue({
                ...babelIdentifier('foo'),
                start: 0,
                end: 3,
              }),
              numericLiteral(1),
              mockNodeWithValue(numericLiteral(5)),
            ]
          ),
          `ROBLOX CHECK: check if 'foo' is an Array`
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    it('should handle array unshift method with multiple arguments', () => {
      const source = 'foo.unshift(1, 2)';
      const given = babelCallExpression(
        babelMemberExpression(
          { ...babelIdentifier('foo'), start: 0, end: 3 },
          babelIdentifier('unshift')
        ),
        [babelNumericLiteral(1), babelNumericLiteral(2)]
      );

      const expected = arrayInferableExpression(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              withPolyfillExtra('Array')(identifier('Array')),
              '.',
              identifier('unshift')
            ),
            [
              mockNodeWithValue({
                ...babelIdentifier('foo'),
                start: 0,
                end: 3,
              }),
              mockNodeWithValue(numericLiteral(1)),
              mockNodeWithValue(numericLiteral(2)),
            ]
          ),
          `ROBLOX CHECK: check if 'foo' is an Array`
        )
      );

      expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
    });

    arrayPolyfilledMethodNames.forEach((methodName) => {
      it(`should handle array polyfilled method: ${methodName}`, () => {
        const source = 'foo.push(1)';
        const given = babelCallExpression(
          babelMemberExpression(
            { ...babelIdentifier('foo'), start: 0, end: 3 },
            babelIdentifier(methodName)
          ),
          [babelNumericLiteral(1), babelNumericLiteral(2)]
        );

        const expected = arrayInferableExpression(
          withTrailingConversionComment(
            callExpression(
              memberExpression(
                withPolyfillExtra('Array')(identifier('Array')),
                '.',
                identifier(methodName)
              ),
              [
                mockNodeWithValue({
                  ...babelIdentifier('foo'),
                  start: 0,
                  end: 3,
                }),
                mockNodeWithValue(numericLiteral(1)),
                mockNodeWithValue(numericLiteral(2)),
              ]
            ),
            `ROBLOX CHECK: check if 'foo' is an Array`
          )
        );

        expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(expected);
      });
    });
  });

  describe('for unpolyfilled methods', () => {
    ['reduceRight'].forEach((methodName) => {
      it(`should not handle array unpolyfilled method: ${methodName}`, () => {
        const given = babelCallExpression(
          babelMemberExpression(
            babelIdentifier('foo'),
            babelIdentifier(methodName)
          ),
          [babelNumericLiteral(1), babelNumericLiteral(2)]
        );

        expect(handleKnownArrayMethodCall(source, {}, given)).toEqual(
          undefined
        );
      });
    });
  });
});
