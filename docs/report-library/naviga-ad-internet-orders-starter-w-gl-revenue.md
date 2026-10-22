---
id: naviga-ad-internet-orders-starter-w-gl-revenue
title: NAVIGA-AD Internet Orders Starter W/ GL Revenue
sidebar_label: NAVIGA-AD Internet Orders Starter W/ GL Revenue
---

# NAVIGA-AD Internet Orders Starter W/ GL Revenue

**Type:** Campaigns

Report splitting revenue into GL buckets based on GL overrides.

:::info NAVIGA-AD Internet Orders Starter W/ GL Revenue Downloads

Report splitting revenue into GL buckets based on GL overrides.

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/naviga-ad-internet-orders-starter-w-gl-revenue.tgz">NAVIGA-AD Internet Orders Starter W/ GL Revenue</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/naviga-ad-internet-orders-starter-w-gl-revenue.json">naviga-ad-internet-orders-starter-w-gl-revenue.json</a>

:::

## Summary

## Notes

## Description
Report splitting revenue into GL buckets based on GL overrides.

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Campaign ID | campaignId | keyword_text |  | Campaign Identifier |
| Line ID | id | keyword_text |  | Line Identifier.  Campaigns will have multiple lines and lines will have multiple line details |
| Advertiser Id | a_d_internet_campaigns_assoc_advId | keyword_text |  |  |
| Advertiser Name | a_d_internet_campaigns_assoc_advName | keyword_text |  |  |
| Ad Type ID | adTypeId | keyword_text |  |  |
| Month Actual Amt | monthActualAmt | double |  | Used to calculate the GL Net/Gross amounts.   |
| Month Est Amt | monthEstAmt | double |  | Used to calculate the GL Net/Gross amounts.   |
| Month Start Date | monthStartDate | date |  | Can be considered the Issue date for a Print publication. <br />The starting date of the Order details record. |
| Month End Date | monthEndDate | date |  | The ending date of the Order details record. |
| Product ID | webSiteId | keyword_text |  | Product Identifier |
| Product | web_site_id_assoc_webPubName | keyword_text |  | Product Name |
| Print Pub Ind | web_site_id_assoc_printPubInd | keyword_text |  | Y = Print publication<br />N = Digital Publication |
| Campaign Date Entered | a_d_internet_campaigns_assoc_dateEntered | date |  | Date that the campaign was entered into the system. |
| Campaign Type | a_d_internet_campaigns_assoc_campaignType | keyword_text |  | M = Performance Campaign<br />F = Flexible Campaign |
| Campaign Status Code | a_d_internet_campaigns_assoc_statusCode | keyword_text |  | Only these status' are included in results<br />IS = Invoice Started<br />CO = Confirmed<br />R* = Reserved (can have multiple codes R1, R2, etc)<br /> |
| Gross Line Local Amount | grossLineLocalAmount | double |  | Total Gross Revenue (including Agency Commission) before GL percentage application. |
| Net Line Local Amount | netLineLocalAmount | double |  | Total Net Revenue (excluding Agency Commission) before GL percentage application. |
| Real Gl Code | RealGLCode | keyword_text |  | GL Code this Revenue is assigned to. |
| Campaign Desc | a_d_internet_campaigns_assoc_campaignDescConv | keyword_text |  |  |
| GL Type ID | glTypeId | keyword_text |  |  |
| Advertiser Type ID | a_d_internet_campaigns_assoc_advertiser_id_assoc_clientTypeId | keyword_text |  |  |
| Gl Percent | glPercent | keyword_text |  | If the Line detail revenue is split across GL's this designates the percent allocated to this particular GL Code. |
| Gl Net Revenue | glNetRevenue | double |  | GL Revenue NOT including Agency commission. |
| Gl Gross Revenue | glGrossRevenue | double |  | GL Revenue including Agency commission. |
| Gl Match Type | GLMatchType | keyword_text |  | GLMatchType indicates how the GL configuration was selected:<br /><br />GL_TYPE_AND_CLIENT_TYPE = Both GL Type and Client Type matched.<br />GL_TYPE_ONLY = GL Type matched and product Client Type was blank.<br />NO_MATCH = No matching GL configuration was found. |
| No Agy Comm Ind | noAgyCommInd | keyword_text |  | Used to determine if Agency commission is to be applied. |
| Month Unique ID | monthUniqueId | keyword_text |  | Identifier using the Line Id with an appended .n <br />This is the order details identifier.  However be aware that it is not a record unique identifier as if the GL has a split, it will be duplicated across the splits. |

## Criteria

- All of
  - **Line Cancel Status ID** does not match DE
  - **AD Internet Campaigns → Status Code** exactly matches any of R%, CO, IS
  - **Month Start Date** is between ***INPUT*** <mark>🧩Run Date Start</mark> and ***INPUT*** <mark>🧩Run Date End</mark>
  - **AD Internet Campaigns → Advertiser Id** exactly matches ***INPUT*** <mark>🧩Advertiser Id</mark>

## 🧩 Inputs

| Prompt | Type | Detail |
|--------|------|--------|
| Run Date Start | date |  |
| Run Date End | date |  |
| Advertiser Id | text | Multiple values |

## Flow

| # | Step | Detail |
|---|------|--------|
| 1 | Normalize | monthActualAmt, monthEndDate, monthEstAmt, monthStartDate, monthUniqueId |
| 2 | Script: Calculate Revenue | <mark> BASE REVENUE CALCS </mark>====<br />**Used Saved Functions**<br />naviga.calculateLineAmounts, naviga.returnANumber |
| 3 | Script: Calculate GL |  |
| 4 | Normalize | glGrossRevenue, glNetRevenue, grossLineLocalAmount, monthActualAmt, monthEstAmt, netLineLocalAmount, RealGLCode, glPercent |
| 5 | Remove fields | a_d_internet_campaigns_assoc_commissionPct, a_d_internet_campaigns_assoc_currCode, a_d_internet_campaigns_assoc_currRate, web_site_id_assoc_glTypeClientType, web_site_id_assoc_inetRevCode, web_site_id_assoc_glTypeRevenue, web_site_id_assoc_glTypePct, web_site_id_assoc_glTypes |
