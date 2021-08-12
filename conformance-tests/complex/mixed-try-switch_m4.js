let c;
const a = f();
const h = () => {
    switch(a) {
        case 1:
            try {
                g();
            }
            catch(e) {
                return e;
            }
        case 2:
            c = 2;
            break;
    }
    return "ok";
}