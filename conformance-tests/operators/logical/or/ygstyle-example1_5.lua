-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/or/ygstyle-example1_5.ts
local areNonFloatValuesEqual: boolean = self.direction == style.direction
	or self.flexDirection == style.flexDirection
	or self.justifyContent == style.justifyContent
	or self.alignContent == style.alignContent
	or self.alignItems == style.alignItems
	or self.alignSelf == style.alignSelf
	or self.positionType == style.positionType
	or self.flexWrap == style.flexWrap
	or self.overflow == style.overflow
	or self.display == style.display
