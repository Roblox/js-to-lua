class BaseClass {
  /* Initialized property comment in BaseClass */
  initializedProperty = true;
  /* Not initialzed property comment in BaseClass */
  notInitializedProperty;
  static staticProperty = false
  constructor(){}
}

class MyClass extends BaseClass {
  /* Initialized property comment in MyClass */
  initializedProperty = true;
  /* Not initialzed property comment in MyClass */
  notInitializedProperty;
  /* Static comment in MyClass */
  static staticProperty = false
  constructor(){}
}
