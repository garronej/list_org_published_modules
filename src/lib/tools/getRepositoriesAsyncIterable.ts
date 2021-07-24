import { Octokit } from "@octokit/rest";
import type { ReturnType } from "tsafe";

export type Repositories = ReturnType<Octokit["repos"]["listForOrg"]>["data"][number];

const per_page = 30;

export function getRepositoriesAsyncIterableFactory(params: { octokit: Octokit }) {
    const { octokit } = params;

    function getRepositoriesAsyncIterable(params: { org: string }) {
        const { org } = params;

        let repositories: Repositories[] = [];

        let page = 0;

        let isLastPage: boolean | undefined = undefined;

        const getOctokitResponseData = (params: { page: number }) =>
            octokit.repos
                .listForOrg({
                    org,
                    per_page,
                    "page": params.page,
                })
                .then(({ data }) => data);
        const repositoryAsyncIterable: AsyncIterable<Repositories> = {
            [Symbol.asyncIterator]() {
                return {
                    "next": async () => {
                        if (repositories.length === 0) {
                            if (isLastPage) {
                                return { "done": true, "value": undefined };
                            }

                            page++;

                            repositories = await getOctokitResponseData({ page });

                            if (repositories.length === 0) {
                                return { "done": true, "value": undefined };
                            }

                            isLastPage =
                                repositories.length !== per_page ||
                                (await getOctokitResponseData({ "page": page + 1 })).length === 0;
                        }

                        const [repository, ...rest] = repositories;

                        repositories = rest;

                        return {
                            "value": repository,
                            "done": false,
                        };
                    },
                };
            },
        };

        return { repositoryAsyncIterable };
    }

    return { getRepositoriesAsyncIterable };
}
