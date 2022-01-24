function render() {
  updates.push('Inner-render-' + this.props.x + '-' + this.state.x);
  return <div />;
}
