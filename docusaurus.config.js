const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Naviga Informer Documentation",
    tagline: "",
    url: "https://naviga-informer-docs.netlify.app",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.png",
    organizationName: "Naviga Inc", // Usually your GitHub org/user name.
    projectName: "naviga-analytics-docs", // Usually your repo name.
    plugins: [require.resolve("@cmfcmf/docusaurus-search-local")],
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
