local obj = { nested = { foo = "bar", fizz = "buzz", fuzz = "jazz" } }
local foo, fizz, fuzz
do
	local ref = obj.nested
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end