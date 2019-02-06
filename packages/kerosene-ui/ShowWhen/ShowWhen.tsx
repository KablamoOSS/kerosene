import { PureComponent, ReactNode } from "react";

interface ShowWhenProps {
    when: boolean;
    children: ReactNode;
}

class ShowWhen extends PureComponent<ShowWhenProps> {
    public render() {
        if (this.props.when === false) {
            return null;
        }
        return this.props.children;
    }
}

export { ShowWhen };
