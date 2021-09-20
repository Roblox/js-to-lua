class BaseClass {
    initializedProperty = true;
    notInitializedProperty; // should be ignored when converted
    static staticProperty = false
    constructor(){}
}

class MyClass extends BaseClass {
    initializedProperty = true;
    notInitializedProperty; // should be ignored when converted
    static staticProperty = false
    constructor(){}
}