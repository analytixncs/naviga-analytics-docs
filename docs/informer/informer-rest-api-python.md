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

Getting the data into a pandas dataframe is a good start.

There are many Panda methods that ingest data, but if we have used our API and returned the data into a variable that has the data as a dictionary, we can use the `from_dict` method.

```python
## resultData will contain a dictionary of only the data we want
## read results into Pandas dataframe
df = pd.DataFrame.from_dict(resultData)

```



