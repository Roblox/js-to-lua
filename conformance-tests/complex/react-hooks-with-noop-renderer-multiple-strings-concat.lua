local function test()
	expect(Scheduler).toFlushAndThrow(
		"Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for"
			.. " one of the following reasons:\n"
			.. "1. You might have mismatching versions of React and the renderer (such as React DOM)\n"
			.. "2. You might be breaking the Rules of Hooks\n"
			.. "3. You might have more than one copy of React in the same app\n"
			.. "See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem."
	)
end
