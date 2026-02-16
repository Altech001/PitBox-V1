import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-destructive/10 flex items-center justify-center rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white mb-2">Something went wrong</h1>
          <p className="text-muted-foreground text-sm max-w-xs mb-8">
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="rounded-none bg-primary text-black font-black uppercase flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;