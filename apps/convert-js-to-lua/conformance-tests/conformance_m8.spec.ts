import { conformanceTests, Milestone } from './conformance-tests';

conformanceTests(
  Milestone.M8,
  { describe, it, xit, expect },
  { plugins: ['knownImports'] }
);
