import * as Stylua from '@johnnymorganz/stylua';

export function formatCode(code: string): string {
  return Stylua.formatCode(
    code,
    Stylua.Config.new()
      .with_column_width(100)
      .with_line_endings(Stylua.LineEndings.Unix)
      .with_indent_type(Stylua.IndentType.Tabs)
      .with_indent_width(4)
      .with_quote_style(Stylua.QuoteStyle.AutoPreferDouble),
    new Stylua.Range(),
    Stylua.OutputVerification.None
  );
}
