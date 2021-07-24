/* eslint-disable @typescript-eslint/no-namespace */
import { getRepositoriesAsyncIterableFactory } from "./tools/getRepositoriesAsyncIterable";
import urlJoin from "url-join";
import { Evt } from "evt";
import type { NonPostableEvt } from "evt";
import { Octokit } from "@octokit/rest";
import type nodeFetch from "node-fetch";

export function getNpmModuleUrl(params: { moduleName: string }) {
    const { moduleName } = params;
    return `https://www.npmjs.com/package/${moduleName}`;
}

export type Modules = Modules.Npm;

export namespace Modules {
    export type Npm = {
        type: "npm";
        moduleName: string;
        packageJsonDirPath: string;
    };
}

export type RepoModules = {
    repoName: string;
    modules: Modules[];
};

export function listGitHubOrganizationPublishedModulesFactory(params: {
    octokit: Octokit;
    fetch: typeof nodeFetch;
}) {
    const { octokit, fetch } = params;

    function listGitHubOrganizationPublishedModules(params: { githubOrganizationName: string }): {
        evtRepoModules: NonPostableEvt<RepoModules | "DONE">;
    } {
        const { githubOrganizationName } = params;

        const { getRepositoriesAsyncIterable } = getRepositoriesAsyncIterableFactory({ octokit });

        const { repositoryAsyncIterable } = getRepositoriesAsyncIterable({
            "org": githubOrganizationName,
        });

        const evtRepoModules = Evt.create<RepoModules | "DONE">();

        (async () => {
            for await (const repository of repositoryAsyncIterable) {
                const moduleName = await (async () => {
                    const resText = await fetch(
                        urlJoin(
                            "https://raw.github.com",
                            repository.full_name,
                            repository.default_branch ?? "main",
                            "package.json",
                        ),
                    ).then(res => (res.status !== 404 ? res.text() : undefined));

                    if (resText === undefined) {
                        return undefined;
                    }

                    return JSON.parse(resText)["name"];
                })();

                if (moduleName === undefined) {
                    evtRepoModules.post({
                        "repoName": repository.name,
                        "modules": [],
                    });

                    continue;
                }

                if (await fetch(getNpmModuleUrl({ moduleName })).then(res => res.status === 404)) {
                    continue;
                }

                evtRepoModules.post({
                    "repoName": repository.name,
                    "modules": [
                        {
                            "type": "npm",
                            moduleName,
                            "packageJsonDirPath": "/",
                        },
                    ],
                });
            }

            evtRepoModules.post("DONE");
        })();

        return { evtRepoModules };
    }

    return { listGitHubOrganizationPublishedModules };
}
