---
id: m10-tvreport
title: M10 TV Report
sidebar_label: H-I
---

M10 TV Report

This group of datasets will bring together for Budgets, Exhibitions and Campaigns. Since all of this data exists is separate mappings and has no simple relationship, we will need to create a dataset for each data point and then bring all of them together.

The most important piece is HOW we join this data together.  We have defined two join points:

1. **Rep ID and Confirmed Month Year** - This will be defined as **GroupKey1**
2. **Rep ID and Confirmed "Target" Year** - This will be defined as **GroupKey2**.  NOTE: Target year is defined as March through February.

:::info 

**Target Year** - To be able to define a group of months outside of the normal calendar year required the creation of a CSV file that defined which calendar months/years were part of this new Target Year.   This CSV file  **<a  target="_blank"  href="/downloads/m10/m10yeardates.csv">m10yeardates.csv</a>** was used to create the ***M 10 Yeardates*** table in the Workspace **External Data**

Current data goes from 2021-03 to 2025-02, so you should have Target Year data for 2021, 2022, 2023, & 2024

If you need to add or modify the Target Year, simply update the spreadsheet and overwrite the data in the above noted workspace.

::: 

### Overview of Informer Objects Used

- **M 10 Yeardate** - ***Workspace/external data*** as noted above.
- **[JOIN]-Rep Budgets** - ***Dataset*** Pulling Budget data from [Sales Rep Budgets by Product Format](https://m10test.navigahub.com/ew/m10/ad/rep_budgets_inet?t=FORMAT). We do NOT use any of the format information, but massage the data and get Budgets so that they match with our GroupKey1 (Rep + Month Year) and GroupKey2 (Rep + Target Year).
- **[NAVIGA]- Exhibitions By Salesrep TV Report** - ***Dataset*** Exhibition Data - This data is programmatically Aggregated by **GroupKey1** and **GroupKey2**.  This is needed because we will be JOINING it to the [NAVIGA]-AD Internet Orders TV Report dataset.
- **[NAVIGA]-AD Internet Orders TV Report** - ***Dataset*** Campaign/Order Data - This is the BASE dataset, so it will be pulling in data from the above two datasets in addition to having its own data from the AD Internet Orders mapping.
- **[NAVIGA]-Top 10 Target Year** - ***Dashboard Report*** - Column chart showing the Top 10 based on Target % 
- **[NAVIGA]-Monthly TV Report** - ***Dashboard Report*** - Pivot table showing Monthly revenue by rep.

:::tip

The Objects used are all stored in the Informer folder **TV Report**

![img](images/m10-tvreport-folder.PNG)

:::



BACKUP BUNDLES

**<a  target="_blank"  href="/downloads/m10/tv-report-bundles.zip">tv-report-bundles.zip</a>**

### Job to Load

I have create a job **Refresh - Tradeshow TV View** that will reload the three datasets in the correct order.

The job to load should run every hour between 7am and 6pm.  This will need to be a custom CRON Job:

0 7-18 * * 1-5

### External Links

[Rep by Month Targets](https://m10bi.navigahub.com/v/report.html?id=185fd9b4-c41d-4a74-8931-ed49f01a80c3&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1ZWNiNDRlZi1kZWFiLTRlYTYtYTQ1Mi00NTFkOGQzNDVkNjQiLCJpYXQiOjE2NjYzNzA4MjYuOTAyfQ.F-1ixQug4rXrObkbnZm9ysgeSWC08Iq7rOnukL3FPoI)

---

[Yearly Targets Top 10](https://m10bi.navigahub.com/v/report.html?id=8817ac97-53fd-4c30-8b62-854a2c6913f5&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI3ZDhiZWZiYy1jNmE3LTQ4ZWMtYmZhNi02NGU3YTRlZDc3MWUiLCJpYXQiOjE2NjYzNzA4NzUuNjc3fQ.8xqcxV3Ktivm_IpSlJHm7tUOupUX7hQVMcVZAho3cIk)
