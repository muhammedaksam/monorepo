import { describe, it, expect } from "vitest"
import { prepareEnvironment } from "@gmrchk/cli-testing-library"
import path from "node:path"
import fs from "node:fs/promises"
import child_process from "node:child_process"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ParaglideLocation = child_process.execSync("which paraglide-next").toString().trim()

/**
 * Timeout to wait between a prompt appearing and the user input
 */
const PROMPT_TO = 800

/**
 * Time to wait between answering the last prompt & checking the output files
 */
const CLEANUP_TO = 5_000

describe.concurrent("paraglide-next", () => {
	it("prints it's version when run with --version", () => {
		const semverRegex = /[0-9]+\.[0-9]+\.[0-9]+/g
		const stdout = child_process.execSync("npx paraglide-next --version").toString()
		expect(semverRegex.test(stdout)).toBe(true)
	})

	describe("init", () => {
		it("app-src-ts", async () => {
			const { readFile, path: workingDir, cleanup, spawn } = await prepareEnvironment()

			const template = path.resolve(__dirname, "../templates/app-src-ts")

			// clone the project into the environment
			await fs.cp(template, workingDir, {
				recursive: true,
			})

			process.env.TERM_PROGRAM = "not-vscode"
			const { wait, waitForText, writeText, debug, pressKey } = await spawn(
				ParaglideLocation,
				"init"
			)

			debug()

			await waitForText("Which languages do you want to support?")
			await wait(PROMPT_TO)
			await writeText("en, de")
			await wait(PROMPT_TO)
			await pressKey("enter")

			console.info("Languages set up")

			await waitForText("Do you want to update your <Link>s for localised routing?")
			await wait(PROMPT_TO)
			await pressKey("enter") //yes, set up i18n routing

			await wait(CLEANUP_TO)

			console.info("Localised Routing set up")

			// read next.config.js
			const nextConfig = await readFile(path.resolve(workingDir, "next.config.mjs"))
			expect(nextConfig).toBeTruthy()
			expect(nextConfig).includes("paraglide(")

			// expect src/lib/i18n.ts to exist
			expect(await readFile(path.resolve(workingDir, "src/lib/i18n.ts"))).toBeTruthy()

			// expect src/middleware.ts to exist
			expect(await readFile(path.resolve(workingDir, "src/middleware.ts"))).toBeTruthy()

			await cleanup()
		}, 300_000)
	})
})
