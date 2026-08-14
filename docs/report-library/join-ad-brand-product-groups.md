---
id: join-ad-brand-product-groups
title: JOIN-Ad Brand Product Groups
sidebar_label: JOIN-Ad Brand Product Groups
---

# JOIN-Ad Brand Product Groups

**Type:** Clients

Brand reps by Product group overrides

:::info JOIN-Ad Brand Product Groups Bundle

Brand reps by Product group overrides

**<a target="_blank" href="/downloads/report-library/join-ad-brand-product-groups.tgz">JOIN-Ad Brand Product Groups</a>**

:::

## Summary

Loads all the override brand reps defined for Product Groups into a dataset so that it can be joined to other datasets. 

For more information on how Brand Reps work and how to use these datasets see -> [Brand Rep Assignment Docs](../informer/informer-mappings-ad-brands#rep-assignments)

## Notes

This should be set up to reload via a Job every day.

## Description
Only returns the last active Product Group Reps on a Brand.  Each Brand Product Group Key can have up to four default reps.  We return a set of fields that return information about the array of reps that are currently active. 
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
| Brand Product Group Key | id | keyword_text |  | Key composed of<br />ClientId*BrandId*ProductGroupID<br />This is the field that you will join to other queries to get product group brand reps |
| Brand Key | brandKey | keyword_text |  | Key composed of ClientID*Brand ID |
| Brand Product Group Inactive Ind | brandProductGroupInactiveInd | keyword_text |  | 	"Y" = Inactive Brand |
| Brand Product Group Date | brandProductGroupDate | keyword_text |  | The date that this group of reps became active |
| Brand Product Group Rep Ids | brandProductGroupRepIds | keyword_text |  | An array of rep ids for the the reps that are currently active |
| Brand Product Group Rep Pcts | brandProductGroupRepPcts | double |  | An array of rep pcts for the the reps that are currently active |
| Brand Product Group Rep Groups | brandProductGroupRepGroups | keyword_text |  | An array of rep group ids for the the reps that are currently active |
| Brand Product Group Rep Names | brandProductGroupRepNames | keyword_text |  | An array of rep names for the the reps that are currently active |
| Brand Product Group Rep Id 1 | brandProductGroupRepId 1 | keyword_text |  | Current active Rep 1 id |
| Brand Product Group Rep Pct 1 | brandProductGroupRepPct 1 | double |  | Current active Rep 1 pct |
| Brand Product Group Rep Group 1 | brandProductGroupRepGroup 1 | keyword_text |  | Current active Rep 1 group |
| Brand Product Group Rep Name 1 | brandProductGroupRepName 1 | keyword_text |  | Current active Rep 1 name |
| Brand Product Group Rep Id 2 | brandProductGroupRepId 2 | keyword_text |  |  |
| Brand Product Group Rep Pct 2 | brandProductGroupRepPct 2 | double |  |  |
| Brand Product Group Rep Group 2 | brandProductGroupRepGroup 2 | keyword_text |  |  |
| Brand Product Group Rep Name 2 | brandProductGroupRepName 2 | keyword_text |  |  |
| Brand Product Group Rep Id 3 | brandProductGroupRepId 3 | keyword_text |  |  |
| Brand Product Group Rep Pct 3 | brandProductGroupRepPct 3 | double |  |  |
| Brand Product Group Rep Group 3 | brandProductGroupRepGroup 3 | keyword_text |  |  |
| Brand Product Group Rep Name 3 | brandProductGroupRepName 3 | keyword_text |  |  |
| Brand Product Group Rep Id 4 | brandProductGroupRepId 4 | keyword_text |  |  |
| Brand Product Group Rep Pct 4 | brandProductGroupRepPct 4 | double |  |  |
| Brand Product Group Rep Group 4 | brandProductGroupRepGroup 4 | keyword_text |  |  |
| Brand Product Group Rep Name 4 | brandProductGroupRepName 4 | keyword_text |  |  |
