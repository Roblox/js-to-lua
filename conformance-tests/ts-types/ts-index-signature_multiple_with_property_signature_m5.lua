-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-index-signature_multiple_with_property_signature_m5.ts
type IndexSignature = ({ [string]: any } | { [number]: string }) & { bar: number, baz: string? }
