type ValueComplex =
  | number
  | string
  | Reference
  | Object
  | {
  foo: number | Object,
  bar:
    | number
    | string
    | Reference
    | Object
};
