import { allConflictsFrom } from './conflict-factory';
import { dedent } from '@js-to-lua/shared-utils';

describe('ConflictFactory', () => {
  describe('allConflictsFrom', () => {
    it('extracts all conflicts', () => {
      expect(
        allConflictsFrom(
          dedent`
            <<<<<<< HEAD

            =======
            \tArray.forEach({ BigInt(1), BigInt("1") }, function(v)
            \t\tit(("fails for '%s' with '.not'"):format(tostring(stringify(v))), function()
            \t\t\texpect(function()
            \t\t\t\treturn jestExpect(v)["not"].toBe(v)
            \t\t\tend).toThrow("toBe")
            \t\tend)
            \tend)
            >>>>>>> upstream`
        )
      ).toHaveLength(1);
    });

    it('can extract only incoming conflict', () => {
      expect(
        allConflictsFrom('<<<<<<<\n=======\nnew incoming line\n>>>>>>>')
      ).toHaveLength(1);
    });

    it('can extract only current conflict', () => {
      expect(
        allConflictsFrom('<<<<<<<\nold current line\n=======\n>>>>>>>')
      ).toHaveLength(1);
    });
  });
});
