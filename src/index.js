import Resolver from "@forge/resolver";
import { storage } from "@forge/api";
import { Configuration, OpenAIApi } from "openai";

const resolver = new Resolver();

const ISSUES_KEY = "issues";
const OPENAI_DATA_KEY = "openaiData";

resolver.define("getIssues", async () => {
  const issues = await storage.get(ISSUES_KEY);
  if (issues === undefined) return [];
  return issues;
});

resolver.define("setIssues", async ({ payload }) => {
  const { issues } = payload;
  await storage.set(ISSUES_KEY, issues);
});

resolver.define("getOpenAIData", async () => {
  // await storage.delete(OPENAI_DATA_KEY);
  const openAIData = await storage.get(OPENAI_DATA_KEY);
  if (openAIData === undefined) return { openaiKey: "", organizationID: "" };
  return openAIData;
});

resolver.define("setOpenAIData", async ({ payload }) => {
  const { openAIData } = payload;
  await storage.set(OPENAI_DATA_KEY, openAIData);
});

resolver.define("generateSummary", async ({ payload }) => {
  const { openAIData, description, issueType } = payload;

  const url = "/chat/completions";

  const configuration = new Configuration({
    apiKey: openAIData.openaiKey,
    organization: openAIData.organizationID,
  });

  const openai = new OpenAIApi(configuration);

  let userTemplate = `Summarize the following description for a jira issue. Type of issue: ${issueType}. The summary should be concise and self-explanatory. Here is the description: ${description}`;

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userTemplate }],
    temperature: 0.5,
    // max_tokens: 4096,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openAIData.openaiKey}`,
  };

  try {
    const response = await openai.axios.post(openai.basePath + url, data, { headers: headers });
    return response.data.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
});

resolver.define("getText", async (req) => {
  console.log(req);

  return "Hello world";
});

export const handler = resolver.getDefinitions();
