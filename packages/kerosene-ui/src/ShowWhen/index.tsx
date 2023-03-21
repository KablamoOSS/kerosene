import { PureComponent, type ReactNode } from "react";

interface ShowWhenProps {
  when: boolean;
  children: ReactNode;
}

export default class ShowWhen extends PureComponent<ShowWhenProps> {
  public render() {
    const { children, when } = this.props;
    return when ? children : null;
  }
}
