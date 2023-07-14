import { dedent } from "ts-dedent"
import type { TransformConfig } from "../vite-plugin/config.js"
import { InlangSdkException } from "../vite-plugin/exceptions.js"
import type { FileInformation } from "../vite-plugin/fileInformation.js"
import { transformLayoutJs } from "./+layout.js.js"
import { transformLayoutServerJs } from "./+layout.server.js.js"
import { transformLayoutSvelte } from "./+layout.svelte.js"
import { transformPageJs } from "./+page.js.js"
import { transformPageServerJs } from "./+page.server.js.js"
import { transformPageSvelte } from "./+page.svelte.js"
import { transformServerRequestJs } from "./+server.js.js"
import { transformLanguageJson } from "./[language].json.js"
import { transformJs } from "./_.js.js"
import { transformServerJs } from "./_.server.js.js"
import { transformSvelte } from "./_.svelte.js"
import { transformHooksServerJs } from "./hooks.server.js.js"

export const transformCode = (
	filePath: string,
	config: TransformConfig,
	code: string,
	{ type, root }: FileInformation,
) => {
	if (!pluginOrderVerified && type.endsWith(".svelte")) assertCorrectPluginOrder(code)

	switch (type) {
		case "hooks.server.js":
			return transformHooksServerJs(filePath, config, code)
		case "[language].json":
			return transformLanguageJson(filePath, config, code)
		case "+server.js":
			return transformServerRequestJs(filePath, config, code, root)
		case "+layout.server.js":
			return transformLayoutServerJs(filePath, config, code, root)
		case "+layout.js":
			return transformLayoutJs(filePath, config, code, root)
		case "+layout.svelte":
			return transformLayoutSvelte(filePath, config, code, root)
		case "+page.server.js":
			return transformPageServerJs(filePath, config, code, root)
		case "+page.js":
			return transformPageJs(filePath, config, code, root)
		case "+page.svelte":
			return transformPageSvelte(filePath, config, code, root)
		case "*.server.js":
			return transformServerJs(filePath, config, code)
		case "*.js":
			return transformJs(filePath, config, code)
		case "*.svelte":
			return transformSvelte(filePath, config, code)
	}
}

// ------------------------------------------------------------------------------------------------

let pluginOrderVerified = false

const REGEX_SVELTE_COMPILER_INFO = /^\/\*\s.*\.svelte generated by Svelte v\d+.\d+.\d+\s\*\/$/

const assertCorrectPluginOrder = (code: string) => {
	if (code.split("\n")[0]?.match(REGEX_SVELTE_COMPILER_INFO)) {
		throw new InlangSdkException(dedent`
			Make sure to place the inlang plugin before the svelte plugin in your vite config.
			See https://inlang.com/documentation/sdk/sveltekit#getting-started.
		`)
	}

	pluginOrderVerified = true
}