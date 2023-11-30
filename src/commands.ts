/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#registering-a-command
 */

import { ApplicationCommandType } from "discord-api-types/v10"

export const PING_COMMAND = {
  name: "ping",
  description: "Ping pong! I'll respond with pong.",
} as const

export const INVITE_COMMAND = {
  name: "invite",
  description: "Get an invite link to add this bot to your server",
} as const

export type RandomPicType = "cat" | "dog" | "picsum"
export const RANDOM_PIC_COMMAND = {
  name: "randompic",
  description: "Get a random picture",
  options: [
    {
      name: "type",
      description: "What type of picture would you like?",
      type: ApplicationCommandType.Message,
      required: true,
      choices: [
        { name: "cat", value: "cat" },
        { name: "dog", value: "dog" },
        { name: "generic", value: "picsum" },
      ],
    },
  ],
} as const

export const ANIME_SEARCH_COMMAND = {
  name: "anime",
  description: "Search for an anime",
  options: [
    {
      name: "search",
      description: "What anime are you looking for?",
      type: ApplicationCommandType.Message,
      required: true,
    },
  ],
} as const 

export const ROLE_COMMAND = {
  name: "role",
  description: "Add or remove a role from yourself.",
} as const

export const commands = {
  ping: PING_COMMAND,
  invite: INVITE_COMMAND,
  randompic: RANDOM_PIC_COMMAND,
  anime: ANIME_SEARCH_COMMAND,
  role: ROLE_COMMAND,
} as const
