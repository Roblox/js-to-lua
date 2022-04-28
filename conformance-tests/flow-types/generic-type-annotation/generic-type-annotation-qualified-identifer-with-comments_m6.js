const foo: /* Before A */A/* After A */./* Before B */B/* After B */./* Before C */C/* After C */ = bar

function myFunc() : /* Before React */React/* After React */./* Before Node */Node/* After Node */./* Before Value */Value/* After Value */ { }

function myFunc2(baz : /* Before React */React/* After React */./* Before Node */Node/* After Node */./* Before Value */Value/* After Value */ ) : /* Before React */React/* After React */./* Before Node */Node/* After Node */./* Before Value */Value/* After Value */ { }

function myFunc3(baz : /* Before React */React/* After React */./* Before Node */Node/* After Node */./* Before Value */Value/* After Value */, biz : /* Before React */React/* After React */./* Before Node */Node/* After Node */./* Before Value */Value/* After Value */./* Before AnotherType */AnotherType/* After AnotherType */) : /* Before React */React/* After React */./* Before Node */Node/* After Node */./* Before Value */Value/* After Value */./* Before AnotherType */AnotherType/* After AnotherType */ { }
