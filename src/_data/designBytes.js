const Parser = require("rss-parser");

module.exports = async function () {
  const parser = new Parser({
    customFields: {
      item: [
        ["content:encoded", "contentEncoded"],
        ["media:content", "mediaContent"],
      ],
    },
  });

  try {
    const feed = await parser.parseURL("https://design-bytes.com/feed/");
    return feed.items.slice(0, 4).map((item) => ({
      title: item.title,
      url: item.link,
      date: item.pubDate ? new Date(item.pubDate) : null,
      summary: item.contentSnippet
        ? item.contentSnippet.split(".").slice(0, 2).join(".").trim() + "."
        : null,
      image: item.mediaContent?.["$"]?.url ?? null,
    }));
  } catch (err) {
    console.warn("[designBytes] Failed to fetch RSS feed:", err.message);
    return [];
  }
};
