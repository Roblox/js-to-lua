class DefaultReporter {
  constructor() {
    const stream = {}

    /* we assign an arrow function to write so we want to capture `this` from lexical scope and ignore the one passed */
    stream.write = (chunk: string) => {
      this.__clearStatus();
      write(chunk);
      this.__printStatus();
      return true;
    };

    /* we assign a regular function to write so we want to use the passed in `this` */
    stream.write2 = function(chunk: string) {
      this.__clearStatus();
      write(chunk);
      this.__printStatus();
      return true;
    };

    this.stream = stream
  }
}
