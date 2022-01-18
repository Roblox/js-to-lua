import { Comment, Node, SourceLocation } from '@babel/types';
import { LuaComment, LuaNode } from '@js-to-lua/lua-types';
import { curry } from 'ramda';
import { F } from 'ts-toolbelt';

export type EmptyConfig = Record<never, unknown>;
export type ConfigBase = Record<string, any>;

export type BabelNode = Pick<
  Node,
  | 'type'
  | 'start'
  | 'end'
  | 'leadingComments'
  | 'innerComments'
  | 'trailingComments'
  | 'loc'
>;

export type HandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = F.Curry<(source: string, config: Config, node: T) => R>;

export type OptionalHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = F.Curry<(source: string, config: Config, node: T) => R | undefined>;

export interface BaseNodeHandler<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> {
  type: T['type'] | T['type'][];
  handler: HandlerFunction<R, T, Config>;
}

type NonCurriedHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => R;

type NonCurriedOptionalHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => R | undefined;

export const createHandlerFunction = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  func: NonCurriedHandlerFunction<R, T, Config>
): HandlerFunction<R, T, Config> =>
  curry(function (source: string, config: Config, node: T): R {
    return handleComments(source, node, func(source, config, node));
  });

export const createOptionalHandlerFunction = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  func: NonCurriedOptionalHandlerFunction<R, T, Config>
): OptionalHandlerFunction<R, T, Config> =>
  curry(function (source: string, config: Config, node: T): R | undefined {
    return func(source, config, node);
  });

export const createHandler = <
  R extends LuaNode,
  T extends BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  type: BaseNodeHandler<R, T, Config>['type'],
  handler: NonCurriedHandlerFunction<R, T, Config>
): BaseNodeHandler<R, T, Config> => ({
  type,
  handler: createHandlerFunction(
    (source, config: Config, node: T): R => handler(source, config, node)
  ),
});

const handleComments = <R extends LuaNode>(
  source: string,
  { leadingComments, innerComments, trailingComments, loc }: BabelNode,
  luaNode: R
): R => {
  return {
    ...luaNode,
    ...(leadingComments
      ? {
          leadingComments: leadingComments.map((comment) =>
            handleComment(source, comment, loc)
          ),
        }
      : {}),
    ...(innerComments
      ? {
          innerComments: innerComments.map((comment) =>
            handleComment(source, comment, loc)
          ),
        }
      : {}),
    ...(trailingComments
      ? {
          trailingComments: trailingComments.map((comment) =>
            handleComment(source, comment, loc)
          ),
        }
      : {}),
  };
};

const handledComments = new Map() as Map<Comment, LuaComment>;

const handleComment = (
  _source: string,
  comment: Comment,
  loc: SourceLocation | null
): LuaComment => {
  if (!handledComments.has(comment)) {
    handledComments.set(comment, {
      type: comment.type,
      value: comment.value,
      loc: 'Any',
    });
  }
  const handled = handledComments.get(comment)!;

  if (!loc) {
    return handled;
  }

  if (
    loc.start.line == comment.loc.end.line &&
    loc.start.column > comment.loc.end.column
  ) {
    handled.loc = 'SameLineLeadingComment';
  }
  if (
    loc.end.line == comment.loc.start.line &&
    loc.end.column < comment.loc.start.column
  ) {
    handled.loc = 'SameLineTrailingComment';
  }

  return handled;
};
