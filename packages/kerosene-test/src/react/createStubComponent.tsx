import { identity } from "lodash";
import * as React from "react";

export default function createStubComponent<
  Props extends {} = { [prop: string]: unknown },
  RenderProps extends readonly any[] = any[]
>(displayName: string, functional?: false): React.ComponentClass<Props>;

export default function createStubComponent<
  Props extends {} = { [prop: string]: unknown },
  RenderProps extends readonly any[] = any[]
>(displayName: string, functional: true): React.FunctionComponent<Props>;

export default function createStubComponent<
  Props extends {} = { [prop: string]: unknown },
  RenderProps extends readonly any[] = any[]
>(
  displayName: string,
  functional: false | undefined,
  getRenderProps: (props: Omit<Props, "children">) => RenderProps,
  transformRenderPropResult?: (
    result: (props: any) => React.ReactNode,
  ) => React.ReactNode,
): React.ComponentClass<
  Props & { children: (...args: RenderProps) => React.ReactNode }
>;

export default function createStubComponent<
  Props extends {} = { [prop: string]: unknown },
  RenderProps extends readonly any[] = any[]
>(
  displayName: string,
  functional: true,
  getRenderProps: (props: Omit<Props, "children">) => RenderProps,
  transformRenderPropResult?: (
    result: (props: any) => React.ReactNode,
  ) => React.ReactNode,
): React.FunctionComponent<
  Props & { children: (...args: RenderProps) => React.ReactNode }
>;

/**
 * Creates a StubComponent for unit testing
 * @param displayName Component displayName which can be used to `EnzymeWrapper#find` the component
 * @param functional Whether or not use functional component instead of a class component (defaults to `false`)
 * @param getRenderProps Function that returns props that will be passed the the children function
 * @param transformRenderPropResult Function to transform the result returned by the render prop (if, for example,
 * the returned result is a function itself)
 */
export default function createStubComponent<
  Props extends { children?: unknown } = { [prop: string]: unknown },
  RenderProps extends readonly any[] = any[]
>(
  displayName: string,
  functional = false,
  getRenderProps?: (props: Omit<Props, "children">) => RenderProps,
  transformRenderPropResult: (
    result: (props: any) => React.ReactNode,
  ) => React.ReactNode = identity,
): React.ComponentType<Props> {
  if (functional) {
    return Object.assign(
      ({ children, ...props }: Props) => (
        <div __displayName__={displayName} {...props}>
          {typeof children === "function"
            ? transformRenderPropResult(children(...getRenderProps!(props)))
            : (children as React.ReactNode)}
        </div>
      ),
      { displayName },
    );
  }

  // eslint-disable-next-line react/prefer-stateless-function
  return class extends React.Component<Props> {
    public static displayName = displayName;

    public render() {
      const { children, ...props } = this.props;

      return (
        <div __displayName__={displayName} {...props}>
          {typeof children === "function"
            ? transformRenderPropResult(
                (children as (...args: RenderProps) => React.ReactNode)(
                  ...getRenderProps!(props),
                ) as any,
              )
            : (children as React.ReactNode)}
        </div>
      );
    }
  };
}
