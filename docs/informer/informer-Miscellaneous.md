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

![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\naviga-analytics-docs\docs\informer\images\misc_002.gif)

 

Table displaying F26, F27, F28 (Billing Schedule)

![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\naviga-analytics-docs\docs\informer\images\misc_001.gif)