-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/jest-fake-timers-type_m5.ts
type Exclude<T, U> = any --[[ ROBLOX TODO: TS 'Exclude' built-in type is not available in Luau ]]
type FakeTimers =
	GlobalFakeTimersConfig
	& (
		(FakeTimersConfig & { now: Exclude<typeof((({} :: any) :: FakeTimersConfig).now), Date>? })
		| LegacyFakeTimersConfig
	)
