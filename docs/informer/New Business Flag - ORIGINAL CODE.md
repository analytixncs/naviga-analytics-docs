---
id: new-business-flag-original-code
title: New Business Flag Original code
sidebar_label: New Business Flag Original code
---

# New Business Flag - ORIGINAL CODE

> IN PROCESS FEATURE - Create a lapsed customer option.  This would check a customers **last order date** against **today's date** and if it was greater than x months, we would mark the customer as lapsed.  Most likely you will want Lapsed Months to be Greater than the INACTIVE months.

**<a  target="_blank"  href="/downloads/naviga-new-business-flag.tgz"> Sample New Business Flag Dataset - [NAVIGA]-New Business Flag</a>**

Many times there is a need to declare a customer as a new customer after a defined length of inactivity.  That is where this code can help.

The code below is based on the **AD Internet Campaigns** mapping and uses the campaigns Start and End dates to determine inactivity between campaigns.

The fields needed from **AD Internet Campaigns** are:

- **Advertiser ID <1>**
- **Start Date <4>**
- **End Date <5>**

:::info **Important**

We MUST set the **Order By** in the Query to sort Ascending by **Advertiser ID** AND **Start Date**.  This will group the records by advertiser and also order each advertisers campaign in order of when the campaigns started.

:::

The basic logic will be that as we go through the records, we will compare the previous record to the current record for an advertiser and calculate how much time has passed between the **End Date** of the previous record and the **Start Date** of the current record.  

:::note

The date calculations are based on the first of the month.  For example, if the end date is 01/15/2022, the code will use 01/01/2022 for the comparison.

Many Advertisers will have overlapping campaigns, where the end date of one is **After** the start date of the previous:

 *camp 1, startDate 01/01/2020 End Date 01/01/2021*
 *camp 2, startDate 05/02/2020 End Date 07/01/2020*

This is OK, as in the calculations the result will be negative and is handled.

:::

There are some constants that you will set in the first part of the script that will define how the application sets the New Business status.

- **INACTIVE_MONTHS_LIMIT** - How many months of inactivity must a client have before being designated as "New" business
- **PROBATION_MONTHS** - Many times you also want to know how long a customer has been identified as "New" business.  For example, if a customer starts doing business with your company, you would want them to retain that new status for a certain amount of time.  This is referred to as the **Probationary Period** in the code.  It is defined in months.
- **NEW_STATUS_TEXT** - Text to use in the **ClientStatus** field  when the client is "New"
- **EXISTING_STATUS_TEXT** - Text to use in the **ClientStatus** field when the client is not "New"

Here is the code for the Constants.

```javascript
//=====================
//-- Constants
//-- This is the number of months of inactivty between current and last ad before we call the customer new
INACTIVE_MONTHS_LIMIT = 12;
//-- Number of months AFTER a customer is declared "new" that we keep there status as "New"
PROBATION_MONTHS = 12;
// Status Text
NEW_STATUS_TEXT = 'New';
EXISTING_STATUS_TEXT = 'Existing';
//=====================
```

**Definitions of some Variables**

- **lastActivityDate** - the previous record's "last activity" date.  Maybe the Month End Date of Campaign
      At the start of the Powerscript, this date will be pulled from $local.previousValues object
      At the end of the Powerscript, whatever field is deemed to be the lastActivityDate, will be pulled
      from the current record and stored as the lastActivityDate in the $local.previousValues object
- **currentActivityDate** - the current record's "current activity" date. Maybe the Month Start Date of Campaign
- **startDateOfNewStatus** - gets set to the lastActivityDate of the current record when there has been no activity for 12 months
  This date does not get reset until there is another 12 month period of inactivity.
  This is because a "new" advertiser, stays new for 12 months after becoming new.  After 12 months of activity, status
  will change to "existing"

**Persistent Objects** - These object will persist over every row processed

- **$local.previousValues** - This object will contain the "advertiserId" and "lastActivityDateMoment" from
  the PREVIOUS record.
  If this is the first record (meaning this variable is `undefined`) we initialize to: 
    { advertiserId: null, lastActivityDateMoment: moment(null) }
  One of the **final** steps of the Powerscript is to update this Object with the current records
  advertiser id and "lastActivityDate", which will then be the next records "PREVIOUS" values.
- **$local[advId]** - Since we are using the record's advertiser id as a key on the $local object, all the 
  values stored will be overwritten as we progress through the Advertisers campaign records.

**Main Script**

```javascript
//=====================
//-- Constants
//-- This is the number of months of inactivty between current and last ad before we call the customer new
INACTIVE_MONTHS_LIMIT = 12;
//-- Number of months AFTER a customer is declared "new" that we keep there status as "New"
PROBATION_MONTHS = 12;
// Status Text
NEW_STATUS_TEXT = 'New';
EXISTING_STATUS_TEXT = 'Existing';
//=====================

// get $local object and initialize if they don't yet exist
previousValues = $local.previousValues
  ? $local.previousValues
  : { advertiserId: null, lastActivityDateMoment: moment(null) };

// Get Info for setting $local Adv Bucket
AdvId = $record['advId'];
//!! This is the date of activity for the current record.  It will be compared to
//!! 	  the previous records "lastActivityDateMoment" field.
currentActivityDateMoment = moment($record['startDate']).startOf('month');

// Initialize AdvId bucket in $local var
$local[AdvId] = $local[AdvId]
  ? $local[AdvId]
  : {
      SalesStatusWorking: {
        salesStatus: NEW_STATUS_TEXT,
        startDateOfNewStatus: currentActivityDateMoment,
        isLastRecord: false,
        counter: 0,
      },
    };

//--- Setup Variables
// Pull previous values into vars
lastActivityDateMoment = previousValues.lastActivityDateMoment;
startDateOfNewStatus = $local[AdvId].SalesStatusWorking.startDateOfNewStatus;

currMinusPrevDate = currentActivityDateMoment.diff(
  lastActivityDateMoment,
  'months'
);
currDateMinusCurrStartDOfNS = currentActivityDateMoment.diff(
  startDateOfNewStatus,
  'months'
);

isNewAdvertiser = previousValues.advertiserId !== $record['advId'];

// If the previous record was the final one for the previous advertiser, then set the
//     $local[previousAdvertiserid]"isLastRecord" flag to true.
// Used in the final script to determine the correct sales status.
if (isNewAdvertiser && previousValues.advertiserId) {
  $local[previousValues.advertiserId].isLastRecord = true;
}

// boolean - if true, cust marked as new with startDateOfNewStatus reset to currentActivityDateMoment
isOver12MonthsSinceLastOrder = currMinusPrevDate > INACTIVE_MONTHS_LIMIT;
isPastProbationPeriod = currDateMinusCurrStartDOfNS > PROBATION_MONTHS;

// ------ DEBUGS Start -----
// $record.DEBUG_prevAdvertiser = previousValues.advertiserId;
// $record.DEBUG_lastActivityDateMoment =
//   previousValues.lastActivityDateMoment.format('MM-DD-YYYY');
// $record.DEBUG_startDateOfNewStatus = startDateOfNewStatus;
// $record.DEBUG_dateTestCurrMinusPrev = currMinusPrevDate;
// $record.DEBUG_currDateMinusCurrStartDOfNS = currDateMinusCurrStartDOfNS;
// $record.DEBUG_isPastProbationPeriod = isPastProbationPeriod;
// $record.DEBUG_isOver12MonthsSinceLastOrder = isOver12MonthsSinceLastOrder;
// ------ DEBUGS End -----

// Do some logic to figure out what we should make the sales status and "StartDateOfNewStatus"
if (isNewAdvertiser || isOver12MonthsSinceLastOrder) {
  // This object will persist between records
  // Stores advertiser's current status and the date of when they "acquired" that status
  // Whenever we start on a new advertiser, they are assumed "New"
  $local[AdvId].SalesStatusWorking = {
    salesStatus: NEW_STATUS_TEXT,
    startDateOfNewStatus: currentActivityDateMoment,
    counter: $local[AdvId].SalesStatusWorking.counter + 1,
  };
} else {
  // Setting counter.  Maybe use to determine last salesStatus
  $local[AdvId].SalesStatusWorking.counter =
    $local[AdvId].SalesStatusWorking.counter + 1;
  // Check if out of probationary period, if so, then set Existing status text
  if (isPastProbationPeriod) {
    $local[AdvId].SalesStatusWorking.salesStatus = EXISTING_STATUS_TEXT;
  }
}
  // Setting counter.  Maybe use to determine last salesStatus
  $local[AdvId].SalesStatusWorking.counter =
    $local[AdvId].SalesStatusWorking.counter + 1;
//Before going on to the next record, store the "previous" values
$local.previousValues = {
  advertiserId: $record['advId'],
  lastActivityDateMoment: moment($record['endDate']).startOf('month'), // This will be a moment Object
};

// Expose the current info from our SalesStatusWorking object as records for this transaction
// The $record.counter is very important for the post flush powerscript
// It lets us know compare last record's counter to it, so that we know
// which transaction was the last record for the given advertiser.
$record.workingSalesStatus = $local[AdvId].SalesStatusWorking.salesStatus;
$record.counter = $local[AdvId].SalesStatusWorking.counter;
```

**FLUSH Flow Step**

```javascript
// Put a Flush Flow Step here
```

**Set the Last Record Flag**

```javascript
//!!!!--- Finalize Script - Set Last Record ---!!!!//
advId = $record["advId"];
$record.lastRecord = false;
// We need to move the last record flag out of the $local variable and onto the record itself.
if (
  $local[advId].lastRecord &&
  $local[advId].SalesStatusWorking.counter === $record.counter
) {
  $record.lastRecord = $local[advId].lastRecord;
  $record.finalSalesStatus = $local[advId].SalesStatusWorking.salesStatus;
}
```

**FLUSH Flow Step**

```javascript
// Put a Flush Flow Step here
```

**Remove Non Final Status**

```javascript
// Uncomment to only show FINAL Sales Status
// This make it so that you have only a single row per customer.
if (!$record.isLastRecord) $omit()
```

**Remove Fields**

You can also add a *Remove Fields* flow step to remove the following fields:

- Campaign ID
- Working Sales Status
- Counter
- Start Date
- End Date 
- Is Last Reocrd