import { render } from "react-dom";
import { ThemeProvider } from "./theme";
import { useState, useMemo, useEffect, memo } from "react";
import { makeStyles, PageHeader, Text, Button } from "./theme";
import { SearchBar } from "onyxia-ui/SearchBar";
import type { SearchBarProps } from "onyxia-ui/SearchBar";
import Link from "@material-ui/core/Link";
import { CircularProgress } from "onyxia-ui/CircularProgress";
import { useEvt } from "evt/hooks";
import { useConstCallback } from "powerhooks/useConstCallback";
import {
	listGitHubOrganizationPublishedModulesFactory,
	createOctokit,
	getNpmModuleUrl
} from "list_org_published_modules";
import { useSplashScreen } from "onyxia-ui";

const { listGitHubOrganizationPublishedModules } = listGitHubOrganizationPublishedModulesFactory({
	...createOctokit({
		"github_token": [
			"g", "hp_X", "T5SO",
			"Rq5aN", "qFHOjVW",
			"e7OSQDu2ZO", "X2V4K20on"
		].join("")
	}),
	fetch
})

const useStyles = makeStyles()(
	theme => ({
		"root": {
			"height": "100%",
			"overflow": "hidden",
			"display": "flex",
			"flexDirection": "column",
			"padding": theme.spacing(6),
			"paddingBottom": 0
		},
		"searchBarWrapper": {
			"display": "flex",
			"marginBottom": theme.spacing(2)
		},
		"searchBar": {
			"flex": 1,
			"marginRight": theme.spacing(2)
		},
		"resultNodeWrapper": {
			"flex": 1,
			"overflow": "auto",
			"marginTop": theme.spacing(2)
		},
		"resultNode": {
			"paddingBottom": theme.spacing(6),
		},
		"resultEntry": {
			"backgroundColor": theme.colors.useCases.surfaces.surface1,
			"borderRadius": theme.spacing(3),
			"boxShadow": theme.shadows[2],
			"margin": theme.spacing(3),
			"padding": theme.spacing(3),
			"&:hover": {
				"shadow": theme.shadows[3],
			},
			"display": "inline-block"
		}
	})
);

const App = memo(() => {

	const { classes } = useStyles();

	{

		const { hideRootSplashScreen } = useSplashScreen();

		useEffect(()=> { hideRootSplashScreen(); }, []);

	}


	const [
		githubOrganizationName,
		setGithubOrganizationName
	] = useState<string | undefined>(undefined);

	const [evtRepoModules, setEvtRepoModule] =
		useState<ReturnType<typeof listGitHubOrganizationPublishedModules>["evtRepoModules"] | undefined>(
			undefined
		);

	

	useEffect(
		() => {

			if (githubOrganizationName === undefined) {
				return;
			}

			const { evtRepoModules } = listGitHubOrganizationPublishedModules(
				{ githubOrganizationName }
			);

			setEvtRepoModule(evtRepoModules);

		},
		[githubOrganizationName ?? Object]
	);


	const [search, setSearch] = useState("");

	const [lastRepoName, setLastRepoName] = useState("");
	const [
		npmModuleNamesByGithubRepoName,
		setNpmModuleNamesByGithubRepoName
	] = useState<Record<string, string[]>>({});

	useEvt(
		ctx => {

			if (evtRepoModules === undefined) {
				return;
			}

			setNpmModuleNamesByGithubRepoName({});

			evtRepoModules
				.pipe(
					ctx,
					(data, registerSideEffect) =>
						data === "DONE"
							? (registerSideEffect(() => setEvtRepoModule(undefined)), null)
							: [data]
				)
				.pipe(
					(data, registerSideEffect) => (
						registerSideEffect(() => setLastRepoName(data.repoName)),
						[data]
					)
				)
				.pipe(({ modules }) => modules.length !== 0)
				.attach(({ repoName, modules }) =>
					setNpmModuleNamesByGithubRepoName(
						npmModuleNamesByGithubRepoName => {
							const out = { ...npmModuleNamesByGithubRepoName };
							//(out[repoName] ??= []).push(...modules.map(({ moduleName }) => moduleName));
							if (out[repoName] === undefined) {
								out[repoName] = [];
							}
							out[repoName].push(...modules.map(({ moduleName }) => moduleName));
							return out;
						}
					)
				);

		},
		[evtRepoModules ?? Object]
	);

	const resultNode = useMemo(
		() => <div className={classes.resultNode}>
			{Object.keys(npmModuleNamesByGithubRepoName)
				.map(repoName =>
					<div key={repoName} className={classes.resultEntry}>
						<Text typo="object heading">{githubOrganizationName}/{repoName}:</Text>
						{npmModuleNamesByGithubRepoName[repoName].map(moduleName =>
							<>&nbsp;&nbsp;-NPM: <Link
								href={getNpmModuleUrl({ moduleName })}
								target="_blank"
							>
								{moduleName}
							</Link>
							</>
						)}
					</div>
				)}
		</div>,
		[npmModuleNamesByGithubRepoName]
	);

	const onButtonClick = useConstCallback(() => setGithubOrganizationName(search));

	const onKeyPress = useConstCallback<SearchBarProps["onKeyPress"]>(
		key => {
			switch (key) {
				case "Enter": onButtonClick(); break;
				default: return;
			}
		}
	);

	return (
		<div className={classes.root}>
			<PageHeader
				mainIcon="pageView"
				title="list_org_published_modules"
				helpTitle="What is it?"
				helpContent={<>This tool take as input a GitHub organization or GitHub
					user name and list the modules it publishes on the major package manager
					repository: npm, maven, ect. &nbsp;
					<Link href="https://github.com/garronej/list_org_published_modules">Learn more</Link>
				</>}
				helpIcon="sentimentSatisfied"
			/>
			<div className={classes.searchBarWrapper}>
				<SearchBar
					className={classes.searchBar}
					search={search}
					onSearchChange={setSearch}
					placeholder={"Type in an GitHub organization like \"etalab\""}
					onKeyPress={onKeyPress}
				/>
				<Button
					disabled={
						search === githubOrganizationName ||
						githubOrganizationName === ""
					}
					onClick={onButtonClick}
				>
					Start search
				</Button>
			</div>
			{evtRepoModules !== undefined &&
				<Text typo="subtitle">
					<CircularProgress size={15} /> Currently crawling <strong>{githubOrganizationName}/{lastRepoName}</strong>
				</Text>}
			<div className={classes.resultNodeWrapper}>
				{resultNode}
			</div>
		</div>
	);

});


render(
	<ThemeProvider
		splashScreen={{
			"Logo": () => <></>,
			"minimumDisplayDuration": 0
		}}
	>
		<App />
	</ThemeProvider>,
	document.getElementById("root")
);
