import { autoResolve } from './auto-resolve-strategy';
import { dedent } from '@js-to-lua/shared-utils';
import { Conflict } from './conflict';

describe('autoResolveStrategy', () => {
  it('uses current for valid conflict blocks', () => {
    const current = dedent`
      \tArray.forEach({ BigInt(1), BigInt("1") }, function(v)
      \t\treturn v
      \tend)`;
    const incoming = '\tlocal Packages = CurrentModule.Parent';
    const [test] = autoResolve(
      dedent`
        \tlocal DID_NOT_THROW = "Received function did not throw"
        <<<<<<< HEAD
        ${current}
        =======
        ${incoming}
        >>>>>>> upstream
        \treturn "this is the end"
        end`,
      [new Conflict(current, incoming, 'HEAD', 'upstream')]
    );
    expect(test).toBe(
      dedent`
      \tlocal DID_NOT_THROW = "Received function did not throw"
      ${current}
      \treturn "this is the end"
      end`
    );
  });

  it('uses incoming for when current is empty', () => {
    const incoming = '\tlocal Packages = CurrentModule.Parent';
    const [test] = autoResolve(
      dedent`
        \tlocal DID_NOT_THROW = "Received function did not throw"
        <<<<<<< HEAD

        =======
        ${incoming}
        >>>>>>> upstream
        \treturn "this is the end"
        end`,
      [new Conflict('', incoming, 'HEAD', 'upstream')]
    );
    expect(test).toBe(
      dedent`
      \tlocal DID_NOT_THROW = "Received function did not throw"
      ${incoming}
      \treturn "this is the end"
      end`
    );
  });
});
