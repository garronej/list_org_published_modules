<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/126871360-7461f265-404f-489b-b819-1dabf7d0d459.png">  
</p>
<p align="center">
    <i>Lists all the modules published by a given GitHub organization for a given ecosystem (npm, maven, ect.)</i>
    <br>
    <br>
    <img src="https://github.com/garronej/list_org_published_modules/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/list_org_published_modules">
    <img src="https://img.shields.io/npm/dw/list_org_published_modules">
    <img src="https://img.shields.io/npm/l/list_org_published_modules">
</p>
<p align="center">
  <a href="https://github.com/garronej/list_org_published_modules">Web app</a>
</p>

This tool take as input a GitHub organization or GitHub user name and list the modules
it publishes on the major package manager repository: npm, maven, ect.

Note that it isn't a simple database query or API request, thus it is meant to be run
periodically or triggered by webhooks.

**As of now this module ony works with NPM**

# Run as a CLI tool

Example with [Etalab](https://github.com/Etalab)

```bash
$ npx list_org_published_modules etalab --verbose
```

output (after ~4minutes):

```jsonc
[
    {
        "repoName": "codes-postaux",
        "modules": [
            {
                "type": "npm",
                "moduleName": "codes-postaux",
                "packageJsonDirPath": "/"
            }
        ]
    },
    {
        "repoName": "monuments-historiques",
        "modules": [
            {
                "type": "npm",
                "moduleName": "@sgmap/monuments-historiques",
                "packageJsonDirPath": "/"
            }
        ]
    },
    {
        "repoName": "api-geo",
        "modules": [
            {
                "type": "npm",
                "moduleName": "@etalab/api-geo",
                "packageJsonDirPath": "/"
            }
        ]
    }
    //...Many more entries
]
```

If you run the tools multiple times you will soon reach the GitHub API rate limit.
To fix it, [create a GitHub Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) and provide it as the environnement variable `GITHUB_TOKEN` when you run the build tool.

# Use it in a Node or a Web project.

```bash
npm install list_org_published_modules
```

```typescript
import {
    createOctokit,
    listGitHubOrganizationPublishedModulesFactory,
} from "list_org_published_modules";
//On the browser fetch is defined on window.fetch you don't need to import it.
import fetch from "node-fetch";

const githubOrganizationName = process.argv[2];

const { listGitHubOrganizationPublishedModules } = listGitHubOrganizationPublishedModulesFactory({
    ...createOctokit({ "github_token": undefined }),
    fetch,
});

const { evtRepoModules } = listGitHubOrganizationPublishedModules({ githubOrganizationName });

evtRepoModules.attach(console.log);
```

NOTE: The result are dispatched via an [Evt](https://github.com/garronej/evt)
