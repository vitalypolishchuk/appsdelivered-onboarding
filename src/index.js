import Resolver from "@forge/resolver";
import { storage } from "@forge/api";

const resolver = new Resolver();

const ISSUES_KEY = "issues";

resolver.define("getIssues", async () => {
  const issues = await storage.get(ISSUES_KEY);
  if (issues === undefined) return [];
  return issues;
});

resolver.define("setIssues", async ({ payload }) => {
  const { issues } = payload;
  await storage.set(ISSUES_KEY, issues);
});

resolver.define("getText", async (req) => {
  console.log(req);

  return "Hello world";
});

export const handler = resolver.getDefinitions();
