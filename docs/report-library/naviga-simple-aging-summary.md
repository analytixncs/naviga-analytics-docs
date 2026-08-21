---
id: naviga-simple-aging-summary
title: NAVIGA-Simple Aging Summary
sidebar_label: NAVIGA-Simple Aging Summary
---

# NAVIGA-Simple Aging Summary

**Type:** AR and GL

Simple Summary by Client Id Aging report.

:::info NAVIGA-Simple Aging Summary Downloads

Simple Summary by Client Id Aging report.

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/naviga-simple-aging-summary.tgz">NAVIGA-Simple Aging Summary</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/naviga-simple-aging-summary.json">naviga-simple-aging-summary.json</a>

:::

## Summary

This is a simple Aging report that calculates aging **as of the date the report is run**.

## Description
Simple Summary by Client Id Aging report.  This report calculates aging as of the date it was run.  It calculates the aging amount by taking the difference of the Invoice Amount and the Invoice Balance to get the outstanding amount.  It then creates buckets based on the Invoice Date and Today's date to determine the bucket for the amount.  

This also pulls in COA calculations from the Naviga-COA Calculation dataset.  You must make sure that dataset is being refreshed regularly if you need COA.
NOTE: We are only looking at Invoices that have a balance in this report.

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Client Id | client_id_assoc_new_name_assoc_nameId | keyword_text |  | Billing Client Id |
| Client Name | client_id_assoc_new_name_assoc_companyName | keyword_text |  | Billing Client Name |
| Misc Inv Salesrep ID | salesreps | keyword_text |  | Salesrep ID on the AR Invoices mapping.  Multivalued field that is not normalized |
| Misc Inv Salesrep Name | salesrep_id_assoc_repName | keyword_text |  | Salesrep Name for the Misc Inv Salesrep ID |
| ON CREDIT STOP | client_id_assoc_creditStop | keyword_text |  | Y = On Credit Stop<br />N = NOT on Credit Stop |
| Beginning Invoice Total | InvoieAmountByClient_Total | double |  |  |
| 0-30 | a30_Total | double |  | 30 day aging bucket |
| 31-60 | a60_Total | double |  | 60 day aging bucket |
| 61-90 | a90_Total | double |  | 90 day aging bucket |
| 91-120 | a120_Total | double |  | 120 day aging bucket |
| 121+ | anext_Total | double |  | >120 day aging bucket |
| Invoice Balance Total | ainvoiceBalance_Total | double |  | Client's aggregated Invoice Balance total based on invoices that still have a balance |
| Difference | invoicedifference | double |  | Dollar difference between total invoice amount and invoice balance |
| % Difference | invoicePercentdifference | double |  | percentage difference between total invoice amount and invoice balance |
| COA | aCOA_Total | double |  | Cash On Account for the client, pulled from Naviga-COA Calculation dataset |
| Inv Del Method | client_id_assoc_digitalInvDelivery | keyword_text |  | Invoice Delivery Method<br />GEN Clients - Digital Inv Delivery <275><br />See docs -> https://naviga-informer-docs.netlify.app/docs/informer/informer-mappings-gen-clients#advertising-setup-for-digital-first-naviga-users |
| Client Client Type Desc | client_id_assoc_clientTypeDesc | keyword_text |  |  |
| Misc Inv Salesrep Primary Rep Group ID | salesrep_id_assoc_primaryRepGroupId | keyword_text |  | Primary Rep Group associated with the Misc Inv Salesrep  |
| Client Statement Ind | client_id_assoc_statementInd | keyword_text |  | Flag on client under A/R Setup "Generate Statements".<br />See docs -> https://naviga-informer-docs.netlify.app/docs/informer/informer-mappings-gen-clients#field-locations-in-naviga |
| Client Stmt Delivery Method | client_id_assoc_stmtDelMethod | keyword_text |  | GEN Clients STMT.DELIVERY.METHOD <259><br />See docs -> https://naviga-informer-docs.netlify.app/docs/informer/informer-mappings-gen-clients#delivery-methods |
