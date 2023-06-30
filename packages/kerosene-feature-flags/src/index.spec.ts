import { type Flag, flag } from ".";
import type { Runtime } from "./Condition";

interface Case {
  conditions: Runtime;
  flag: Flag;
  result: boolean;
}

const cases: Case[] = [
  {
    conditions: {
      environment: "development",
      group: "beta",
      browser: "Firefox",
    },
    flag: flag((c) => [
      c.condition("environment").must.be.any.of(["development", "staging"]),
      c.condition("environment").must.not.be.exactly("production"),
      c.condition("group").must.be.exactly("beta"),
      c.condition("browser").must.not.be.exactly("Chrome"),
    ]),
    result: true,
  },
  {
    conditions: {
      groups: ["beta", "users"],
    },
    flag: flag((c) => [
      c.condition("groups").must.be.all.of(["beta", "users"]),
    ]),
    result: true,
  },
  {
    conditions: {
      groups: ["beta"],
    },
    flag: flag((c) => [
      c.condition("groups").must.be.all.of(["beta", "users"]),
    ]),
    result: false,
  },
  {
    conditions: {
      environment: "production",
      group: "users",
      browser: "Firefox",
    },
    flag: flag((c) => [
      c.condition("environment").must.not.be.any.of(["development", "staging"]),
      c.condition("group").must.not.be.exactly("beta"),
      c.condition("browser").must.not.be.exactly("Chrome"),
    ]),
    result: true,
  },
  {
    conditions: {
      num: 50,
    },
    flag: flag((c) => [
      c.condition("num").must.be.greaterThan(40),
      c.condition("num").must.be.lessThan(60),
      c.condition("num").must.not.be.greaterThan(70),
      c.condition("num").must.not.be.lessThan(30),
    ]),
    result: true,
  },
];

test.each(cases)("Feature Flag", ({ conditions, flag: _flag, result }) => {
  expect(_flag(conditions)).toEqual(result);
});
