import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  LuaStatement,
  nodeGroup,
} from '@js-to-lua/lua-types';
import {
  unwrapNestedNodeGroups,
  unwrapNodeGroup,
  unwrapStatement,
  unwrapStatements,
} from './unwrap-node-group';

describe('unwrapNodeGroup', () => {
  it('should not unwrap if empty node group', () => {
    const given = nodeGroup([]);
    const expected = nodeGroup([]);

    expect(unwrapNodeGroup(given)).toEqual(expected);
  });

  it('should not unwrap if more than one statement in a node group', () => {
    const given = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('fizz')],
        [identifier('buzz')]
      ),
    ]);
    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('fizz')],
        [identifier('buzz')]
      ),
    ]);

    expect(unwrapNodeGroup(given)).toEqual(expected);
  });

  it('should unwrap if only one statement in a node group', () => {
    const given = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ]);
    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [identifier('foo')],
      [identifier('bar')]
    );

    expect(unwrapNodeGroup(given)).toEqual(expected);
  });
});

describe('unwrapNestedNodeGroups', () => {
  it('should not unwrap if no nested groups', () => {
    const given = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ]);

    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ]);
    expect(unwrapNestedNodeGroups(given)).toEqual(expected);
  });

  it('should unwrap if one level of nested groups', () => {
    const given = nodeGroup([
      nodeGroup([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [identifier('bar')]
        ),
      ]),
    ]);

    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ]);
    expect(unwrapNestedNodeGroups(given)).toEqual(expected);
  });

  it('should unwrap if multiple levels of nested groups', () => {
    const given = nodeGroup([
      nodeGroup([
        nodeGroup([
          nodeGroup([
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [identifier('bar')]
            ),
          ]),
        ]),
      ]),
    ]);

    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ]);
    expect(unwrapNestedNodeGroups(given)).toEqual(expected);
  });
});

describe('unwrapStatement', () => {
  it('should not unwrap if not a node group', () => {
    const given = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [identifier('foo')],
      [identifier('bar')]
    );
    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [identifier('foo')],
      [identifier('bar')]
    );

    expect(unwrapStatement(given)).toEqual(expected);
  });

  it('should not unwrap if empty node group', () => {
    const given = nodeGroup([]);
    const expected = nodeGroup([]);

    expect(unwrapStatement(given)).toEqual(expected);
  });

  it('should not unwrap if more than one statement in a node group', () => {
    const given = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('fizz')],
        [identifier('buzz')]
      ),
    ]);
    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('fizz')],
        [identifier('buzz')]
      ),
    ]);

    expect(unwrapStatement(given)).toEqual(expected);
  });

  it('should unwrap if only one statement in a node group', () => {
    const given = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ]);
    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [identifier('foo')],
      [identifier('bar')]
    );

    expect(unwrapStatement(given)).toEqual(expected);
  });
});

describe('unwrapStatements', () => {
  it('should not unwrap if not a node group', () => {
    const given = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [identifier('foo')],
      [identifier('bar')]
    );
    const expected = [
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ];

    expect(unwrapStatements(given)).toEqual(expected);
  });

  it('should unwrap if empty node group', () => {
    const given = nodeGroup([]);
    const expected = Array<LuaStatement>();

    expect(unwrapStatements(given)).toEqual(expected);
  });

  it('should unwrap if more than one statement in a node group', () => {
    const given = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('fizz')],
        [identifier('buzz')]
      ),
    ]);
    const expected = [
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('fizz')],
        [identifier('buzz')]
      ),
    ];

    expect(unwrapStatements(given)).toEqual(expected);
  });

  it('should unwrap if only one statement in a node group', () => {
    const given = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ]);
    const expected = [
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
    ];

    expect(unwrapStatements(given)).toEqual(expected);
  });
});
