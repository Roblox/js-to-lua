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
  ...values: Array<PrintableNode | string>
): PrintableNode {
  const { value, needsNewLine } = values
    .map((v) => (isPrintableNode(v) ? v : printableNode(v)))
    .reduceRight((right, left, i) => {
      const currStr = strings[i + 1];
      const separator =
        (right.value || currStr) &&
        left.needsNewLine &&
        !currStr.startsWith('\n')
          ? `\n${currStr}`
          : currStr;
      const suffix = `${separator}${right}`;

      return printableNode(
        `${left}${suffix}`,
        right.needsNewLine || (!suffix && left.needsNewLine)
      );
    }, printableNode(''));

  return printableNode(strings[0] + value, needsNewLine);
}
