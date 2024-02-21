import { createLink } from "./Link.base"
import { getLanguage } from "./getLanguage.server"

export const Link = createLink(getLanguage)
