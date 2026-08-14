---
id: naviga-gen-clients
title: NAVIGA-Gen Clients
sidebar_label: NAVIGA-Gen Clients
---

# NAVIGA-Gen Clients

**Type:** Clients

Basic Client report

:::info NAVIGA-Gen Clients Bundle

Basic Client report

**<a target="_blank" href="/downloads/report-library/naviga-gen-clients.tgz">NAVIGA-Gen Clients</a>**

:::

## Summary

This is a basic client report.  Using GEN Clients as the base mapping.

For more detail on how the mappings in client reports work see [Basic Client Report Video](../informer/informer-video-training#basic-client-report)

## Description
Basic Client report.  
View video here -> https://naviga-informer-docs.netlify.app/docs/informer/informer-video-training#basic-client-report

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Client Id | nameId | double |  | Client Identifier.  In database this is called the "Name ID" and is found in both the GEN Clients and GEN Company/Individual Names |
| Client Name | new_name_assoc_fullName | keyword_text |  | Name of Client. |
| Client Type Desc | clientTypeDesc | keyword_text |  |  |
| Account Date Opened | acctOpened | date |  | Date the Client account was opened. |
| Credit Limit | crLimit | keyword_text |  | Client credit limit |
| Brands | brands | keyword_text |  | Multivalued fields showing all brands associated with this client. |
| Address Line 1 | new_name_assoc_a_d_preferred_address_assoc_addressLine1 | keyword_text |  | Ad Preferred Address Line 1 |
| Address Line 2 | new_name_assoc_a_d_preferred_address_assoc_addressLine2 | keyword_text |  | Ad Preferred Address Line 2 |
| Address Line 3 | new_name_assoc_a_d_preferred_address_assoc_addressLine3 | keyword_text |  | Ad Preferred Address Line 3 |
| City | new_name_assoc_a_d_preferred_address_assoc_city | keyword_text |  | Ad Preferred City |
| State | new_name_assoc_a_d_preferred_address_assoc_state | keyword_text |  | Ad Preferred State |
| Zip Code | new_name_assoc_a_d_preferred_address_assoc_zipCode | keyword_text |  | Ad Preferred Zipcode |
| Active Ind | active | keyword_text |  | Active Indicator on the GEN Clients mapping<br />Y = This client is active<br />N = Not active |
| Agency Ind | agencyInd | keyword_text |  | Y = This client is an Agency<br />N = Not an Agency |
| Client Name Do Not Use Ind | new_name_assoc_doNotUseInd | keyword_text |  | Do Not Use Indicator on the GEN Company/Individual Names mapping<br />Y = Do NOT Use<br />N = Can be Used |
| Client Name Specific Job Title | new_name_assoc_specificJobTitle | keyword_text |  | Clients Job Title if applicable.  These will only show up on Individual (Name Type = I) records. |
| Last Pay Amt | lastPayAmt | double |  |  |
| Confirmation Email Contact ID | confEmailContactId | keyword_text |  | Contact ID for contact email on Contacts Emailed Confirmations.  <br />See docs -> https://naviga-informer-docs.netlify.app/docs/informer/informer-mappings-gen-clients#overview-of-advertising-contacts |
| Client Name Type Id | client_name_assoc_nameTypeId | keyword_text |  | C = Advertiser<br />I = Individual / Contact / Employee |
| Client Name Client Type | client_name_assoc_client_assoc_clientType | keyword_text |  |  |
| Credit Stop Date | crStopDate | date |  | Date the the credit was stopped |
| Credit Stop Indicator | creditStop | keyword_text |  | Indicates if this clients credit is stopped<br />Y = This client has credit stopped<br />N = Credit is not stopped |
| Stmt Email Contact ID | stmtEmailContactId | keyword_text |  | Contact ID for contact email on Statement Details.  See docs -> https://naviga-informer-docs.netlify.app/docs/informer/informer-mappings-gen-clients#advertising-setup-for-digital-first-naviga-users |
| AD Invoice Contact ID | adInvoiceContactId | keyword_text |  |  |
| Inv Email Contact ID | invEmailContactId | keyword_text |  | Contact ID for contact email on Misc. Billing Details.  <br />See docs -> https://naviga-informer-docs.netlify.app/docs/informer/informer-mappings-gen-clients#delivery-methods |
