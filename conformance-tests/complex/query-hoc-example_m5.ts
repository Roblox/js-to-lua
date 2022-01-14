const operationOptions: any = {}
let props
function foo () {
  return ({ client: _, data, ...r }: any) => {
    if (operationOptions.withRef) {
      this.withRef = true;
      props = Object.assign({}, props, {
        ref: this.setWrappedInstance
      });
    }
  }
}
