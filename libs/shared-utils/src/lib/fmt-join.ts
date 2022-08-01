import { isPrintableNode, printableNode, PrintableNode } from './fmt';

export const fmtJoin = (
  sep: string,
  values: Array<PrintableNode | string>
): PrintableNode => {
  if (!values.length) {
    return printableNode('');
  }

  return values
    .map((v) => (isPrintableNode(v) ? v : printableNode(v)))
    .reduceRight((right, left) => {
      const separator =
        (right.value || sep) && left.needsNewLine && !sep.startsWith('\n')
          ? `\n${sep}`
          : sep;
      const suffix = `${separator}${right}`;

      return printableNode(
        `${left}${suffix}`,
        right.needsNewLine || (!suffix && left.needsNewLine)
      );
    });

  // return printableNode(strings[0] + value, needsNewLine);
  // return printableNode(values.join(separator), false);
};
