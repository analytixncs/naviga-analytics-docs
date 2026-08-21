---
id: naviga-coa-calculation
title: Naviga-COA Calculation
sidebar_label: Naviga-COA Calculation
---

# Naviga-COA Calculation

**Type:** AR and GL

Cash On Account (COA) grouped by Client

:::info Naviga-COA Calculation Downloads

Cash On Account (COA) grouped by Client

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/naviga-coa-calculation.tgz">Naviga-COA Calculation</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/naviga-coa-calculation.json">naviga-coa-calculation.json</a>

:::

## Description
Dataset that can be joined to other dataset to pull in COA information for Advertisers.  Based on AR Cash mapping.
See this documentation for a clear understanding of how each field is calculated.  COA is tricky and this dataset is not guaranteed to be correct 100% of the time.
[COA More Info](../informer/informer-sample-reports#coa-report)

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Client Id | clientId | keyword_text |  |  |
| True Coa Total | trueCOA_Total | double |  | Final Aggregated value for a customer:<br />Genuinely uncommitted cash available for use. This represents customer funds that are not tied to any specific orders or commitments.<br />If the calculation results in a negative value, return zero. This can occur when prepayment commitments have been partially refunded, leaving the committed amount higher than the actual available balance.<br />-----<br />True COA = Whole COA - Prepayment Amount<br />IF result < 0, THEN True COA = 0 |
| Whole Coa Total | wholeCOA_Total | double |  | Total payment balances that have not yet been applied to invoices. This represents all cash received from customers that remains unallocated.<br />--- AR Cash ---<br />SUM of all CHECK_BAL <4> values WHERE CHECK_BAL > 0 |
| Pre Pay Total | PrePay_Total | double |  | Total Pre Pay amount calculated on each line and then aggregated to the client<br />-----<br />Prepayment Amount = Total matched PP Amount - Total matched PP Applied Amount |
| Whole Coa | wholeCOA | double | ✓ | Detail Whole COA see Whole COA Total for details. |
| Payments Total | Payments_Total | double |  | Total of this client's payments |
