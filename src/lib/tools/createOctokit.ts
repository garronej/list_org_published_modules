import { Octokit } from "@octokit/rest";

export function createOctokit(params?: { github_token?: string }) {
    const octokit = new Octokit({ "auth": params?.github_token ?? process.env["GITHUB_TOKEN"] });
    return { octokit };
}
