import Link from "next/link";
import { GlobalCommands } from "./global-commands"
import Image from 'next/image'

const imgSrc = "https://i.imgur.com/dqtDT6G_d.webp?maxwidth=760&fidelity=grand";

const githubUrl = "https://github.com/Maikiby/mittens-bot";
const discordInviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}&permissions=2147485696&scope=bot%20applications.commands`;
const gitHubLogo = "/github.png";
const discordLogo = "/discord.png";

export default async function Page() {
  return (
    <main className="container mx-auto px-3 py-6">
      <section className="grid grid-cols-1 gap-2">
        
        { imgSrc && (
          <Image 
          
            src={imgSrc} 
            alt="Mittens Logo"
            width={100}
            height={100}

          />
        )}

        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Mittens</h1>
        <h2 className="text-xl tracking-tight text-slate-500">
          A simple Discord bot built with Next.js for my Web Development Class :3.
        </h2>
        <div className="flex gap-2">
          <Link 
            href={discordInviteUrl} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-primary"
          >
            <Image
              src={discordLogo} 
              alt="Discord Logo"
              width={20}
              height={20}
            />
            Add me!
          </Link>

          <Link 
            href={githubUrl} 
            target="_blank" 
            rel="noreferrer"
            className="btn"
          >
            <Image 
              src={gitHubLogo} 
              alt="GitHub Logo"
              width={20}
              height={20}
            />
            GitHub
          </Link>

          
        </div>
      </section>

      <section className="flex flex-col gap-2 pt-12">
        <p className="font-semibold">
          This is an example of an admin portal might look like. It leverages RSCs to fetch the Slash commands
          associated with the Discord bot!
        </p>
        <GlobalCommands />
      </section>
    </main>
  )
}
