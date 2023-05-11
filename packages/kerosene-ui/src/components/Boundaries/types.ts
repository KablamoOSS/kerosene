import type { MergedUnion } from "@kablamo/kerosene";
import type {
  ErrorBoundaryPropsWithComponent,
  ErrorBoundaryPropsWithFallback,
  ErrorBoundaryPropsWithRender,
} from "react-error-boundary";

export type ErrorFallbackProps = MergedUnion<
  | {
      errorFallback: ErrorBoundaryPropsWithFallback["fallback"];
    }
  | {
      errorFallbackRender: ErrorBoundaryPropsWithRender["fallbackRender"];
    }
  | {
      ErrorFallbackComponent: ErrorBoundaryPropsWithComponent["FallbackComponent"];
    }
>;
