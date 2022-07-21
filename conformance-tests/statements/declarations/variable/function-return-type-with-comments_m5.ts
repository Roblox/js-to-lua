const foo: ()=> /* Comment before foo void */ void /* Comment after foo void */= ():void => {}
const fizz = function ():/* Comment before fizz void */void/* Comment after fizz void */ {}
const buzz: ()=>/* Comment before lhs buzz void */void/* Comment after lhs buzz void */ = function():/* Comment before rhs buzz void */void/* Comment after rhs buzz void */ {}
function jazz():/* Comment before jazz void */void/* Comment after jazz void */ {}
