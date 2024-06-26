import { commands, RandomPicType } from "@/commands"
import { verifyInteractionRequest } from "@/discord/verify-incoming-request"
import {
  APIInteractionDataOptionBase,
  ApplicationCommandOptionType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10"
import { NextResponse } from "next/server"
import { getRandomPic } from "./random-pic"
import { getAnimeByName } from "./jikan-api"

/**
 * RIP Edge Runtime on Vercel.
 */
export const runtime = "nodejs"

// Your public key can be found on your application in the Developer Portal
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY

/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request) {
  const verifyResult = await verifyInteractionRequest(request, DISCORD_APP_PUBLIC_KEY!)
  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 })
  }
  const { interaction } = verifyResult

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong })
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const { name } = interaction.data

    switch (name) {
      case commands.ping.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: `Pong` },
        })

      case commands.invite.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Click this link to add NextBot to your server: https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}&permissions=2147485696&scope=bot%20applications.commands`,
            flags: MessageFlags.Ephemeral,
          },
        })

      case commands.randompic.name:
        const { options } = interaction.data
        if (!options) {
          return new NextResponse("Invalid request", { status: 400 })
        }

        const { value } = options[0] as APIInteractionDataOptionBase<ApplicationCommandOptionType.String, RandomPicType>
        const embed = await getRandomPic(value)
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { embeds: [embed] },
        })
      
      case commands.anime.name:
        const { options: animeOptions } = interaction.data
        if (!animeOptions) {
          return new NextResponse("Invalid request", { status: 400 })
        }

        const { value: animeValue } = animeOptions[0] as APIInteractionDataOptionBase<ApplicationCommandOptionType.String, string>
        const animeEmbed = await getAnimeByName(animeValue)
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { embeds: [animeEmbed] },
        })

      default:
      // Pass through, return error at end of function
    }
  }

  return new NextResponse("Unknown command", { status: 400 })
}
