import { Component, type ReactNode } from 'react';
import { strings } from '../../app/strings.ts';
import { clearFailedResources } from '../../content/loader.ts';
import { Button } from './Button.tsx';

interface Props {
  children: ReactNode;
  /** Changing this value clears the error, for example when the route changes. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  private retry = () => {
    clearFailedResources();
    this.setState({ error: null });
  };

  override render() {
    if (this.state.error) {
      return (
        <div role="alert" style={{ padding: 'var(--space-6) 0' }}>
          <p>{strings.loadError}</p>
          <Button onClick={this.retry}>{strings.retry}</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
