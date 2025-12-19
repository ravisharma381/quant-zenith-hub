import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep this console output for debugging in preview environments.
    console.error("App render error:", error, info);
  }

  private reload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <Card className="w-full max-w-xl border-border bg-card/60 backdrop-blur">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg">Preview crashed</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              There’s a runtime error preventing the app from rendering.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="text-xs whitespace-pre-wrap rounded-md border border-border bg-background/40 p-3 text-muted-foreground">
              {this.state.error.message}
            </pre>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={this.reload} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reload preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
