-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/intersection/ts-intersection-type-multiple-mixed-union_m5.ts
type Mixed = { foo: number } | ({ bar: string } & { baz: boolean })
type Mixed_ = ({ foo: number } | { bar: string }) & { baz: boolean }
type Mixed__ = { foo: number } | ({ bar: string } & { baz: boolean })
type Mixed___ = ({ foo: number } & { bar: string }) | { baz: boolean }
