let exp = "some expression"
let foo = `foo`  +
`bar
baz` +
`${exp}`;

let bar =
`bar
baz` +
`${exp}` +
`foo`;

let baz = `${exp}` +
`foo`+
`bar
baz`