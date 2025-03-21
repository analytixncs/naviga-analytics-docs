const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Naviga Informer Analytics",
    markdown: { format: "detect" },
    tagline: "",
    url: "https://naviga-informer-docs.netlify.app",
    baseUrl: "/",
    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.png",
    organizationName: "Naviga Inc", // Usually your GitHub org/user name.
    projectName: "naviga-analytics-docs", // Usually your repo name.
    stylesheets: [
      {
        href: "https://unpkg.com/@antonz/codapi@0.19.10/dist/snippet.css",
      },
    ],

    scripts: [
      {
        src: "https://unpkg.com/@antonz/codapi@0.19.10/dist/snippet.js",
        defer: true,
      },
    ],
    plugins: [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      async function myPlugin(context, options) {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            // Appends TailwindCSS and AutoPrefixer.
            postcssOptions.plugins.push(require("tailwindcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      },
    ],
    themes: ["@docusaurus/theme-live-codeblock"],
    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            // routeBasePath: "informer",
            // Please change this to your repo.
            // editUrl:
            //   "https://github.com/facebook/docusaurus/edit/main/website/",
          },
          blog: {
            showReadingTime: true,
            // Please change this to your repo.
            // editUrl:
            //   "https://github.com/facebook/docusaurus/edit/main/website/blog/",
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        liveCodeBlock: {
          /**
           * The position of the live playground, above or under the editor
           * Possible values: "top" | "bottom"
           */
          playgroundPosition: "bottom",
        },
        navbar: {
          title: "Naviga Analytics",
          logo: {
            alt: "Naviga",
            src: "img/favicon.png",
          },
          items: [
            {
              type: "doc",
              docId: "informer/informer-basics",
              position: "left",
              label: "Informer",
            },
            // { to: "/blog", label: "Blog", position: "left" },
            // {
            //   href: "https://github.com/facebook/docusaurus",
            //   label: "GitHub",
            //   position: "right",
            // },
          ],
        },
        // algolia: {
        //   apiKey: 'YOUR_API_KEY',
        //   indexName: 'YOUR_INDEX_NAME',

        //   // Optional: see doc section below
        //   contextualSearch: true,

        //   // Optional: see doc section below
        //   appId: 'YOUR_APP_ID',

        //   // Optional: Algolia search parameters
        //   searchParameters: {},

        //   //... other Algolia params
        // },
        footer: {
          style: "dark",
          links: [
            {
              title: "Naviga",
              items: [
                {
                  label: "Naviga Website",
                  href: "https://www.navigaglobal.com",
                },
                {
                  label: "Naviga Blog",
                  href: "http://navigaglobal.com/blog/",
                },
                {
                  label: "Twitter",
                  href: "https://twitter.com/navigaglobal",
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/navigaglobal",
                },
              ],
            },
            {
              title: "More",
              items: [
                {
                  label: "Old Doc Site",
                  to: "https://analytix-docs.netlify.app/",
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Naviga Inc`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),
  }
);
