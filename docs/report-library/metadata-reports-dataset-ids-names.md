---
id: metadata-reports-dataset-ids-names
title: METADATA-Reports-Dataset Ids Names
sidebar_label: METADATA-Reports-Dataset Ids Names
---

# METADATA-Reports-Dataset Ids Names

**Type:** Informer Metadata

Lists all of the Dataset and Ad Hoc Queries in the system

:::info METADATA-Reports-Dataset Ids Names Downloads

Lists all of the Dataset and Ad Hoc Queries in the system

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/metadata-reports-dataset-ids-names.tgz">METADATA-Reports-Dataset Ids Names</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/metadata-reports-dataset-ids-names.json">metadata-reports-dataset-ids-names.json</a>

:::

## Summary

This dataset lists all of your Ad Hoc reports and Datasets in your Informer instance.  It shows the UUI, Name, Owner, create data and last time the report was run or the dataset was refreshed.

It can be useful in seeing what is being use and what is not being used in your system.

## Description
Lists all of the Dataset and Ad Hoc Queries in the system.  Shows a created at and updated at date.  Also shows the last time the Dataset was refreshed or the last time the Ad Hoc Query was run.

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Id | id | keyword_text |  | Dataset or Ad Hoc Query UUID |
| Name | name | keyword_text |  | Dataset or Ad Hoc Query Name |
| Type | type | keyword_text |  | Ad hoc Query<br />or<br />Dataset |
| Owner | principal_id | keyword_text |  | User who is marked as Owner |
| Created At | createdAt | date_tz |  | Date the object was created |
| Definition Updated At | defnUpdatedAt | date_tz |  | Date the query definition was updated last |
| Data Updated At | dataset_dataUpdatedAt | date_tz |  | Last time the Dataset was refreshed or the last time the Ad Hoc Query was run. |
| Datasource Name | datasource_name | keyword_text |  | The Datasource the object is using to get data. |

## Flow

| # | Step | Detail |
|---|------|--------|
| 1 | Script: Field Creation | Determine if the report type: Ad Hoc or Dataset and assign to $record.type field<br />assign the proper Team or User to the $record['principal_id'] |
| 2 | Remove fields | dataset_name, dataset_id, flow, fields, payload, owner_team_name, owner_user_displayName |
| 3 | Merge Duplicates | createdAt, dataset_dataUpdatedAt, datasource_name, defnUpdatedAt, description, linkAlias, name, principal_id, type |
