local foo1, fizz1, fuzz
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo1, fizz1, fuzz = ref.foo, ref.fizz, ref.fuzz
end
