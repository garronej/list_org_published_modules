

import { createThemeProvider, defaultGetTypographyDesc } from "onyxia-ui/lib";
import { createIcon } from "onyxia-ui/Icon";
import { createIconButton } from "onyxia-ui/IconButton";
import { createButton } from "onyxia-ui/Button";
import { createText } from "onyxia-ui/Text";
import type { Param0 } from "tsafe";
import { createMakeStyles } from "tss-react";
import { createPageHeader } from "onyxia-ui/PageHeader";

//Import icons from https://material-ui.com/components/material-icons/ that you plan to use
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import PageViewIcon from '@material-ui/icons/Pageview';

export const { ThemeProvider, useTheme } = createThemeProvider({
	"getTypographyDesc": ({
		windowInnerWidth,
		//When users go to it's browser setting he can select the font size "small", "medium", "default"
		//You can choose to take that into account for example by doing "rootFontSizePx": 10 * browserFontSizeFactor (default)
		browserFontSizeFactor,
		windowInnerHeight
	}) => ({
		...defaultGetTypographyDesc({
			windowInnerWidth,
			browserFontSizeFactor,
			windowInnerHeight
		}),
		"fontFamily": '"Work Sans", sans-serif',
	}), 
});

export const { Icon } = createIcon({
	"sentimentSatisfied": SentimentSatisfiedIcon,
	"pageView": PageViewIcon
});

export type IconId = Param0<typeof Icon>["iconId"];

export const { IconButton } = createIconButton({ Icon });
export const { Button } = createButton({ Icon });
export const { Text } = createText({ useTheme });
export const { PageHeader } = createPageHeader({ Icon });

export const { makeStyles } = createMakeStyles({ useTheme });