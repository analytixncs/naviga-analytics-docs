---
id: informer-miscellaneous
title: Informer Miscellaneous
sidebar_label: Informer Miscellaneous
---

This document contains information that has not yet been proofed or decided where in the main documentation that it should live.

## Row Level Security Filter

Yes the Informer row filter looks at salesrep security at the user level and the pub/group security at the security group level.

Might be a few things going on here. From what Andrew Morovati @Entrinsik told me that the Row filter doesn’t apply to datasets so there’s that.

Our row filter handles the data selection and varies from file to file. This was something we had in Informer 4 and we had Andrew modify it to work with Informer 5 but he specified only for Ad Hoc Queries. 

AD Orders, Inet Campaigns, AD Internet Orders, User Reports are all using Salesrep/Publication security and I think on the circ/book side it’s at a company level. This is calling a program in Unidata called “INFORMER.ROW.FILTER”, passing in the User ID, security group and filename within Naviga Ad at the database level. That is probably why it won’t work with datasets because it can select data using elasticsearch without even getting to the database level and then there would be the issue of who created the dataset vs who runs reports from the dataset and they might have different group access entirely. I can understand why our plugin would not work in that case.

Here is the actual case statement that determines which filter to use by file:

```sql
BEGIN CASE
CASE DATAFILE = 'USER_REPORTS_DETAIL'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.AD'
CASE DATAFILE = 'ODBC_PBOOKINGS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.AD'
CASE DATAFILE = 'INF_INET.ORDERS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.AD'
CASE DATAFILE = 'INET.CAMPAIGNS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.AD'
CASE DATAFILE = 'INF_REP.COMM.FILE'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.AD'
CASE DATAFILE = 'INF_CM.ACTION.ITEMS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.AD'
*
\* circ files
*
CASE DATAFILE = 'INF_SU.SUB'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.CW'
CASE DATAFILE = 'INF_SU.PUB'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.CW'

*
\* book files
*
*
CASE DATAFILE = 'ODBC_BOOK_MASTER'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'ODBC_INV_DETAIL'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BOOK.CONTACTS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BOOK.PRICES'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BOOK.SETS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BROWSE.CATEGORY'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BW.SO.DETAIL'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BW.SO.SERIES'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BW.TEMPLATE'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BW.UNASSEMBLED.SETS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_HIST.ORD.DETAIL'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_INV.ADJ'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_INVENTORY.TRANS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_JOB-FILE'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_ORD.DETAIL'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_PICKLISTS.XREF'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_PO.BOOK.XREF'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_POD'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_SALES.BOOK'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_SALES.BOOK.CUST'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_SALES.BWREPS.BOOK'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_SALES.ROY.ERR'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_STOCK.LOCATOR'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'
CASE DATAFILE = 'INF_BOOK.REVIEWS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.BW'

*
\* royalty files
*
CASE DATAFILE = 'INF_ROYALTY.CYCLE'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.ROY'
CASE DATAFILE = 'INF_ROY.MASTER'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.ROY'

*
\* Membership files
*
CASE DATAFILE = 'INF_MM.PRODUCTS'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.MM'
CASE DATAFILE = 'INF_MM.ORDDETAIL'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.MM'
CASE DATAFILE = 'INF_MM.ORDHEADER'
 ROUTINE.NAME = 'INFORMER.ROW.FILTER.MM'
*
```

## Taxes

From Wayne

> I believe we store the tax code on the order and calculate the tax amount, I don’t believe we actually store taxes until billing. 
>
> One would need to look at tax code and at the taxable yes/no flag in order to calculate taxes.
>
> Canada is particularly vexing as they have layered tax codes, all provinces apply the federal tax, and then on top of that they apply a state tax.
>
> There is a “cumulative” flag on the tax code setup that asks if the calculation of the second amount includes the amount applied on the first tax (so on a $100 order where first tax is $10 are we applying second tax to $100 or to $110)

From Greg

> Wayne is correct the tax is calculated at billing and there is a tax code on the client record but there can also be override tax code on the publication.



## Invoice Data

Invoice IDs are stored differently for Flexible and Performance Campaigns, so you would have to at least have 2 columns, but maybe 2 separate reports. This may not be an issue if GMG uses one type exclusively.

Flexible – INET.CAMPAIGNS<28> Billing Schedule Invoice ID, also Billing Schedule Amount is in F27

Something to watch for is if they bill 2 (or more) Schedule Dates together than an Invoice ID might appear twice in this field. If the Amount comes from the linked table instead of from the Billing Schedule, then it could over-report.

 

Performance – INET.ORDERS<80> Month Invoice ID, also Month Actual Amount is in F76 (note also that Credits are stored in F81 which adds additional complexity for a global report)

Here again, multiple INET.ORDERS could be combined onto one Invoice during billing so care needs to be taken to avoid doubling up on Amounts.

 

Finally, if the base table is Campaigns, in my experience Informer will always pass F28 as the Invoice ID to lookup in the Invoices table even if the path to display the Invoice ID goes through the Orders table (Performance Campaigns). Likewise, if the base table is Orders it always passes F80 as the Invoice ID to lookup even if the path to display the Invoice ID goes through the Campaigns table (Flexible Campaigns). 

 

If it still works this way ,then you would either have to do Flexible and Performance on different reports to get the correct data from the Invoice table. Or have one report for Invoice IDs based on Campaigns table and another report for Invoice Amounts based on Invoices table (if you don’t use Billing Schedule Amount/Month Actual Amount because it isn’t the actual “Invoice Amount”).



Technically only F27 should be used. This will be populated regardless of whether there is an Invoice ID in F28 – it is the amount scheduled to be billed, not actually billed. Only the presence of data in F28 gives it the “actually billed” status. Also, the Billing Schedule total is supposed to add up to the Campaign total (sum of F21/F22). However, it can get out-of-synch so understandable to use a different valuation for comparison.

 

No, F21/F22 do not have the same granularity as F27. One of the main features of Flexible Campaigns is the ability to bill on a different schedule than Revenue. F22 (net revenue) would be less Agency Commission – if F21/F22 are different, then F22 is going to be what is comparable to F27. Informer should be set to report a total sum of the multi-values (I4 did this with a java script) instead of each piece.

 

https://dev.navigahub.com/ew/devdigital/ad/campaign_revenue_summary?ID=9551

Table displaying F20, F21, F22 (Revenue Allocation)

![img](images/misc_002.gif)

 

Table displaying F26, F27, F28 (Billing Schedule)

![img](images/misc_001.gif)

**Month Credit ID Link in AD Internet Orders**

Yes, it only applies to Performance Campaigns (it is a field on INET Orders…) and would be the full amount of the Order Line (at the time), but users could take some ill-advised steps and it would be a different amount than the previous Invoice on that Order Line. There are other types of Credits, but this specific field is only for that one type.

1. Credits that are created on Flexible Campaigns would be the result of a negative amount on the Billing Schedule and are treated just like regular Invoices
2. Credits that are created with Reverse Campaign Invoicing  will be listed in the Unbilled Invoices section – INET Campaigns<251> through <255>.
3. Credits that come from outside of Ad (i.e. AR) and get associated with a Campaign – what you mentioned - would appear as Prepayments only. Because of that they don’t get associated with specific Order Lines.

As far as your document is concerned, it is accurate in the discussion about INET Orders mapping. I would just be sure to limit the scope of “Credit” so it does not sound like all types of Credits.

## Payment Data



 ```
 There is a standard Ad Hoc Query called “Cash Receipts Register” that should be mostly the same as <List of Payments> in Web.
 
 The main table is AR Cash – corresponds to UD SCASH file (“Sales Cash”) and technically in AR they are “Cash Receipts” although most people do call them “Payments” if they don’t also deal with AP.
 
 1. There is only one     Prepayment flag <47> that applies to the whole record, even if only     a partial amount was applied as a Prepayment. Because of that, it gets     difficult to report on the amount of Cash on Account that is actually a     Prepayment (applied to an Order) and not just an unallocated balance. Both     the SCASH and INET Campaigns save data on the Amount Prepaid and how much     of that has been applied to Invoices.
 2. The Prepaid Order ID     <49> has to be paired with Prepay Type (Module) <76> to     determine in which Module to look up the Order. For CRN that will be     simple because they only have IN (Digital Ads). [This was a recent RMA     issue for Campaigns vs. Exhibition.]
 3. Cash on Account used to     be allocated to a Product (or Pubs for Classic platform) and last year     that was changed to be a Product Group (“required” may be a setup option).     There might be some issues with that still lingering but start with     <14> on the Cash Receipt. If it is a Prepayment, then Product Group     can *also* be looked up through the Order ID.
 4. Other gotchas for     Unallocated Invoices, Voids/Returns, in-line Discounts and Write-Offs,     Foreign Currency, etc. may apply depending on what they try to report.
 
 **AR Invoices has Check No and Check Amount.  These are MV fields** 
 
 1. We have Returned Checks (.RET) and *Adjustments* (.ADJ) for Cash Receipts, but those do affect Cash. 
 
 2. Changes to Receivable Balances on the Customer Account that do not involve Cash are just Credit Memos (and Debit Memos), a subset of Invoices. (most likely correct answer)
    When a “Payment” against an Invoice is actually a Credit Memo, the reference ID (Invoices<25>) is CUSTOMER_ID*I*CREDIT_ID with the “I” for Invoice in the middle (versus CUSTOMER_ID*CHECK_ID for Checks, et al)
 
 3. Changes to the GL Balance of Receivables that do not affect the Customer Account Balance would be done with Journal Entries.
 ```

## Adjustments

**From Russel on question of Adjustments to invoices.**

For Invoicing, there is no “Debits” – it’s either an Invoice or a Credit Memo (“Credit”). To review about Invoices:

1. For Flexible Campaigns, Invoices are assigned to the Campaign (AD Internet Campaigns) – on the Billing Schedule (F28). *Reversals* of prior Invoices (Credits) are also stored on the Campaign but in a different place (F252); This also moves the original Invoice ID to F251. Changes in price that are entered on the Billing Schedule as separate Billing Dates are treated just like regular Invoices, whether a reduction (Credit) or an increase (Debit?). More often they are just incorporated into future Billing Dates. [It is possible to build a Billing Schedule that mimics the Orders, but technically each Invoice is a percentage of the entire Campaign so not linked to any specific Order.
2. On Performance Campaigns, Invoices are assigned to the Orders (AD Internet Orders) – F80. *Reversals* of prior Invoices are stored on the Campaign, same as above; This also removes the original Invoice ID from AD Internet Orders. *Cancellation* of an Order will record the Credit on the Order (F81). There can be no “changes” in price for Performance Campaigns; if it has an Invoice ID then the Order will be locked. The Invoice would have to be *reversed*, then the Order can be changed, then it would be re-billed in full (not just for the Adjustment amount). Or, if it is *cancelled* instead, then a new Order would be entered at the correct price.



## Campaign Start/End Dates

The campaign start and end dates are defining the absolute outside edges of the campaign.

It defaults dates in to each line (speeding line entry), it prevents entry of a line starting/ending outside of the range (minimizing error) and it provides a way to report on expiring campaigns.

Each line item could run for the entire length of the campaign, or any one line may run just for a portion of the campaign.

I might purchase a digital line that runs for the entire start/end range but may choose to purchase only one print issue, so while my digital line start/end = campaign start/end my print line may not.

I could also purchase multiple different sizes/positions and that would result in multiple lines each with their start end which may be less than the total length of campaign

##  Brands

Asked Greg for info on how brands work.  Emails below.

**Email 1**

We may need to add a new link. The brand key is the CLIENT.ID*BRAND.ID.

You are correct the clients file stores a list of brands in CLIENTS<30> if the company was set up to use brands.  I believe we create an “XX” brand for “AD” type clients even if they aren’t using brands but if it is set up as an agency we do not create any brands so we need to create the missing link from Clients to Brands and cross my fingers because virtual field links in Informer are iffy but I think the last one we made actually worked but this one is a little more virtual. I would need to loop through CLIENTS<30> to create the link.

**Email 2**

I think I forgot to answer your question about how they are related but I’ll give you the thumbnail sketch. Each company might want to be broken down into subdivisions without having to enter separate companies. For example Ford might be the main company but wants to have separate campaigns for Explorer, Fusion, and Fiesta. The difficult decision is a company like Proctor and Gamble, would you set up the brand for a product type like “air fresheners” or go even more narrow down to the SKU level for every single product.

For each Client record then we allow them to create unlimited number of brands which could also entail separate PIB codes, ad agencies and salereps all associated with that brand. Even if they decide they are NOT using brands we create a default XX brand just so that everything in order entry keeps working as far as they know.

The Agencies do not have brands.

 

Next I created an idescriptor that I got working that will link the GEN CLIENTS to AD BRANDS so if they want to create a report using the GEN Clients mapping they can link to the AD Brands and pull the description etc.

### Brands and Brand Reps

For print there is the following relationship which has been around longer than I’ve been associated with MSG… which is my way of saying don’t blame me…lol…

 

You could start with clients which stores a list of BRANDS on CLIENTS<30>

![img](images/informer_misc_brandreps02.png)

 

PRODCAMP is the brand record CLIENT.ID*BRAND.ID

 

BRAND.PUBS is a middle tier CLIENT.ID*BRAND.ID*PUB.ID

Stores the effective date and counter which is a bit redundant 

 

 

![img](images/informer_misc_brandreps03.png)

 

 

 

BRAND.PUBS.REPS is CLIENT.ID*PUB.ID*PUB.ID*[COUNTER]

![img](images/informer_misc_brandreps04.png)

 

So every time the rep is reassigned with a new effective date for the same brand/pub/rep the counter is incremented.

 

![img](images/informer_misc_brandreps05.png)

 

 

When you edit this line you will see all seven assignments:

 

![img](images/informer_misc_brandreps06.png)

 

For rep reporting I would recommend starting with Brand Pubs Reps and link from there:

 

![img](images/informer_misc_brandreps07.PNG)

## Est Amt vs Actual Amt

So for print or flat fee digital ads the estimate and actual should always populate with the same number.

For digital campaigns that are sold on a “cost per” basis the initial entry would populate the estimate field, the actuals would populate when you deliver. So for example I sell you 100,000 impressions. That is a promise up front, there is a chance I don’t actually deliver all of those and if you are a savvy advertiser you are actually monitoring what I delivered … so I have to charge you for the actual delivery amount and that goes in the actuals field.

If your instance of Naviga is connected to Google Ad Manager then we update that actuals column every 30 minutes based on how many times the ad is actually viewed.

 

On flexible campaigns we bill off estimates, sometimes that is what publishers want. On performance campaigns there is a default setting on the customer that can be overwritten on the campaign that asks if you are billing off estimates (more unusual), actuals, or what we call “third party” actuals. For that the number comes from a verification service that checks and says don’t care what the publisher or the advertiser say, this is the real number.

- **Flexible Campaigns** -     If the line is part of a flexible campaign, then you will **only** use     the **Month Est Amt*****[Wayne Burrows]\***  **Naviga only uses the estimate on     flexible campaigns yes. It is possible that they still get actuals     back from GAM and those would populate the actuals field but we would bill     on estimate and recognize revenue on estimate. So WE only use estimate     in that case. Glacier has some reports that do look at the actuals     even on flexible but that would be unusual (SORRY! Short answer     would be YES … but wanted to be really precise just in case you do notice     values in that field)**

**Other Types of Campaigns** - If the line is not part of a flexible campaign, then we need to determine whether to use the Actual or Estimated amount field. You will simply choose the Estimated amount if the Actual amount field is zero or empty.***[Wayne Burrows] I’d say safest is to look at the setting on the line. The problem with assuming to use estimate if actual is blank is if they are billing based on actuals a zero/null might be valid (the line is not serving) and you would want to know that, otherwise we could be assuring them that everything is serving fine when it is not.\***

![img](images/informer_misc_act-est-amt001.png)

Are all Print and Flat Fee digital ads Flexible campaigns? 

***[Wayne Burrows]\*** Unfortunately not. So … separate setting … here is why you use flexible vs performance: Performance system assumes it will invoice as you perform (so if an ad ran in Jan/Feb/March we assume we will bill end of each of those 3months). Flexible: no system assumption on when to bill, user can enter any billing date they wish. So on my 3month order I could have one bill all up front, or one at the end, or 2 bills, anything customer wants. Flexible does only look at estimates ignores settings above, Performance depends on settings above. Invoices for flexible are a % of the whole so all orders are summed up and amount is not related at all to any line item detail. Performance you are billing each line for that month. Flexible creates all sorts of journal entries behind the scenes to defer and recognize the transactions, performance does not. So … now I bet it is clear as mud … and yes the customers should understand the difference … I’m guessing certain people in the organization do and they are perhaps not involved in writing the reports. I’m happy to talk with the customer if that would help.
