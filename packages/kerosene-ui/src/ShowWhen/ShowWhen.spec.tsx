import { shallow } from "enzyme";
import * as React from "react";

import { ShowWhen } from "./ShowWhen";

interface Case {
    name: string;
    when: boolean;
    children: React.ReactNode;
}

const cases: Case[] = [
    {
        name: "Should return Test as text",
        when: true,
        children: "Test",
    },
    {
        name: "Should return Test in a <span />",
        when: true,
        children: <span>Test</span>,
    },
    {
        name: "Should return null",
        when: false,
        children: "Test",
    },
];

test.each(cases)("ShowWhen %j", ({ name, when, children }: Case) => {
    const wrapper = shallow(<ShowWhen when={when}>{children}</ShowWhen>);

    if (when === false) {
        expect(wrapper.getElement()).toBeNull();
    }

    if (when === true) {
        expect(wrapper.text()).not.toBeNull();
        expect(wrapper.text()).toMatchSnapshot(name);

        if (typeof children === "string") {
            expect(wrapper.text()).not.toBeNull();
            expect(wrapper.text()).toEqual(children);
        }
    }
});
