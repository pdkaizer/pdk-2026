const EleventyFetch = require("@11ty/eleventy-fetch");

// Add new links here — title, url, and a short note on why it's worth reading.
const rawLinks = [
  { title: "Use AI to Need Less AI", url: "https://southleft.substack.com/p/use-ai-to-need-less-ai", note: "A fasinating look a one way to emrace AI.", date: "2026-07-29" },
  { title: "The Unreasonable Effectiveness of HTML for Agent Output", url: "https://ylanglabs.com/blogs/the-unreasonable-effectiveness-of-html-for-agent-output", note: "An interesting piece that asks: The useful question is: when should the output be source, and when should it be a surface?", date: "2026-06-29" },
  { title: "Substack writers, you need a website!", url: "https://elizabethtai.com/2026/06/10/substack-writers-you-need-a-website/", note: "This toally resonats with me, and I would add if you are using Substack consider moving to Ghost.", date: "2026-07-30" },
  { title: "AI Proposes. The Design System Disposes", url: "https://southleft.substack.com/p/ai-proposes-the-design-system-disposes", note: "The flashy demo is downstream of something unglamorous. Here's the token architecture underneath it.", date: "2026-07-23" },
  { title: "A good approach to organize Figma Libraries for Design Systems and AI workflows", url: "https://www.designsystemscollective.com/a-good-approach-to-organize-figma-libraries-for-design-systems-and-ai-workflows-859f2a2e469a", note: "Not sure I agree with this approach, but the case is well thought out.", date: "2026-06-12" },
];

async function getOgImage(url) {
  try {
    const html = await EleventyFetch(url, {
      duration: "1d",
      type: "text",
    });
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match ? match[1] : null;
  } catch (err) {
    console.warn(`[links] Failed to fetch OG image for ${url}:`, err.message);
    return null;
  }
}

module.exports = async function () {
  const links = await Promise.all(
    rawLinks.map(async (link) => ({
      ...link,
      image: await getOgImage(link.url),
    }))
  );
  return links.sort((a, b) => new Date(b.date) - new Date(a.date));
};
