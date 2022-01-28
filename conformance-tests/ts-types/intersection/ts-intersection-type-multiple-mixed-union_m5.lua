type Mixed = { foo: number } | ({ bar: string} & { baz: boolean })
type Mixed_ = ({ foo: number } | { bar: string }) & { baz: boolean }
type Mixed__ = { foo: number } | ({ bar: string } & { baz: boolean })
type Mixed___ = ({ foo: number } & { bar: string}) | { baz: boolean }
