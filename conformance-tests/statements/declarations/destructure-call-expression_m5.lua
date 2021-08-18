local function func()
	return { foo = "bar", fizz = "buzz", fuzz = "jazz" }
end
local foo, fizz, fuzz
do
	local ref = func()
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end
