import { GlobalCommands } from "./global-commands"

const imgSrc = "https://i.imgur.com/dqtDT6G_d.webp?maxwidth=760&fidelity=grand";

const githubUrl = "https://github.com/Maikiby/mittens-bot";
const discordInviteUrl = "https://discord.com/api/oauth2/authorize?client_id=1164992825801318462&permissions=2147485696&scope=bot%20applications.commands";

export default async function Page() {
  return (
    <main className="container mx-auto px-3 py-6">
      <section className="grid grid-cols-1 gap-2">
        
        { imgSrc && (
          <img 
          
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
          <a
            className="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-fit items-center justify-center rounded-md bg-[#7289DA] px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            href={discordInviteUrl}
            target="_blank"
            rel="noreferrer"
          >
            Add me!
          </a>
          <a
            className="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-fit items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
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
