---
id: index
title: Report Library
sidebar_label: Overview
---

# Report Library

Below is a list of downloadable Informer report and dataset bundles for Naviga Informer.

You should use these as templates in your system.  Install the bundle on your system and then make a copy and modify that copy.  Never modify the template itself.

[More on Bundles](../informer/informer-basics#bundles)

You will notice the each report has a download section with the **Bundle** and a **Definition JSON** file.  The JSON file contains field definitions which can be used with AI agents to help build your reports.  The JSON file is derived from a Powerscript within each template title **"ObjectInspector_FieldMetadata_DoNotModify"**.   You may view this Powerscript when editing a copy of the template report to gain an understanding of each field as well.

## AR and GL

- [Naviga-COA Calculation](./naviga-coa-calculation) — Cash On Account (COA) grouped by Client
- [NAVIGA-Invoices With Payments](./naviga-invoices-with-payments) — Invoice report showing the payments that have been applied
- [NAVIGA-Simple Aging Summary](./naviga-simple-aging-summary) — Simple Summary by Client Id Aging report.

## Campaigns

- [NAVIGA-AD Internet Orders Actual GL Split](./naviga-ad-internet-orders-actual-gl-split) — Returns GL Revenue allocation values by Sub Orders
- [NAVIGA-AD Internet Orders Starter](./naviga-ad-internet-orders-starter) — Basic campaign revenue report with Sales Reps
- [NAVIGA-AD Internet Orders Starter W/ GL Revenue](./naviga-ad-internet-orders-starter-w-gl-revenue) — Report splitting revenue into GL buckets based on GL overrides.

## Clients

- [JOIN-Ad Brand Product Groups](./join-ad-brand-product-groups) — Brand reps by Product group overrides
- [JOIN-Ad Brand Product Reps](./join-ad-brand-product-reps) — Brand Product Override Reps
- [JOIN-Default Brand Rep](./join-default-brand-rep) — Loads all the default brand reps into a dataset so that it can be joined to other datasets.
- [NAVIGA-Client Brand Reps](./naviga-client-brand-reps) — Brand focused client report.
- [NAVIGA-Gen Clients](./naviga-gen-clients) — Basic Client report

## Informer Metadata

- [METADATA-Dataset Dependencies](./metadata-dataset-dependencies) — Reveal Datasets and Ad Hoc Queries that are dependent on other Datasets or Datasources.
- [METADATA-Reports-Dataset Ids Names](./metadata-reports-dataset-ids-names) — Lists all of the Dataset and Ad Hoc Queries in the system
