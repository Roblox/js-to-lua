addDescription(
  ({ name, arguments: args, repeatable, locations }: DirectiveDefinitionNode) =>
    'directive @' +
    name +
    (hasMultilineItems(args)
      ? wrap('(\n', indent(join(args, '\n')), '\n)')
      : wrap('(', join(args, ', '), ')')) +
    (repeatable ? ' repeatable' : '') +
    ' on ' +
    join(locations, ' | '),
)
