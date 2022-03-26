import {
  arrayExpression,
  identifier as babelIdentifier,
  spreadElement,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { arrayConcat, arraySpread } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createSpreadElementPropertiesHandler } from './spread-element-properties.handler';

const { mockNodeWithValueHandler } = testUtils;
const spreadElementPropertiesHandler = createSpreadElementPropertiesHandler(
  mockNodeWithValueHandler
);

const source = '';
describe('Spread element properties handler', () => {
  describe.each(Array<{ forceConcat?: false }>({}, { forceConcat: false }))(
    'config: %s',
    (config) => {
      describe.each([
        {
          spreadEl: spreadElement(babelIdentifier('foo')),
          expectedEl: callExpression(arraySpread(), [
            mockNodeWithValue(babelIdentifier('foo')),
          ]),
        },
        {
          spreadEl: spreadElement(arrayExpression([babelIdentifier('foo')])),
          expectedEl: mockNodeWithValue(
            arrayExpression([babelIdentifier('foo')])
          ),
        },
      ])('For spread element $spreadEl', ({ spreadEl, expectedEl }) => {
        it('should handle single spreadElement', () => {
          const given = [spreadEl];

          const expected = [expectedEl];

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle spreadElement when last in array', () => {
          const given = [
            [babelIdentifier('bar'), babelIdentifier('baz')],
            spreadEl,
          ];

          const expected = [
            mockNodeWithValue(babelIdentifier('bar')),
            mockNodeWithValue(babelIdentifier('baz')),
            expectedEl,
          ];

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle spreadElement when first in array', () => {
          const given = [
            spreadEl,
            [babelIdentifier('bar'), babelIdentifier('baz')],
          ];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            expectedEl,
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('bar'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('baz'))),
            ]),
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle spreadElement when in the middle of array', () => {
          const given = [
            [babelIdentifier('bar'), babelIdentifier('baz')],
            spreadEl,
            [babelIdentifier('fizz'), babelIdentifier('jazz')],
          ];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('bar'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('baz'))),
            ]),
            expectedEl,
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('fizz'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('jazz'))),
            ]),
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle multiple spreadElements', () => {
          const given = [
            [babelIdentifier('bar'), babelIdentifier('baz')],
            spreadEl,
            [babelIdentifier('fizz'), babelIdentifier('jazz')],
            spreadEl,
          ];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('bar'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('baz'))),
            ]),
            expectedEl,
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('fizz'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('jazz'))),
            ]),
            expectedEl,
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });
      });
    }
  );

  describe.each(Array<{ forceConcat: true }>({ forceConcat: true }))(
    'config: %s',
    (config) => {
      describe.each([
        {
          spreadEl: spreadElement(babelIdentifier('foo')),
          expectedEl: callExpression(arraySpread(), [
            mockNodeWithValue(babelIdentifier('foo')),
          ]),
        },
        {
          spreadEl: spreadElement(arrayExpression([babelIdentifier('foo')])),
          expectedEl: mockNodeWithValue(
            arrayExpression([babelIdentifier('foo')])
          ),
        },
      ])('For spread element $spreadEl', ({ spreadEl, expectedEl }) => {
        it('should handle single spreadElement', () => {
          const given = [spreadEl];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            expectedEl,
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle spreadElement when last in array', () => {
          const given = [
            [babelIdentifier('bar'), babelIdentifier('baz')],
            spreadEl,
          ];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('bar'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('baz'))),
            ]),
            expectedEl,
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle spreadElement when first in array', () => {
          const given = [
            spreadEl,
            [babelIdentifier('bar'), babelIdentifier('baz')],
          ];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            expectedEl,
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('bar'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('baz'))),
            ]),
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle spreadElement when in the middle of array', () => {
          const given = [
            [babelIdentifier('bar'), babelIdentifier('baz')],
            spreadEl,
            [babelIdentifier('fizz'), babelIdentifier('jazz')],
          ];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('bar'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('baz'))),
            ]),
            expectedEl,
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('fizz'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('jazz'))),
            ]),
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });

        it('should handle multiple spreadElements', () => {
          const given = [
            [babelIdentifier('bar'), babelIdentifier('baz')],
            spreadEl,
            [babelIdentifier('fizz'), babelIdentifier('jazz')],
            spreadEl,
          ];

          const expected = callExpression(arrayConcat(), [
            tableConstructor(),
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('bar'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('baz'))),
            ]),
            expectedEl,
            tableConstructor([
              tableNoKeyField(mockNodeWithValue(babelIdentifier('fizz'))),
              tableNoKeyField(mockNodeWithValue(babelIdentifier('jazz'))),
            ]),
            expectedEl,
          ]);

          expect(spreadElementPropertiesHandler(source, config, given)).toEqual(
            expected
          );
        });
      });
    }
  );
});
