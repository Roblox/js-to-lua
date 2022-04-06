const set = new Set([value]);
(set as any).toJSON = jest.fn(() => 'map');
// not using `not` as it's currently handled as `["not"]` on member expressions
expect((set as any).toJSON)/*.not*/.toBeCalled();
