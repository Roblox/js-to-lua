export interface PrintableNode {
  value: string;
  needsNewLine: boolean;
  toString(): string;
}

export const printableNode = (
  value: string,
  needsNewLine = false
): PrintableNode => {
  return {
    value,
    toString(): string {
      return this.value;
    },
    needsNewLine,
  };
};

export const isPrintableNode = (v: unknown): v is PrintableNode => true;

export function fmt(
  strings: TemplateStringsArray,
  ...values: unknown[]
): PrintableNode {
  const node = values.reduce<PrintableNode>((result, value, i) => {
    const resultString = `${result.value}${result.needsNewLine ? '\n' : ''}${
      strings[i + 1]
    }${value}`;

    return printableNode(
      resultString,
      isPrintableNode(value) && value.needsNewLine
    );
  }, printableNode(strings[0]));

  return node;
}
