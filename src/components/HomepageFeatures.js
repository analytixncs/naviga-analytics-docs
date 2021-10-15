import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Informer Basics",
    description: (
      <>Basics information on how to use Informer with the Naviga software.</>
    ),
    link: "/docs/informer/informer-basics",
  },
  {
    title: "JavaScript in Informer",
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
    link: "/docs/informer/informer-javascript",
  },
  {
    title: "Informer Videos",
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
    link: "/docs/informer/informer-video-training",
  },
];

function Feature({
  title,
  description,
  link = "/docs/informer/informer-basics",
}) {
  return (
    <a href={link} className={styles.featurebutton}>
      <div className="text--center padding-horiz--md padding-vert--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </a>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div style={{ width: "80%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
