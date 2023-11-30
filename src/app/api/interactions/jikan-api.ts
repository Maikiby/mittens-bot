/*
APIs: https://api.jikan.moe/v4/anime?q=${query}&sfw&limit=1 (search for anime, safe for work only)
*/
import ky from "ky"

/**
 * Fetches an anime based on user query and returns it as a Discord embed.
 */
export const getAnimeByName = async (query: string) => {
  
    const { data } = await ky.get(`https://api.jikan.moe/v4/anime?q=${query}&sfw&limit=1`).json<{ data: any }>()
    
    if (data.length === 0) {
        return {
            title: "Invalid Query",
            description: "I couldn't find that anime, please try again! (┬┬﹏┬┬)",
            image: { url: "https://i.imgur.com/7TL0t99.png" },
        }
    }

    return {
        title: data[0].titles[0].title,
        description: data[0].synopsis,
        image: { url: data[0].images.jpg.image_url },
        url: data[0].url,
    }

}