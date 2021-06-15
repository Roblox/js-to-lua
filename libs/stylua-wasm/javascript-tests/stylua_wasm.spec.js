const { format_code, Configuration } = require('stylua-wasm/stylua_wasm');

test('formats empty string', () => {
  expect(format_code('')).toEqual('');
});

test('formats a declaration', () => {
  expect(format_code('local \na')).toEqual('local a\n');
});

test('creates a configuration object', () => {
  const config = new Configuration();
  expect(config.column_width).toEqual(100);
  expect(config.line_endings).toEqual('unix');
  expect(config.indentation_type).toEqual('tabs');
  expect(config.indentation_width).toEqual(4);
  expect(config.quote_style).toEqual('double');
});

test('throws when formatting code with invalid line_endings', () => {
  const config = new Configuration();
  config.line_endings = 'oof';
  expect(() => format_code('', config)).toThrow('invalid line_endings value');
});

test('throws when formatting code with invalid quote_style', () => {
  const config = new Configuration();
  config.quote_style = 'oof';
  expect(() => format_code('', config)).toThrow('invalid quote_style value');
});

test('throws when formatting code with invalid indentation_type', () => {
  const config = new Configuration();
  config.indentation_type = 'oof';
  expect(() => format_code('', config)).toThrow(
    'invalid indentation_type value'
  );
});
