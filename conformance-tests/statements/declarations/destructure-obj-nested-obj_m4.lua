local foo, fizz, fuzz
do
	local ref = { foo = "bar", bar = { fizz = "buzz", fuzz = "jazz" } }
	foo, fizz, fuzz = ref.foo, ref.bar.fizz, ref.bar.fuzz
end
