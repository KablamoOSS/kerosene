import { Condition, Runtime } from "./Condition";

type Flag = (runtime: Runtime) => boolean;

type FlagCallback = (c: Condition) => Condition[];

// flag constructor, creates a flag that can be executed at runtime
// to determine it's status
function flag(callback: FlagCallback): Flag {
  const condition = new Condition();
  const checks = callback(condition);

  // Return a function to be called at runtime, to check if the flag
  // is enabled
  return (runtime: any): boolean => {
    return (
      checks
        .map(check => {
          // Check the assertion is valid
          return check.validate(runtime);
        })
        // check every assertion is valid with a result of true
        .every(result => result === true)
    );
  };
}

export { flag, Flag };
