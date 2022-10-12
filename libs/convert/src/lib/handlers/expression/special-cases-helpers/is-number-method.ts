import {
  jsNumberProperties,
  JsNumberProperty,
} from '@js-to-lua/lua-conversion-utils';

export const isJSNumberProperty = (
  propertyName: string
): propertyName is JsNumberProperty =>
  (jsNumberProperties as ReadonlyArray<string>).includes(propertyName);
