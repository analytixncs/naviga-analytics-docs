---
id: informer-templates
title: Informer Templates 
sidebar_label: Informer Templates
---

A Template is customizable format for viewing and exporting data. Using HTML for the layout, you can create different formats for displaying your data, including mail merge letters, itemized invoices, calendars, and more. 

Informer uses a templating language called [Nunjucks](https://mozilla.github.io/nunjucks/) to inject data into placeholders in the completed HTML Template. 

Templates can be viewed as a webpage or exported to PDFs for easy sharing.

> NOTE: In version 5.4 of Informer, Templates are still an **Experimental** feature.  Use at your own risk!

## Parts of a Template

As with any HTML file, there are a number of other files that can play a role in the formatting and building of the template file.

Here is a view of these parts within the Informer Template Editor:

![image-20210908130731972](..\assets\informer_templates_001.PNG)

The core file is the `template.njk` file.  This contains the main HTML for the the template.

The `helpers.js` file is always included from Entrinsik.  It allows you to create functions, etc to enhance your template.

> NOTE: The functions in the helpers.js file can accept and return values, but cannot run `console.log` or `alert` functions.  

**Assets**

The **Assets** section contain any additional files that you want to include in your template file.  The `style.css` file is created and included by default.

The `testScript.js` is a sample that I created.  In contract to the helpers.js file, you CAN run `console.log` and `alert` functions from asset JS files.

If you have a JavaScript file you want include in your template, you add the following line to your \<head\> section:

`<script type="text/javascript" src="{{ url('testScript.js')}}"></script>`

**Inputs**

The **Inputs** section will allow you to create prompts for any of the Processors that accept inputs.

**Processors**

The **Processors** section is where you declare the Ad Hoc Reports and/or Datasets that will be used in the template.

You can also include Powerscripts that will act on the data coming from the processors.

## Context

The context is a JSON formatted set of information seen on the lower right hand side of the Template Editor.

Everything in the context is available to be shown in your template.  You access it using JavaScript Object Notation.

Here is the basic structure of the Context:

```json
{
  "user": { ... },
  "session": { ... },
  "inputs": {},
  "mrmAdSalesreps": {
    "query": { ... },
    "records": [
      {
        "campaignId": "6709",
        "repName": "Frank Repman",
        "salesreps_assoc_repName": "Frank Repman"
      },
      ...
    ]
  }
}
```

The `user`, `session`,  and `input` are standard items that are present in all templates.  The `mrmAdSalesreps` is a dataset that I added to the Processors sections.

The **important** piece that you will be using in your templates is the `records` array.  It is just that, all the records returns by the query.

In you template to access the first record you would:

```html
<div>
  {{ mrmAdSalesreps.records[0].repName }}
</div>
```

Since records is an Array, you would need to call out which record you wanted.

However, as you will see, using the Nunjucks syntax, you will be able to **loop** over the records, making it easier to access all of the records.

## Template Syntax

The Templating engine being used is  [Nunjucks](https://mozilla.github.io/nunjucks/) by Mozilla.  It is best to read their documentation for full information.  This guide will review the basics needed to get information formatted.

**Sample Template**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="{{ url('style.css')}} ">
    <script type="text/javascript" src="{{ url('testScript.js')}}"></script>

<body>
    <div class="container">
        <div class="header">
            <div>Logo Holder</div>
            <div>Custom Info</div>
        </div>
        <div>{{ user.displayName }}- {{session.os}}</div>


        <div> {{ mrmAdSalesreps.query.name}}</div>
        {% for rep in mrmAdSalesreps.records %}
        <div
            style="margin-bottom: 2px; display: flex; flex-direction: row; justify-content: space-between; width: 80%; border: 1px solid black">
            <div> {{ rep.repName}}</div>
            <div> {{ rep.Rep_Total}} </div>
        </div>
        {% set theRep = rep.repName %}
        <script>
        {# function from a js file in the Assets area #}
            testFunction('{{rep.repName}}');
        </script>
        {% endfor %}
        {% set samplenjkVariable=mrmAdSalesreps.records[0].repName %}
        {{ myFunction() }}
    </div>
    <script>
        testFunction();
        console.log('{{ samplenjkVariable }}');
    </script>

</body>

</html>
```

## Inject Data into JavaScript Assets

The scenario is that you want to access the data that is stored in Context within your own JavaScript scripts in the Assets section.

You will find that if you try to send and Object or Array from within a `script` tag, you will just get the string `[object, object]`.

### Option 1

The workaround is to create a couple of filter functions in the **helpers.js** file that will stringify the array or object:

**helpers.js**

```Javascript
function stringifyData(data) {
    return JSON.stringify(data)
}
```

Then when you pass your data to your function use the following syntax:

**template.njk**

```html
<html>    
  <script>
    createChart('{{ mrmAdSalesreps.records | stringifyData | safe }}')
  </script>
</html>  
```

Lastly, within the function that you call with this data, you must parse the stringified data back into a JavaScript "Object".

**Assets/chart.js**

```javascript
function createChart(dataIn) {
    chartData = JSON.parse(dataIn)
    ....
}
```

### Option 2

The other option is to stringify the data via a Powerscript and store in the context.  Then you can skip the `stringify` filter step.

This will create a new context entry called myRecords.

```javascript
$ctx.myRecords = JSON.stringify($ctx.mrmAdSalesreps.records)
```

You will still need to run the `safe` filter and parse the data:

```html
<html>    
  <script>
    createChart(JSON.parse()'{{ myRecords | safe }}'))
  </script>
</html>  
```



