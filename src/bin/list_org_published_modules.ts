#!/usr/bin/env node

import { createOctokit, listGitHubOrganizationPublishedModulesFactory } from "../lib";
import type { RepoModules } from "../lib";
import fetch from "node-fetch";

const githubOrganizationName = process.argv[2];
const isVerbose = process.argv[3] === "--verbose";

const { listGitHubOrganizationPublishedModules } = listGitHubOrganizationPublishedModulesFactory({
    ...createOctokit(),
    fetch,
});

const { evtRepoModules } = listGitHubOrganizationPublishedModules({ githubOrganizationName });

const result: RepoModules[] = [];

evtRepoModules
    .pipe((data, registerSideEffect) =>
        data === "DONE"
            ? (registerSideEffect(() => console.log(JSON.stringify(result, null, 2))), null)
            : [data],
    )
    .pipe(
        (data, registerSideEffect) => (isVerbose && registerSideEffect(() => console.log(data)), [data]),
    )
    .pipe(({ modules }) => modules.length !== 0)
    .attach(repoModules => result.push(repoModules));
