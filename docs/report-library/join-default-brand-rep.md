---
id: join-default-brand-rep
title: JOIN-Default Brand Rep
sidebar_label: JOIN-Default Brand Rep
---

# JOIN-Default Brand Rep

**Type:** Clients

Loads all the default brand reps into a dataset so that it can be joined to other datasets.

:::info JOIN-Default Brand Rep Bundle

Loads all the default brand reps into a dataset so that it can be joined to other datasets.

**<a target="_blank" href="/downloads/report-library/join-default-brand-rep.tgz">JOIN-Default Brand Rep</a>**

:::

## Summary

Loads all the default brand reps into a dataset so that it can be joined to other datasets. 

For more information on how Brand Reps work and how to use these datasets see -> [Brand Rep Assignment Docs](../informer/informer-mappings-ad-brands#rep-assignments)

## Notes

This should be set up to reload via a Job every day.

## Description
Only returns the last active Default Reps on a Brand.  Each Brand Key can have up to four default reps.  We return a set of fields that return information about the array of reps that are currently active. 
Default Rep Ids
Default Rep Names
Default Rep Pct
Default Rep Group
We also split the fields so each rep gets its own column.
Default Rep Id 1
Default Rep Name 1
Default Rep Pct 1
Default Rep Group 1
etc.

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Brand Key | brandId | keyword_text |  | Key composed of<br />ClientID*Brand ID<br />This is the field that you will join to other queries to get default brand reps. |
| Default Date | defaultDate | date |  | The date that this group of reps became active |
| Brand Product ID | id | keyword_text |  | Key composed of<br />Client ID*Brand ID*Product ID<br />In this case the product id will always be "Default" |
| Default Assign In Oe | defaultAssignInOE | keyword_text |  | "Y" if Assign In O.E. is set<br />"N" if not. |
| Default Rep Ids | defaultRepIds | keyword_text |  | An array of rep ids that are currently active |
| Default Rep Names | defaultRepNames | keyword_text |  | An array of rep names for the the reps that are currently active |
| Default Rep Pcts | defaultRepPcts | double |  | An array of rep percentages for the current default reps |
| Default Rep Groups | defaultRepGroups | keyword_text |  | An array of rep group ids for the the reps that are currently active |
| Default Rep Id 1 | defaultRepId 1 | keyword_text |  | Current active Rep 1 id |
| Default Rep Pct 1 | defaultRepPct 1 | double |  | Current active Rep 1 pct |
| Default Rep Group 1 | defaultRepGroup 1 | keyword_text |  | Current active Rep 1 group |
| Default Rep Name 1 | defaultRepName 1 | keyword_text |  | Current active Rep 1 name |
| Default Rep Id 2 | defaultRepId 2 | keyword_text |  |  |
| Default Rep Pct 2 | defaultRepPct 2 | double |  |  |
| Default Rep Group 2 | defaultRepGroup 2 | keyword_text |  |  |
| Default Rep Name 2 | defaultRepName 2 | keyword_text |  |  |
| Default Rep Id 3 | defaultRepId 3 | keyword_text |  |  |
| Default Rep Pct 3 | defaultRepPct 3 | double |  |  |
| Default Rep Group 3 | defaultRepGroup 3 | keyword_text |  |  |
| Default Rep Name 3 | defaultRepName 3 | keyword_text |  |  |
| Default Rep Id 4 | defaultRepId 4 | keyword_text |  |  |
| Default Rep Pct 4 | defaultRepPct 4 | double |  |  |
| Default Rep Group 4 | defaultRepGroup 4 | keyword_text |  |  |
| Default Rep Name 4 | defaultRepName 4 | keyword_text |  |  |
| Default Inactive Ind | defaultInactiveInd | keyword_text |  |  |
