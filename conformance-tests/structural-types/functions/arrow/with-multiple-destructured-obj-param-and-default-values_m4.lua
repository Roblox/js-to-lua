local fizz, fuzz
local function reduce(ref, ref_)
	if ref == nil then
		ref = fizz
	end
	local foo = ref.foo
	if ref_ == nil then
		ref_ = fuzz
	end
	local bar = table.unpack(ref_, 1, 1)
	return { foo, bar }
end
