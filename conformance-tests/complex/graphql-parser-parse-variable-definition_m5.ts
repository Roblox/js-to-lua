class Parser {
  parseVariableDefinition(): VariableDefinitionNode {
      return this.node<VariableDefinitionNode>(this._lexer.token, {
        kind: Kind.VARIABLE_DEFINITION,
        variable: this.parseVariable(),
        type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
        defaultValue: this.expectOptionalToken(TokenKind.EQUALS)
          ? this.parseConstValueLiteral()
          : undefined,
        directives: this.parseConstDirectives(),
      });
    }

  }
