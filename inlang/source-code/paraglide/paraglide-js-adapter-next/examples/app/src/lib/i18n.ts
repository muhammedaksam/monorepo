import { AvailableLanguageTag } from "@/paraglide/runtime"
import { createI18n } from "@inlang/paraglide-js-adapter-next"
import * as m from "@/paraglide/messages"

export const { Link, middleware, useRouter, usePathname, redirect, permanentRedirect, localizePath } =
	createI18n<AvailableLanguageTag>({
		pathnames: {
			"/about": m.about_path,
			"/admin/[...rest]": {
				en: "/admin/[...rest]",
				de: "/administrator/[...rest]",
				"de-CH": "/administrator/[...rest]",
			},
		},
		prefix: "all",
		exclude: ["/not-translated"], //makes sure that the /not-translated page is not translated
	})
