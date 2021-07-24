import { createOctokit } from "../lib/tools/createOctokit";
import { listGitHubOrganizationPublishedModulesFactory } from "../lib/listGitHubOrganizationPublishedModules";
import fetch from "node-fetch";

const { listGitHubOrganizationPublishedModules } = listGitHubOrganizationPublishedModulesFactory({
    ...createOctokit(),
    fetch,
});

const githubOrganizationName = "etalab";

const { evtRepoModules } = listGitHubOrganizationPublishedModules({ githubOrganizationName });

evtRepoModules.attach(console.log);
