import { Page, ElementHandle, WaitForSelectorOptions } from "puppeteer";
const testIdAttribute = "data-testid";
const valueAttribute = "value";

const getTestId = (testId: string) => {
  return `[${testIdAttribute}="${testId}"]`;
};

const waitForTestId = async (
  page: Page,
  testId: string,
  options?: WaitForSelectorOptions,
): Promise<ElementHandle<Element>> => {
  return await page.waitForSelector(getTestId(testId), options);
};

const waitForDOMByValue = async (
  page: Page,
  domValue: string,
  options?: WaitForSelectorOptions,
): Promise<ElementHandle<Element>> => {
  return await page.waitForSelector(
    ((domValue: string) => {
      return `[${valueAttribute}="${domValue}"]`;
    })(domValue),
    options,
  );
};

const clickTestId = async (page: Page, testId: string) => {
  await page.click(getTestId(testId));
};

const waitAndClickTestId = async (page: Page, testId: string) => {
  await waitForTestId(page, testId);
  await page.click(getTestId(testId));
};

const getValueOfTestId = async (
  page: Page,
  testId: string,
): Promise<string> => {
  const element = await page.$(getTestId(testId));
  return await page.evaluate(element => element.textContent, element);
};

const assertTestIdContains = async (
  page: Page,
  testId: string,
  contains: string,
): Promise<void> => {
  const value = await getValueOfTestId(page, testId);
  expect(value).toContain(contains);
};

export {
  getTestId,
  clickTestId,
  waitForTestId,
  waitAndClickTestId,
  getValueOfTestId,
  assertTestIdContains,
  waitForDOMByValue,
};
