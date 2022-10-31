class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
}
