local foo, fizz, fuzz
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end