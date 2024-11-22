export const InformerIntro01_08 = [
  { seekToSeconds: 0, seekTitle: "Introduction" },
  { seekToSeconds: 58, seekTitle: "What Is Informer" },
  { seekToSeconds: 133, seekTitle: "Who Is Informer For" },
  { seekToSeconds: 60 * 2 + 53, seekTitle: "Navigating Informer" },
  { seekToSeconds: 60 * 10 + 58, seekTitle: "Dashboards and Ad Hoc Reports" },
  { seekToSeconds: 60 * 26 + 41, seekTitle: "Datasets and Jobs" },
];

// 
export const AdHocReportOverview = [
  { seekToSeconds: 0, seekTitle: "Introduction" },
  { seekToSeconds: 60 * 3 + 45, seekTitle: "Navigation" },
  { seekToSeconds: 60 * 7 + 55, seekTitle: "The Data Grid" },
  { seekToSeconds: 60 * 2 + 53, seekTitle: "" },
];
/*
Check the current transactions invoiceDate against the date entered as an Input from the user
Set a flag to true if date before the input date
We are also ordering the records returned from the query by client and Invoice Date, therefore we
know that we can sum up all the records balance UNTIL the isBeforeInvStart = false AND omit these records,
then we the FIRST time we hit isBeforeInvStart = false, we create a MultiValued field for this special row
and add the previousBalance with the current records invoice balance.
This is why we have the normalize flow step.
*/
isBeforeInvStart = moment($record['invoiceDate']).isBefore(moment($inputs['invoiceDateStart']))
if ($local.prevClient !== $record['clientNo']) {
    // reset previous balance on new client
  $local.prevBalance = 0
    $local.prevBalanceSet = false
}

//$record.prevBalance = [0, 0]
if (isBeforeInvStart) {
    $local.prevBalance = naviga.returnANumber($local.prevBalance) + naviga.returnANumber($record['invBalance'])
    $omit()
} else {
  if (!$local.prevBalanceSet) {
    $record.prevBalance = [0, $local.prevBalance]      
    $record['invBalance'] = [$record['invBalance'], $local.prevBalance]
    $record['internet_campaigns_assoc_campaignDesc'] = [$record['internet_campaigns_assoc_campaignDesc'], "Previous Balance"]
    prevMonthYear = moment($inputs['invoiceDateStart']).subtract(1, 'month').format('YYYY-MM')
    $record['period'] = [$record['period'], prevMonthYear]
    $local.prevBalanceSet = true
  }
}

$local.prevClient = $record['clientNo']