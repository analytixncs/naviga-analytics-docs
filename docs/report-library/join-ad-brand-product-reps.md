---
id: join-ad-brand-product-reps
title: JOIN-Ad Brand Product Reps
sidebar_label: JOIN-Ad Brand Product Reps
---

# JOIN-Ad Brand Product Reps

**Type:** Clients

Brand Product Override Reps

:::info JOIN-Ad Brand Product Reps Downloads

Brand Product Override Reps

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/join-ad-brand-product-reps.tgz">JOIN-Ad Brand Product Reps</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/join-ad-brand-product-reps.json">join-ad-brand-product-reps.json</a>

:::

## Summary

Loads all the override brand reps defined for Products into a dataset so that it can be joined to other datasets. 

For more information on how Brand Reps work and how to use these datasets see -> [Brand Rep Assignment Docs](../informer/informer-mappings-ad-brands#rep-assignments)

## Notes

This should be set up to reload via a Job every day.

## Description
Only returns the last active Product Reps on a Brand.  Each Brand Product Key can have up to four default reps.  We return a set of fields that return information about the array of reps that are currently active. 
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
| Brand Product Key | id | keyword_text |  | Key composed of<br />ClientId*BrandId*ProductID<br />This is the field that you will join to other queries to get product brand reps |
| Brand Key | brandId | keyword_text |  | Key composed of<br />ClientID*Brand ID<br /> |
| Brand Product Assign In Oe | brandProductAssignInOE | keyword_text |  | "Y" if Assign In O.E. is set "N" if not. |
| Brand Product Date | brandProductDate | date |  | The date that this group of reps became active |
| Brand Product Rep Ids | brandProductRepIds | keyword_text |  | An array of rep ids that are currently active |
| Brand Product Rep Pcts | brandProductRepPcts | double |  | An array of rep pcts that are currently active |
| Brand Product Rep Groups | brandProductRepGroups | keyword_text |  | An array of rep group ids that are currently active |
| Brand Product Rep Names | brandProductRepNames | keyword_text |  | An array of rep names that are currently active |
| Brand Product Rep Id 1 | brandProductRepId 1 | keyword_text |  | Current active Rep 1 id |
| Brand Product Rep Pct 1 | brandProductRepPct 1 | double |  | Current active Rep 1 pct |
| Brand Product Rep Group 1 | brandProductRepGroup 1 | keyword_text |  | Current active Rep 1 group id |
| Brand Product Rep Name 1 | brandProductRepName 1 | keyword_text |  | Current active Rep 1 name |
| Brand Product Rep Id 2 | brandProductRepId 2 | keyword_text |  |  |
| Brand Product Rep Pct 2 | brandProductRepPct 2 | double |  |  |
| Brand Product Rep Group 2 | brandProductRepGroup 2 | keyword_text |  |  |
| Brand Product Rep Name 2 | brandProductRepName 2 | keyword_text |  |  |
| Brand Product Rep Id 3 | brandProductRepId 3 | keyword_text |  |  |
| Brand Product Rep Pct 3 | brandProductRepPct 3 | double |  |  |
| Brand Product Rep Group 3 | brandProductRepGroup 3 | keyword_text |  |  |
| Brand Product Rep Name 3 | brandProductRepName 3 | keyword_text |  |  |
| Brand Product Rep Id 4 | brandProductRepId 4 | keyword_text |  |  |
| Brand Product Rep Pct 4 | brandProductRepPct 4 | double |  |  |
| Brand Product Rep Group 4 | brandProductRepGroup 4 | keyword_text |  |  |
| Brand Product Rep Name 4 | brandProductRepName 4 | keyword_text |  |  |
| Brand Product Inactive Ind | brandProductInactiveInd | keyword_text |  | 	"Y" = Inactive |
