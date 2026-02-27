module.exports = function (eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");

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

  eleventyConfig.addCollection("designSeeds", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/design-seeds/*.md")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
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

  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

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
