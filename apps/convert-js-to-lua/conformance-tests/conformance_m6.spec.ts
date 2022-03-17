import { normalize } from 'path';
import { conformanceTests, Milestone } from './conformance-tests';

conformanceTests(
  Milestone.M6,
  { describe, it, xit, expect },
  {
    babelConfig: normalize('./babel-flow.config.json'),
    babelTransformConfig: normalize('./babel-flow-transform-react.config.json'),
  }
);
