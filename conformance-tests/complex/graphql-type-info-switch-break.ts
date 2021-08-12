function enter(node) {
  switch (node.kind) {
    case Kind.SELECTION_SET: {
      let body;
      break;
    }
    case Kind.DIRECTIVE:
      let body;
      break;
    case Kind.OPERATION_DEFINITION: {
      let type: mixed;
      switch (node.operation) {
        case 'query':
          type = schema.getQueryType();
          break;
        case 'mutation':
          type = schema.getMutationType();
          break;
        case 'subscription':
          type = schema.getSubscriptionType();
          break;
      }
      break;
    }
    case Kind.INLINE_FRAGMENT:
    case Kind.FRAGMENT_DEFINITION: {
      let body;
      break;
    }
    case Kind.ARGUMENT: {
      let body;
      break;
    }
  }
}
