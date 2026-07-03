const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {

  // --- Pass through static assets ---
  eleventyConfig.addPassthroughCopy("src/assets");

  // --- Sveltia CMS admin panel (static, served at /admin/) ---
  eleventyConfig.addPassthroughCopy("src/admin");

  // --- Custom domain file for GitHub Pages (copies ./CNAME -> _site/CNAME) ---
  eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });

  // --- Date filters ---
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).setLocale("he").toFormat("d בLLLL yyyy");
  });

  // --- Slugify (supports Hebrew by keeping unicode word chars) ---
  eleventyConfig.addFilter("slugify", (str) => {
    return String(str).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]+/gu, "").replace(/^-|-$/g, "");
  });

  // --- Limit filter ---
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  // --- Root path filter (makes file:// preview work at any depth) ---
  eleventyConfig.addFilter("rootPath", (pageUrl) => {
    const depth = (pageUrl || "/").replace(/^\/|\/$/g, "").split("/").filter(Boolean).length;
    return depth === 0 ? "." : Array(depth).fill("..").join("/");
  });

  // --- Markdown config ---
  let markdownIt = require("markdown-it");
  let md = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
