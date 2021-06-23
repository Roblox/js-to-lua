return function()
	-- extracted from https://github.com/graphql/graphql-js/blob/1951bce42092123e844763b6a8e985a8a3327511/src/language/__tests__/lexer-test.js
	-- skip imports to simplify test case

	local function lexOne(str: string)
		local lexer = Lexer.new(Source.new(str))
		return lexer:advance()
	end

	local function lexSecond(str: string)
		local lexer = Lexer.new(Source.new(str))
		lexer:advance()
		return lexer:advance()
	end

	local function expectSyntaxError(text: string)
		return expect(function()
			lexSecond(text)
		end).to.throw()
	end

	describe("Lexer", function()
		it("disallows uncommon control characters", function()
			expectSyntaxError("\007").to.deep.equal({
				message = "Syntax Error: Cannot contain the invalid character \"\\u0007\".",
				locations = { { column = 1, line = 1 } },
			})
		end)

		it("accepts BOM header", function()
			expect(lexOne("\u{FEFF} foo")).to.contain({
				kind = TokenKind.NAME,
				start = 3,
				end_ = 6,
				value = "foo",
			})
		end)

		it("tracks line breaks", function()
			expect(lexOne("foo")).to.contain({
				kind = TokenKind.NAME,
				start = 1,
				end_ = 4,
				line = 1,
				column = 1,
				value = "foo",
			})
			expect(lexOne("\nfoo")).to.contain({
				kind = TokenKind.NAME,
				start = 2,
				end_ = 5,
				line = 2,
				column = 1,
				value = "foo",
			})
			expect(lexOne("\rfoo")).to.contain({
				kind = TokenKind.NAME,
				start = 2,
				end_ = 5,
				line = 2,
				column = 1,
				value = "foo",
			})
			expect(lexOne("\r\nfoo")).to.contain({
				kind = TokenKind.NAME,
				start = 3,
				end_ = 6,
				line = 2,
				column = 1,
				value = "foo",
			})
			expect(lexOne("\n\rfoo")).to.contain({
				kind = TokenKind.NAME,
				start = 3,
				end_ = 6,
				line = 3,
				column = 1,
				value = "foo",
			})
			expect(lexOne("\r\r\n\nfoo")).to.contain({
				kind = TokenKind.NAME,
				start = 5,
				end_ = 8,
				line = 4,
				column = 1,
				value = "foo",
			})
			expect(lexOne("\n\n\r\rfoo")).to.contain({
				kind = TokenKind.NAME,
				start = 5,
				end_ = 8,
				line = 5,
				column = 1,
				value = "foo",
			})
		end)

		it("records line and column", function()
			expect(lexOne("\n \r\n \r  foo\n")).to.contain({
				kind = TokenKind.NAME,
				start = 9,
				end_ = 12,
				line = 4,
				column = 3,
				value = "foo",
			})
		end)
	end)
end
