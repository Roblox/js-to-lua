let foo = {
  ['some-method']() {}
}
let method =  'method'
foo['some-' + method]()
