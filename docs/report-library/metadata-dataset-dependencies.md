---
id: metadata-dataset-dependencies
title: METADATA-Dataset Dependencies
sidebar_label: METADATA-Dataset Dependencies
---

# METADATA-Dataset Dependencies

**Type:** Informer Metadata

Reveal Datasets and Ad Hoc Queries that are dependent on other Datasets or Datasources.

:::info METADATA-Dataset Dependencies Downloads

Reveal Datasets and Ad Hoc Queries that are dependent on other Datasets or Datasources.

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/metadata-dataset-dependencies.tgz">METADATA-Dataset Dependencies</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/metadata-dataset-dependencies.json">metadata-dataset-dependencies.json</a>

:::

## Summary

This report is dependent upon the [METADATA-Reports-Dataset Ids Names](METADATA-Reports-Dataset-Ids-Names)

## Description
Reads the Informer PostgreSQL database for information to reveal Datasets and Ad Hoc Queries that are dependent on other Datasets or Datasources.  These dependencies are in the Flow steps of the source Dataset or Ad Hoc Report.  
ONLY Datasets and Ad Hoc Reports that have dependencies will show up in this report.
This report is itself dependent upon the "METADATA-Reports-Dataset Ids Names".

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Num Of Dependent Datasources | numOfDependentDatasources | double |  | Number of dependent Datasources that the source query is dependent upon. |
| Num Of Dependent Datasets | numOfDependentDatasets | double |  | Number of dependent Datasets that the source query is dependent upon. |
| Type | type | keyword_text |  | Dataset or Ad Hoc Report |
| Name | name | keyword_text |  | The Dataset Name that the source query is dependent upon.  Each source query can have more than one dependency.  This is the information pulled from the "METADATA-Reports-Dataset Ids Names" joined dataset. |
| Id | id | keyword_text |  | Source Dataset or Ad Hoc Query UUID. |
| Link To Report | LinkToReport | keyword_text |  | Clickable link to the source Dataset or Ad Hoc  Report. |
| Dependent Dataset Id | joinedDatasetIds | keyword_text |  | The Dataset UUID that the source query is dependent upon.  Each source query can have more than one dependency. |
| Dependent Dataset Name | dependentDatasetName | keyword_text |  | The Dataset Name that the source query is dependent upon.  Each source query can have more than one dependency.  This is the information pulled from the "METADATA-Reports-Dataset Ids Names" joined dataset. |
| Dependent Dataset Link | dependentDatasetLink | keyword_text |  | Clickable link to the dependent Dataset. |
| Dependent Datasource Names | dependentDatasourceNames | keyword_text |  | Dependent Datasource Name |
| Flow | flow | object |  | Array of Flow steps.  Each flow step in the array is stored as an Object. |
