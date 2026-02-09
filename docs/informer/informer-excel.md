This video demonstrates how to create a dynamic Excel file that links to an Informer data set using Power Query. By setting up input variables for a start and end date, you can customize the data pulled from the API.

## **Steps to Pull a Dynamic Dataset in Excel**

![image-20260202145810815](C:\Users\Markm.000\Documents\GitHub\naviga-analytics-docs\docs\informer\images\DynamicFilterExcel.png)

1. **Prepare the Input Cells:**
   - Create labels for "Start Date" and "End Date" in your spreadsheet.
   - Format the adjacent cells as **Text** to ensure the query interprets the dates correctly.
   - Enter your initial dates in `YYYY-MM-DD` format.
2. **Define a Named Range:**
   - Highlight the two cells containing your dates.
   - Right-click and select **Define Name**.
   - Name the range (e.g., `dateCells`) and click OK.
3. **Connect to the Web Source:**
   - Go to the **Data** tab, select **Get Data** > **From Other Sources** > **From Web**.
   - Enter your base Informer API URL and click OK.
4. **Configure the Power Query:**
   - In the Power Query Editor, go to the **View** tab and open the **Advanced Editor**.
   - Update the M language script to reference your named range (`dateCells`) and pull the start and end dates into variables.
   - Construct a `filterString` using an Elasticsearch range filter for the `dateEntered` field.
   - Use the `Json.Document` and `Web.Contents` functions to combine the base URL, filter, and authentication token.
5. **Adjust Privacy Settings:**
   - If you encounter security errors, navigate to **File** > **Options and Settings** > **Query Options**.
   - Under **Privacy**, select **Ignore the Privacy Levels** for the current workbook.
6. **Convert and Load the Data:**
   - Once the records are visible, click **To Table** in the Transform tab.
   - Expand the columns to show all desired fields.
   - Click **Close & Load** to bring the data into your spreadsheet.
7. **Refresh Dynamically:**
   - To change the data, update the start or end dates in your Excel sheet.
   - Right-click the query in the **Queries & Connections** pane and select **Refresh** to update the results.



## Sample M formula language

```
let
    // 1. Pull the Named Range table
    Source = Excel.CurrentWorkbook(){[Name="dateCells"]}[Content],
    
    // 2. Extract specific rows (Row 0 for Start, Row 1 for End)
    Start = Source{0}[Column1],
    End = Source{1}[Column1],

    BaseUrl = "https://devbi.navigahub.com/api/datasets/devdigital:naviga-ad-internet-orders-starter/export/json",
    
    // Notice we only use single pairs of double-quotes here because 
    // M-code needs them to define the string, but we want the result 
    // to have actual quotes for the JSON.
    FilterString = "{""range"":{""dateEntered"":{""gte"":""" & Start & """,""lte"": """ & End & """}}}",
    
    token ="you token here",
    
    finalURL = Json.Document(Web.Contents(BaseUrl, [
        Query=[
            filter=FilterString,
            token=token
        ]
    ])),
in
    finalURL
```

