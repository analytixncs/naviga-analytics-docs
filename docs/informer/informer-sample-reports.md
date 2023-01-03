---
​---
id: informer-sample-reports
title: Informer Sample Reports
sidebar_label: Informer Sample Reports
​---
---



## GEN Security File Report

This section has the sample files and explains in detail how to build a report that takes the fields from the **GEN Security File** mapping in Informer and transforms it into a more readable and usable format.  Steps 1-10 will get you a report that has the following format.

| User Group | Security Field Name          | Security Field Value |
| ---------- | ---------------------------- | -------------------- |
| ROOT       | Advertisers - Client type... | Y                    |
| ROOT       | Allowed to apply...          | N                    |
| ...        |                              |                      |
| CLIENT     | Advertisers - Client type... | N                    |
| CLIENT     | Allowed to apply...          | N                    |
| ...        |                              |                      |

Continuing to follow the steps after step 10 will transform the report into a cross tab report, with the User Groups going across the top of the report.

![image-20221028142012818](images/informer_securityreports_dynamic_final_001.jpg)

Before starting, make sure to review the prerequisites and download the sample files.

:::info Prerequisites and Sample Files

****

**Prerequisites**

- You MUST have v2 of the `calculateAggregates` saved function installed. [Get Code Here](informer-saved-functions#calculateaggregates---create-function)
- You must be on Informer version 5.2 or above

**Sample Files**

**<a  target="_blank"  href="/downloads/SecurityMappingLabelDescriptions.csv">SecurityMappingLabelDescriptions.csv File</a>**

**<a  target="_blank"  href="/downloads/securityreport/naviga-datasource-metadata-for-security.tgz">Datasource Metadata For Security Report</a>** - ***Dependent on*** the Security Mapping Spreadsheet being uploaded into a Workspace

**<a  target="_blank"  href="/downloads/securityreport/naviga-gen-security-final.tgz">Security Crosstab with Columns Sample Dataset</a>** - ***Dependent on*** `Datasource Metadata For Security Report` for HNP Security

:::

#### Setup For Building Dataset

**Step 1 Create Upload spreadsheet**

This CSV file has already been created for you, it can be downloaded above.  However, if you want to modify any of the *sml_field_description* values, you may.  You may also modify the *sml_screen* and *sml_screen_order* field values. 

The **attribute number** is used to join to the Metadata and the **Field Description** to build our new label.

The only fields we use in this version of the report are:

- sml_field_description
- sml_attribute_number
- sml_screen
- sml_screen_order - this field holds the order of the fields as they appear in the Naviga security screen.

:::tip

All other fields are for informational purposes.  If you find they are difficult to get into the spreadsheet, you can omit them.

:::

![image-20221018143334517](images/informer_securityreport_dynamic_001.jpg)

:::danger Important

Once you have created this file, you will upload it into a Workspace -> **Security Mapping Label Descriptions**

If you make any changes in the spreadsheet, you MUST upload and replace the data in the Workspace!

:::

**Step 2 "Datasource Metadata For HNP Security" Dataset**

The next step is to get Metadata for the GEN Security File mapping.  This dataset was created to get that information:

If anything has changed in the Spreadsheet from Step 1 and you have uploaded it into the Workspace, you first need to refresh this dataset. 

:::caution

I found discrepancies in the metadata JSON field "Field Data" for the alias name.  

To work around this, I used the FIeld Id in from the **Mapping** mapping and used it to calculate the field Alias.  The Field Id is what you see in the datasource mapping lists in the format "FIELD.NAME".  However, sometimes the value separating words is a period "." and sometimes an underscore "\_". 

Here is the code.

```javascript
// Below code is creating a calculated field for the field name to join with our main dataset
// I found that certain fields were getting incorrect alias names when pulling from teh field_data JSON file.
// This one is calculating from teh Field ID.
splitDelimiter = $record['field_fieldId'].indexOf(".") > 0 ? "." : "_"
fieldNameArray = $record['field_fieldId'].split(splitDelimiter) // $record['field_data'].name.split(" ")

lastFieldVals = fieldNameArray.slice(1).map(el => el.toLowerCase()[0].toUpperCase() + el.slice(1).toLowerCase())
$record.dfieldAliasCalced = fieldNameArray[0].toLowerCase() + lastFieldVals.join("")
```

I point this out, because we use the calced field as the Join field in the final dataset and if you see any field that isn't pulling its description, first look to this value to make sure it is "calculating" the correct alias.

:::

Once refreshed, you can export it to excel for reference.  The fields of interest are:

- **Field Label Expression** - Used in the HNP Security dataset to update the label of fields with descriptions.
- **Condense Multi Valued Expression** - Used in the HNP Security dataset to convert multivalued fields to a string of values
- **Object Map Pair** - --NO LONGER NEEDED-- The key/value pairs *was* extracted and used to create a lookup object in the **naviga.securityMapLookup** saved function
- **SML Screen** - Informational value identifying which Naviga Screen this field comes from

*However*, the fields that contain the information you **need** for the Powerscripts in the final dataset can simply be **copied and pasted from the dataset.**  These are:

- **Final Condense Multi Valued Expression** - Used in the HNP Security dataset to convert multivalued fields to a string of values.  
- **Final Alias Array** - Used in the HNP Security dataset to the field array will tell us the fields in the mapping to process.
- **Final Field Label Expression** - **NOT USED** in the final dataset, but for informational purposes, you could use this code to **update the label of fields** with descriptions.
- **Final Object Map Pair** - --**NOT USED**-- The key/value pairs will be extracted and used to create a lookup object in the **naviga.securityMapLookup** saved function

#### Build the Final Dataset

To transform a dataset with 300+ columns to a Cross Tab we will need to 

- Create the following arrays will be created:
  - UserGroup - will be the @id (User Group) field
  - SecurityFieldLabel - will be the column name
  - SecurityFieldValue - will be the column value
  - SecurityFieldAlias - used to join to the Dataset-> **Datasource Metadata For Security Report**

We continue to push values onto these arrays (in the $local object so that they persist between rows) for every row.  

**Step 1**

Create a Dataset pointed to the GEN Security File mapping and then grab ALL of the fields.  

**ADD** *Criteria* 

- WHERE Group Name is Not Empty
  ![image-20221031091710817](images/informer_securityreport_dynamic_final_002.jpg)

**Step 2 - Flow Step Powerscript** 

In this Powerscript, we are defining the `$local.fieldsToLoop` array. This array is defined in the **Final Alias Array** field in the **Datasource Metadata For Security Report** dataset.  Just copy and paste it after the "="

*Assign FieldsToLoop Local Array*

```javascript
// Create Array of field aliases that we will loop through and "unwind"
$local.fieldsToLoop = ['adClientTypeReqdInd',...,'adCustOption']
```



**Step 3 - Flow Step Powerscript**

This script can be modified to meet your needs.  Initially, there are many multivalued fields and if you are not sure how to handle them, it is best to simply convert the multiple values into a delimited string list.  To determine if a field is Multivalued, there is the **Datasource Metadata For Security Report** dataset.  Simply run this dataset and copy the **Final Condense Multi Valued Expression** field.  It will contain the code that you need to convert all of the MV fields to string delimited.

As an example, the moduleAccessCombined code is showing that you can do custom edits with MV fields if needed.  the genWebModuleAccess and genWebModuleCodes are two MV fields that are associated and so, we added them into a single field.

:::caution

If you create a new field with values as we have done with **$record.moduleAccessCombined**, you will need to add that field name to the array **$local.fieldsToLoop** defined in Step 2 above.

:::

*Deal with MV Fields*

```javascript
// Deal with Multivalued fields
//-------------------------------
// Custom coversion of a multivalued field
moduleAccessCombined = $record['genWebModuleAccess'].map((el, index) => {
    return `${$record['genWebModuleCodes'][index]} = ${el}`
})

// Since we are creating a new field IT MUST be added to the fieldsToLoop array in the previous powerscript
$record.moduleAccessCombined = naviga.multiValuedToString(moduleAccessCombined, ", ", true)
//-------------------------------

// Convert all multivalued fields to strings - code from "Datasource Metadata For HNP Security" dataset
$record["inClientAccessCodes"] = naviga.multiValuedToString($record["inClientAccessCodes"], ",", false)
$record["inetStatusCodes"] = naviga.multiValuedToString($record["inetStatusCodes"], ",", false)
...
$record["incentiveAutoAdjustCodes"] = naviga.multiValuedToString($record["incentiveAutoAdjustCodes"], ",", false)
```



**Step 4 - Flow Step Powerscript**

Here is the script where we start the process of "unwinding" the fields.  This is done by creating 4 arrays for each of the final fields that we want. 

*Field Mapping*

```javascript
// GEN Security File Field Mapping
//-- Initialize the $local arrays
$local.UserGroup = $local.UserGroup || []
$local.SecurityFieldLabel = $local.SecurityFieldLabel || []
$local.SecurityFieldValue = $local.SecurityFieldValue || []
$local.SecurityFieldAlias = $local.SecurityFieldAlias || []


loopFields = $local.fieldsToLoop
// Loop through the field alias array and build three arrays that will be 
// the final three fields in the table
for (let i=0; i < loopFields.length; i++) {
    fieldName = loopFields[i]
    // Make sure field exists in dataset
    if ($fields[fieldName]) {
        $local.UserGroup.push($record['id']) 
        $local.SecurityFieldLabel.push($fields[fieldName].label + "_ZZZ")
        $local.SecurityFieldValue.push($record[fieldName])
        $local.SecurityFieldAlias.push(fieldName)
    }
}
```

**Step 5 - Flow Step Flush**

We need a flush step because we want to process all of the above steps before proceeding to the next Powerscript.

```bash
#FLUSH Flow Step
```

**Step 6 - Flow Step Powerscript**

*Local To Records*

```javascript
// Copy all of our $local persistant arrays that were created to
// records.  NOTE: These will be 4 large arrays.
// ALSO, since we only need ONE value (hence one row), we delete all other rows
// as we have aggregated the information we need into the below local arrays
if (!$local.firstTime) {
    $record.UserGroup = $local.UserGroup
    $record.SecurityFieldLabel = $local.SecurityFieldLabel
    $record.SecurityFieldValue = $local.SecurityFieldValue  
    $record.SecurityFieldAlias = $local.SecurityFieldAlias
    $local.firstTime = true
} else {
    $omit()
}
```

**Step 7 Flow Step Normalize**

Next we need to normalize on the four new fields we created above.

Add the Normalize Flow step and choose 

- UserGroup
- SecurityFieldLabel
- SecurityFieldValue
- SecurityFieldAlias

**Step 8 Flow Step Field from Another Dataset**

There is some information in our **Datasource Metadata For Security Report** dataset that we need.

Join the **Security Field Alias** to the **Dfield Alias** and then pull in the following fields:

- **Dfield Name**
- **Dfield Alias**
- **Dfield Attribute**
- **Sml Screen**
- **Sml Field Description**

![image-20230103150320544](images/informer_securityreport_dynamic_dsjoin.jpg)

**Step 9 Flow Step Powerscript**

*Populate Final Field Description*

```javascript
// We expect some fields will not have a Description defined in the Workspace table, if not
// Populate with the original field Label.
$record['FinalFieldDescription'] = $record['smlFieldDescription'] || $record['SecurityFieldLabel']
```

:::tip

The completion of Step 9 will give you a dataset with the GEN Security File fields "Unwound".  Proceed to Step 10 to remove unneeded fields.  

However, if you want to convert this into a Crosstab style report that looks like the image below, **SKIP** Step 10 and proceed to **Step 11**.

![image-20221028142012818](images/informer_securityreport_dynamic_final_001.jpg)

:::

**Step 10 After Run**

After you have loaded the data, you will find that you have over 300 fields and you only want/need 4.  Click on the "Columns" button and deselect all fields except for the following.

![image-20221026151245745](images/informer_securityreport_dynamic_v2_finalfields.jpg)

:::danger

Do not use the Remove Fields flow steps to get rid of the fields.  Given how we are building the dataset, this causes issues when I tried in the past.  As new versions of Informer are released, this option could be tested again.

:::

**Step 11 Flow Step Powerscript**

To accomplish the output, we will need to take the User Group field and make all unique values in it their OWN field AND the values of each field must be the corresponding SecurityFieldValue values.

We are going to use the `naviga.calculateAggregates` saved function to help.  **Make sure you have version 2,** which includes the `type` option.

Using this function, we will group by the "UserGroup" field and do a special aggregation which will concatenate ALL the value from the following fields:

- **SecurityFieldValue** - The value for the Field Description.
- **FinalFieldDescription** - The final field description will be the new description from the spreadsheet, or if that doesn't exist it will be the original label for the field with an "_ZZZ" at the end.
- **SecurityFieldLabel** - This is the ORIGINAL label for the field.
- **SecurityFieldAlias** - This is the alias for the field
- **smlAttributeNumber** - The attribute number of the field.  NOTE: this will only be populated for fields that had a description in the spreadsheet/workspace
- **smlScreen**
- **smlScreenOrder**

**Aggregation Step**

```javascript
// Define your group keys on the $record object so that
// you can reuse them in the Post Aggregation function
$record.groupKey1 = `${$record['UserGroup']}`;
groupKeys = [
  {
    name: "Group",
    groupKey: $record.groupKey1,
  }
];

groupAggr = [
  {
    name: "value",
    initValue: '',
    value: $record['SecurityFieldValue'],
      type:  'concatall'
  },
  {
    name: "desc",
    initValue: '',
    value: $record['FinalFieldDescription'],
      type:  'concatall'
  },
  {
    name: "label",
    initValue: '',
    value: $record['SecurityFieldLabel'].replace("_ZZZ", ""),
    type:  'concatall'
  },     
  {
    name: "screen",
    initValue: '',
    value: $record['smlScreen'],
    type:  'concatall'
  }, 
  {
    name: "screenOrder",
    initValue: '',
    value: $record['smlScreenOrder'] ,
    type:  'concatall'
  },     
  {
    name: "attributeNum",
    initValue: '',
    value: $record['dfieldAttribute'],
    type:  'concatall'
  },    
  {
    name: "alias",
    initValue: '',
    value: $record['SecurityFieldAlias'],
    type:  'concatall'
  },     
];

// Calling the calculate aggregates in a Powerscript
naviga.calculateAggregates({ $local, groupKeys, groupAggr });
```



**Step 12 Flow Step FLUSH**

```bash
#FLUSH Flow Step
```

**Step 13 Flow Step Powerscript**

This is where things get trickly.  We are still only working on the $local object.  This means that we need the values to persist.

In this step we should only have one row for each **UserGroup** field.  Each of these rows will have other fields that contain arrays of all the security fields and values.  We are going to store all of this information in a new Key on the $local object called **final**

NOTE that we store the User Group and value fields each time a new groupKey1 is encountered, HOWEVER, we only store the other field ONCE.  This is because the other fields are actually associated with the Field Values.  

For example, the field description might be "AD Can Open Something" and it will have "answers/values" for each user group.

These are the keys we will create on the final object.

- $local.final.fieldDesc_FINAL
- $local.final.screen_FINAL
- $local.final.fieldLabel_FINAL
- $local.final.attributeNum_FINAL
- $local.final.alias_FINAL

**Post Aggregation**

```javascript
// Get the group keys you defined in your Calc aggregations Powerscript
groupKey1 = $record.groupKey1

// GROUP KEY 1
if (!$local[groupKey1].GroupSet) {
  // Create a persistant "final" key on the local object
  $local.final = { ...$local.final, [`${groupKey1} Group`]: [] }
  $local.final[`${groupKey1} Group`] = $local[groupKey1].value;
  if (!$local.fieldDescDone) {
    $local.final.fieldDesc_FINAL = $local[groupKey1].desc 
    $local.final.screen_FINAL = $local[groupKey1].screen 
    $local.final.screenOrder_FINAL = $local[groupKey1].screenOrder     
    $local.final.fieldLabel_FINAL = $local[groupKey1].label 
    $local.final.attributeNum_FINAL = $local[groupKey1].attributeNum
    $local.final.alias_FINAL = $local[groupKey1].alias     

    $local.fieldDescDone = true
  } 
    
  $local[groupKey1].GroupSet = true; //Setting to true means we will not excute this code again during the load.
} else { 
  $omit()
}
```

**Step 14 Flow Step FLUSH**

```bash
#FLUSH Flow Step
```

**Step 15 Flow Step Powerscript**

In this last Powerscript, the code loops over the keys in the final object and assigns them to an actual Record.   We just need to loop through and assign value in the keys to a $record name with the Key for each Key.

**Final Processing**

```javascript
if (!$local.stopProcessing) {
    for (key of Object.keys($local.final)) {
      $record[`${key}_VIEWFINAL`] = $local.final[key]
    }
    $local.stopProcessing = true
} else {
    $omit()
}
```

**Step 16 Flow Step Normalize**

The last step is to normalize your single row, which is now just Arrays.

You will want to select all the field that end with `VIEWFINAL`.  

**Step 17 Choose Columns**

The final step is to choose the columns to display.  The easiest way to do this, is to click on the Columns and, the same way you chose the fields in the Normalize step, search for `VIEWFINAL` and choose those fields.