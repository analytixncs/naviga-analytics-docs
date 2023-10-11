import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <img
          src="/img/Naviga_Logo_Dark_Horizontal_Tagline.png"
          style={{ width: "60%", marginBottom: "15px" }}
        />

        {/* <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p> */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={styles.buttons} style={{ marginRight: "20px" }}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/informer/informer-basics"
            >
              Informer Documentation
            </Link>
          </div>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/circ/circ-implementation"
            >
              Circ Documentation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="Naviga Ad Informer Documentation">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
