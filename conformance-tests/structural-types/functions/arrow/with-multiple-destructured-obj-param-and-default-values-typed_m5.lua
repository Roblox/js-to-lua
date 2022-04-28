local fizz, fuzz
local function reduce(ref: { foo: string }?, ref_: Array<number>?)
	if ref == nil then
		ref = fizz
	end
	local foo = ref.foo
	if ref_ == nil then
		ref_ = fuzz
	end
	local bar = ref_[1]
	return { foo, bar }
end
