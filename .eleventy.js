try {
  process.loadEnvFile();
} catch {
  // .env is optional — env vars may already be set (e.g. Netlify build env)
}

module.exports = function (eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  // Agent skills: copied byte-for-byte (not processed as templates) so the
  // sha256 digests in /.well-known/agent-skills/index.json stay accurate.
  eleventyConfig.addPassthroughCopy({ "src/agent-skills": ".well-known/agent-skills" });
  eleventyConfig.ignores.add("src/agent-skills/**");
  eleventyConfig.addFilter("sha256File", (file) =>
    require("node:crypto")
      .createHash("sha256")
      .update(require("node:fs").readFileSync(file))
      .digest("hex")
  );

  // Collections
  eleventyConfig.addCollection("caseStudies", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/case-studies/*.md")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  eleventyConfig.addCollection("writing", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/writing/*.md")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("photoGalleries", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/photo-galleries/*.md")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("thoughts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/thoughts/*.md")
      .sort((a, b) => b.date - a.date)
  );

  // Filters
  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  eleventyConfig.addFilter("htmlDateString", (date) =>
    new Date(date).toISOString().split("T")[0]
  );

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addFilter("featured", (arr) => arr.filter((item) => item.data.featured));

  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("rssDate", (date) => new Date(date).toUTCString());

  eleventyConfig.addFilter("absoluteUrl", (url, base) => new URL(url, base).href);

  eleventyConfig.addCollection("feedItems", (collectionApi) => {
    const writing = collectionApi.getFilteredByGlob("src/writing/*.md");
    const thoughts = collectionApi.getFilteredByGlob("src/thoughts/*.md");
    return [...writing, ...thoughts].sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
