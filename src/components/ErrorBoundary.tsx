import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-on-surface)] flex flex-col items-center justify-center p-6">
          <div className="bg-[var(--color-surface)] neo-card neo-shadow-card p-10 max-w-md w-full text-center space-y-6">
            <div className="text-5xl">⚠</div>
            <h2 className="text-3xl font-headline font-bold uppercase">Something went wrong</h2>
            <p className="text-sm font-body opacity-70 font-mono break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-label text-lg py-3 uppercase tracking-widest hover:bg-[var(--color-primary-dim)] transition-colors neo-button neo-shadow-button"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
