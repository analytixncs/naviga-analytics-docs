---
id: circ-implementation
title: Circ Implementation
sidebar_label: Circ Implementation
---

## Questions

- Route Info - Subscription.SubscriptionId = RouteSubscription.SubscriptionId AND RouteSubscriptionEndDate is NULL??

  ![image-20230929152457336](C:\Users\Markm.000\Documents\GitHub\naviga-analytics-docs\docs\circ\images\circ_implementation_Q003.png)

- d



Tran Type - Grace, Payment

## Subscription Status

There is no "status" field, it needs to be calculated.  The following are the fields needed:

- **Subscription** -> **GetsPaper**
- **Subscription** -> **Subscriber**

| Subscriber | GetsPaper | STATUS    | Exception                           | Exception True |
| ---------- | --------- | --------- | ----------------------------------- | -------------- |
| TRUE       | TRUE      | Active    | Unless DaysUntilExpire < 0          | In Grace       |
| FALSE      | FALSE     | Former    |                                     |                |
| TRUE       | FALSE     | Temp Stop | Unless Start has not been Processed | Not Started    |

Given the above chart, we will get **5** Subscription Status values:

- **Active** - **Subscriber=true**, **GetsPaper=true** , **DaysUntilExpire NOT < 0**
- **In Grace** - **Subscriber=true**, **GetsPaper=true** , **DaysUntilExpire < 0**
- **Former**  - **Subscriber=false**, **GetsPaper=false**  
- **Temp Stop**  - **Subscriber=true**, **GetsPaper=false** , **Start ProcessedDate NOT Null**
- **Not Started**  - **Subscriber=true**, **GetsPaper=false** , **Start ProcessedDate IS Null**

**Days Until Expire**

You will need to look at the SubscriptionTran table's expire record for the subscription.  This is not easy in Informer.  Our current tactic is to create a relationship to the Subscription Tran and force only the proper Expire transactions to show in our link:

![image-20230927131533302](images/circ_implementation_001.png)

Then we use the following code to get the Days until Expire:

```js
daysUntilExpire = moment($record['subscription_tran_expire_tranDate']).diff(moment(),  "days")
```

**Start Processed Date**

The logic/joins for this information is as follows.

```sql
SubscriptionTran where SubscriptionTran.SubscriptionID = Subscription.SubscriptionID
   and SubscriptionTran.TranType = ‘Start’ 
   and SubscriptionTran.ProcessDate = null
```

However, the best way to isolate the Start trans will be to create a mapping relationship from the Subscription table:

![image-20230927134832575](C:\Users\Markm.000\Documents\GitHub\naviga-analytics-docs\docs\circ\images\circ_implementation_002.png)

The full code for this is:

```javascript
//--------------------------
//--Calculate Sub Status ---
// GetsPaper | Subscriber 
// TRUE      | TRUE      => Active UNLESS DaysUntilExpire<0  => In Grace
// FALSE     | FALSE     => Former
// FALSE     | TRUE      => Temp Stop
// If Temp Stop Then need to check -> SubscriptionTran where SubscriptionTran.SubscriptionID = Subscription.SubscriptionID and
//                               SubscriptionTran.TranType = ‘Start’ and
//                               SubscriptionTran.ProcessDate = null
//      THEN -> Not Started Status
//----------------------------------------
isActive = $record['getsPaper'] && $record['subscriber']
isFormer = !$record['getsPaper'] && !$record['subscriber']
isTempStop = !$record['getsPaper'] && $record['subscriber']

$record.subStatus = "Unknown"
daysUntilExpire = moment($record['subscription_tran_expire_tranDate']).diff(moment(),  "days")
if (isActive) {
  $record.subStatus = "Active" 
  if (daysUntilExpire < 0) {
    $record.subStatus = "In Grace"
  }   
}


if (isFormer) $record.subStatus = "Former"
if (isTempStop) {
  $record.subStatus = $record['subscription_tran_3_processDate'] ? "Temp Stop" : "Not Started"
} 
```

## Stops

