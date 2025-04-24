import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return { 
            hasError: true, 
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.logError(error, errorInfo);
    }

    private logError(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });
    }

    private handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Something went wrong</h2>
                    <p>We apologize for the inconvenience. Please try again or contact support if the problem persists.</p>
                    <button 
                        className="error-boundary__button"
                        onClick={this.handleReset}
                    >
                        Try Again
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="error-boundary__details">
                            <summary>Error Details</summary>
                            <pre>
                                {this.state.error && this.state.error.toString()}
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;