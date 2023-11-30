import { commands, RandomPicType } from "@/commands"
import { verifyInteractionRequest } from "@/discord/verify-incoming-request"
import {
  APIInteractionDataOptionBase,
  ApplicationCommandOptionType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10"
import {
  ButtonStyleTypes,
  MessageComponentTypes,
} from 'discord-interactions';
import { NextResponse } from "next/server"
import { getRandomPic } from "./random-pic"
import { getAnimeByName } from "./jikan-api"

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
export const runtime = "edge"

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
      
      case commands.role.name:
        
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { 
            content: "Click the button below to get a role!",
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `role_red_${interaction.message?.id}`,
                    label: "🟥 Red",
                    style: ButtonStyleTypes.PRIMARY,
                  },
                  {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `role_green_${interaction.message?.id}`,
                    label: "🟩 Green",
                    style: ButtonStyleTypes.PRIMARY,
                  },
                  {
                    type: MessageComponentTypes.BUTTON,
                    custom_id: `role_blue_${interaction.message?.id}`,
                    label: "🟦 Blue",
                    style: ButtonStyleTypes.PRIMARY,
                  },
                ]
              }
            ]
          },
        })

      default:
      // Pass through, return error at end of function
    }
  } 

  if (interaction.type === InteractionType.MessageComponent) {

    console.log('Button has been clicked!: ' + interaction.data.custom_id)

    const [command, color, messageId] = interaction.data.custom_id.split('_');
    
    if (!interaction.data.custom_id || !interaction.user || !interaction.member || interaction.user) {
      return new NextResponse("Invalid request", { status: 400 })
    }

    const role = interaction.guild_id ? interaction.guild_id : interaction.user.id;
    const member = interaction.guild_id ? interaction.member : interaction.user;
    const roleColor = color === "red" ? "1178434821958148117" : color === "green" ? "1178434940950552606" : color === "blue" ? "1178434998169260123" : null;
    
    
    switch (command) {
      case "role":
        if (!roleColor) {
          return new NextResponse("Invalid request", { status: 400 })
        }
        if (member.roles.includes(roleColor)) {
          member.roles.forEach(role => {
            if (role === roleColor) {
              role = '';
            }
          })
          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: { 
              content: `Removed role ${color} from <@${member.user.id}>`,
              flags: MessageFlags.Ephemeral,
            },
          })
        } else {
          await member.roles.push(roleColor);
          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: { 
              content: `Added role ${color} to <@${member.user.id}>`,
              flags: MessageFlags.Ephemeral,
            },
          })
        }
    }

  } 

  return new NextResponse("Unknown command", { status: 400 })
}
