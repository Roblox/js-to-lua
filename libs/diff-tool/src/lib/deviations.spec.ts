import { dedent } from '@js-to-lua/shared-utils';
import { applyKnownDeviations } from './deviations';

describe('deviations', () => {
  describe(applyKnownDeviations.name, () => {
    it('delivers perfectly indented code', () => {
      const left = dedent`
        function indentIssue()
        \t-- ROBLOX deviation START:
        \t-- local wronglyIndented = "something"
        \t-- ROBLOX deviation END
        end
      `;
      const right = dedent`
        function indentIssue()
        \tif (isChanged)
        \t\tlocal wronglyIndented = "something"
        \tend
        end
      `;

      expect(applyKnownDeviations(left, right)).toBe(
        dedent`
          function indentIssue()
          \tif (isChanged)
          \t\t-- ROBLOX deviation START:
          \t\t-- local wronglyIndented = "something"
          \t\t-- ROBLOX deviation END
          \tend
          end
        `
      );
    });

    it('can change signatures', () => {
      const left = dedent`
        -- ROBLOX deviation START: changed function signature
        -- function foo(bar: string)
        function foo(bar: string | number): ()
        \t-- ROBLOX deviation END
        \tprint(bar)
        end`;
      const right = dedent`
        function foo(bar: string)
        \tprint(bar)
        end`;
      expect(applyKnownDeviations(left, right)).toBe(
        dedent`
        -- ROBLOX deviation START: changed function signature
        -- function foo(bar: string)
        function foo(bar: string | number): ()
        \t-- ROBLOX deviation END
        \tprint(bar)
        end`
      );
    });

    it('converts just the deviation', () => {
      const left = dedent`
        local function dummyCode (args: any)
        \treturn nil
        end
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- local nonWorkingLine2 = "neither does this"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect"`;
      const right = dedent`
        local function dummyCode (args: any)
        \treturn nil
        end
        local nonWorkingLine = "this doesn't convert"
        local nonWorkingLine2 = "neither does this"
        local goodLine = "this line is perfect, but changed"`;

      expect(applyKnownDeviations(left, right)).toBe(dedent`
        local function dummyCode (args: any)
        \treturn nil
        end
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- local nonWorkingLine2 = "neither does this"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect, but changed"`);
    });

    it('converts just the deviation inside a function body', () => {
      const left = dedent`
        local function dummyCode (args: any)
        \treturn nil
        end
        function foo()
        \t-- ROBLOX deviation START: we marked this so it shows up in the test
        \t-- local nonWorkingLine = "this doesn't convert"
        \t-- local nonWorkingLine2 = "neither does this"
        \t-- ROBLOX deviation END
        end
        local goodLine = "this line is perfect"`;
      const right = dedent`
        local function dummyCode (args: any)
        \treturn nil
        end
        function foo()
        \tlocal nonWorkingLine = "this doesn't convert"
        \tlocal nonWorkingLine2 = "neither does this"
        end
        local goodLine = "this line is perfect, but changed"`;

      expect(applyKnownDeviations(left, right)).toBe(dedent`
        local function dummyCode (args: any)
        \treturn nil
        end
        function foo()
        \t-- ROBLOX deviation START: we marked this so it shows up in the test
        \t-- local nonWorkingLine = "this doesn't convert"
        \t-- local nonWorkingLine2 = "neither does this"
        \t-- ROBLOX deviation END
        end
        local goodLine = "this line is perfect, but changed"`);
    });

    it('applies all deviations in a block', () => {
      const left = dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect"
        -- ROBLOX deviation START: this one has a different comment
        -- local nonWorkingLine2 = "this doesn't convert"
        -- ROBLOX deviation END
        local otherLine = "this line is different"`;
      const right = dedent`
        local nonWorkingLine = "this doesn't convert"
        local goodLine = "this line is perfect"
        local nonWorkingLine2 = "this doesn't convert"
        local otherLine = "this line is changed"`;

      expect(applyKnownDeviations(left, right)).toBe(dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect"
        -- ROBLOX deviation START: this one has a different comment
        -- local nonWorkingLine2 = "this doesn't convert"
        -- ROBLOX deviation END
        local otherLine = "this line is changed"`);
    });

    it('only applies one deviation once', () => {
      const left = dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect"
        local nonWorkingLine = "this doesn't convert"
        local otherLine = "this line is different"`;
      const right = dedent`
        local nonWorkingLine = "this doesn't convert"
        local goodLine = "this line is perfect"
        local nonWorkingLine = "this doesn't convert"
        local otherLine = "this line is changed"`;

      expect(applyKnownDeviations(left, right)).toBe(dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect"
        local nonWorkingLine = "this doesn't convert"
        local otherLine = "this line is changed"`);
    });

    it('only applies one deviation once', () => {
      const left = dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect"
        local nonWorkingLine = "this doesn't convert"
        local otherLine = "this line is different"`;
      const right = dedent`
        local nonWorkingLine = "this doesn't convert"
        local goodLine = "this line is perfect"
        local nonWorkingLine = "this doesn't convert"
        local otherLine = "this line is changed"`;

      expect(applyKnownDeviations(left, right)).toBe(dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        -- ROBLOX deviation END
        local goodLine = "this line is perfect"
        local nonWorkingLine = "this doesn't convert"
        local otherLine = "this line is changed"`);
    });

    it('preserves manual fixes', () => {
      const left = dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        local workingLine = "but we have a manual fix"
        -- ROBLOX deviation END
        local otherLine = "this line is different"`;
      const right = dedent`
        local nonWorkingLine = "this doesn't convert"
        local otherLine = "this line is different"`;

      expect(applyKnownDeviations(left, right)).toBe(dedent`
        -- ROBLOX deviation START: we marked this so it shows up in the test
        -- local nonWorkingLine = "this doesn't convert"
        local workingLine = "but we have a manual fix"
        -- ROBLOX deviation END
        local otherLine = "this line is different"`);
    });

    it("doesn't break comment or indent lookalikes", () => {
      const left = dedent`
        -- ROBLOX deviation START
        -- local foo = "string with '-- ' inside"
        -- local bar = "string with tab characters '\t\t\t' inside"
        -- ROBLOX deviation END`;
      const right = dedent`
        -- A random comment
        local foo = "string with '-- ' inside"
        local bar = "string with tab characters '\t\t\t' inside"`;

      expect(applyKnownDeviations(left, right)).toBe(dedent`
        -- A random comment
        -- ROBLOX deviation START
        -- local foo = "string with '-- ' inside"
        -- local bar = "string with tab characters '\t\t\t' inside"
        -- ROBLOX deviation END`);
    });
  });
});
