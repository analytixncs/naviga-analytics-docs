---
id: informer-lookup-generator
title: Informer Lookup Generator
sidebar_label: Informer Lookup Generator
---



## Lookup Function Generator

import LookupFunction from '@site/src/components/lookupFunction/';

The **Lookup Function Generator** below allows you to create the pieces needed for a **Lookup Function** that can be used in your Powerscripts.

:::caution 

While there is no limit to the number of `code/value` pairs you can create, this function is best suited for a smaller number of `code/value` pairs and also, pairs that don't change much over time.  However, if needed, updates to the function are not difficult.

::: 

Where might you need something like this?  Think of any place where you might use an VLOOKUP in excel.  This function would do something similar. 

Another scenario would be when you need to group items at a higher level.  For example, you may want to group your Ad Types into a higher level of categorization.  You could do this with something like:

| Code       | Value        |
| ---------- | ------------ |
| ADTYPE_1   | Category One |
| ADTYPE_2   | Category One |
| ADTYPE_3   | Category Two |
| ADTYPE_... | Category ... |

To use the Generator below, you will need to enter the following:

- **Function Name** - This name is how you will "call" your function in Powerscript.
- **Code/Value Pairs** - The `code` value is what you will "send" to your function in your Powerscript.  You will be returned the `value` .

You can either enter you `code/value` pairs individual in the available input boxes OR paste in a string with the `code` and `value` delimited by a **comma** or **tab**, with each pair separated by a new line.

If you build your pairs in excel, just copy and paste into the input box:

![img](C:/Users/Markm.000/Documents/GitHub/naviga-analytics-docs/docs/informer/images/informer-sample-reports_function-generator_001.PNG)

### Creating the Function in Informer

The below generator cannot create the saved function for you, but it gives you all of the pieces to be able to do it yourself.

<LookupFunction />