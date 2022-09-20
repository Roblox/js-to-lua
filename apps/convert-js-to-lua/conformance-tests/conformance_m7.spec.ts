import { conformanceTests, Milestone } from './conformance-tests';

conformanceTests(
  Milestone.M7,
  { describe, it, xit, expect },
  { plugins: ['jestGlobals'] }
);
