---
id: informer-rest-api-python
title: Informer Rest API Python
sidebar_label: Informer Rest API Python
---

## Requests in Python

You will need to import the **requests** library to be able to make an API Request.

```python
import requests

## token for DevDigital.[API]-User Reports-Rep Rev Raw
apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1ZmRlZTE1NC04NGY0LTQ2OTItYWJmMC1iODdhNGMwMzUxOTUiLCJpYXQiOjE2NDYwNjQ1MjkuMDh9.FhpDL7skGdYysXFJv8iIKaXqSsxjc1LFtUL3gaLyyx8"
## Api route for DevDigital.[API]-User Reports-Rep Rev Raw
apiRoute = "https://devbi.navigahub.com/api/datasets/3365bc89-6b99-483e-8c5c-10aea851431b/export/json"

## use requests module to "get" the response
response = requests.get(f'{apiRoute}?token={apiToken}')
## The route called returns ONLY the dataset data in JSON format
## Call the .json() function to convert to python dictionary
resultData = response.json()
```

### Using a POST request

To do a dataset refresh, you will need to do a POST request

```python
## token for DevDigital.[API]-User Reports-Rep Rev Raw
apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1ZmRlZTE1NC04NGY0LTQ2OTItYWJmMC1iODdhNGMwMzUxOTUiLCJpYXQiOjE2NDYwNjQ1MjkuMDh9.FhpDL7skGdYysXFJv8iIKaXqSsxjc1LFtUL3gaLyyx8"
## Refresh of the DevDigital.[API]-User Reports-Rep Rev Raw dataset
postApiRoute = "https://devbi.navigahub.com/api/datasets/3365bc89-6b99-483e-8c5c-10aea851431b/_refresh"
authHeader = {'Authorization': 'Bearer ' + apiToken}
postResponse = requests.post(postApiRoute, headers= authHeader)

print (postResponse)		
```



## Pandas

### Ingesting Data (Loading a Dataframe)

Getting the data into a pandas dataframe is a good start.

There are many Panda methods that ingest data, but if we have used our API and returned the data into a variable that has the data as a dictionary, we can use the `from_dict` method.

```python
## Call the .json() function to convert to python dictionary
resultData = response.json()
## resultData will contain a dictionary of only the data we want
## read results into Pandas dataframe
df = pd.DataFrame.from_dict(resultData)

```

If you want to ingest the output from Informer's `csv` exporter API, then you would need to convert the resulting CSV data into a string buffer.

```python
## the function to covert to string buffer lives in the io package
import io

## convert the csv output, which is in the response objects "text" property
csvtoread = io.StringIO(response.text)
## Ingest with pandas
df = pd.read_csv(csvtoread)
df.head()
```

> NOTE: I found that when ingesting JSON data, pandas did not "see" the number data types and called everything an object.  Using the CSV option, pandas "saw" the numbers and called the float64 types.

### Changing Header Names

This is most easily done when creating the dataframe using the read_csv function:

```python
## convert the csv output, which is in the response objects "text" property
csvtoread = io.StringIO(response.text)
## rename columns -- NOTE: must be an exact match for number of columns!
names = ["repName","period","RevenueDate","repNetCost","repPct","netCost","confirmedDate","status","line_id","advName","campaignType","campaignDesc","description","repMv","intStartDate","campaignId","lastChangedDate","LineNetAmount"]
## Ingest with pandas
df = pd.read_csv(csvtoread, names=names)
```



### Useful commands (df = dataframe object)

[Pandas Docs on Dataframes](https://pandas.pydata.org/docs/reference/frame.html)

**df.head()** - Shows you the first 5 rows of data

**[df.info()](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.info.html?highlight=info#pandas.DataFrame.info)** - This method prints information about a DataFrame including the index dtype and columns, non-null values and memory usage.

[**df.dtypes**](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dtypes.html) - This returns a Series with the data type of each colum



## Jupyter Notebooks

Jupyter notebooks drops you into your user directory by default.  If you save your notebooks in a different drive, you can change it by starting up Jupyter in that drive.

Simply open a command prompt, navigate to the location of your notebooks and type `jupyter notebook`.
