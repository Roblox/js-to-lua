export namespace Foo {
  export class BarClass {
    property: string;
    method(): BarClass {
      return this;
    }
  }

  export namespace Bar {
    export class BazClass {
      bazProperty: string;
      bazMethod(): BazClass {
        return this;
      }
    }
  }
}
