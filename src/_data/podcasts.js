const EleventyFetch = require("@11ty/eleventy-fetch");

// Add favorite podcasts here — just the Apple Podcasts show URL.
// Title, artwork, and description are pulled from the page at build time.
const rawPodcasts = [
  { url: "https://podcasts.apple.com/us/podcast/accidental-tech-podcast/id617416468" },
  { url: "https://podcasts.apple.com/us/podcast/pivot/id1073226719" },
  { url: "https://podcasts.apple.com/us/podcast/hard-fork/id1528594034" },
  { url: "https://podcasts.apple.com/us/podcast/decoder-with-nilay-patel/id1011668648" },
  { url: "https://podcasts.apple.com/us/podcast/rework/id1264193508" },
];

function getMetaTag(html, property) {
  const match =
    html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")) ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"));
  return match ? match[1] : null;
}

async function getPodcastInfo(url) {
  try {
    const html = await EleventyFetch(url, {
      duration: "1d",
      type: "text",
    });
    return {
      url,
      title: getMetaTag(html, "og:title"),
      image: getMetaTag(html, "og:image"),
      description: getMetaTag(html, "og:description"),
    };
  } catch (err) {
    console.warn(`[podcasts] Failed to fetch podcast info for ${url}:`, err.message);
    return { url, title: null, image: null, description: null };
  }
}

module.exports = async function () {
  return Promise.all(rawPodcasts.map((podcast) => getPodcastInfo(podcast.url)));
};