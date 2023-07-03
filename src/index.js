import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("getIssues", async () => {});

resolver.define("getText", async (req) => {
  console.log(req);

  return "Hello world";
});

export const handler = resolver.getDefinitions();
