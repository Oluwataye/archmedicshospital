import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to error reporting service
        console.error('Error caught by boundary:', error, errorInfo);

        this.setState({ errorInfo });

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        this.props.onReset?.();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center min-h-screen p-4 bg-background">
                    <Card className="max-w-2xl w-full">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-destructive/10 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-destructive" />
                                </div>
                                <CardTitle className="text-2xl">Something went wrong</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
                            </p>

                            {import.meta.env.DEV && this.state.error && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-destructive">
                                        Error Details (Development Mode):
                                    </p>
                                    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-md overflow-auto max-h-60">
                                        <p className="text-sm font-mono text-destructive mb-2">
                                            {this.state.error.message}
                                        </p>
                                        {this.state.error.stack && (
                                            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                                {this.state.error.stack}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={this.handleReset}
                                    className="flex-1"
                                    variant="default"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={this.handleGoHome}
                                    className="flex-1"
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
