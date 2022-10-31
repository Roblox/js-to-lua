import {
  isIdentifier,
  LuaNode,
  LuaPropertySignature,
} from '@js-to-lua/lua-types';

const REACT_COMPONENTS_BUILT_IN_METHODS = [
  'render',
  'componentWillMount',
  'UNSAFE_componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'UNSAFE_componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'UNSAFE_componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'componentDidCatch',
];
export const isReactBuildInMethodName = (m: LuaNode) =>
  isIdentifier(m) && REACT_COMPONENTS_BUILT_IN_METHODS.includes(m.name);
export const isNotReactBuildIn = (m: LuaPropertySignature) =>
  !isReactBuildInMethodName(m.key);
