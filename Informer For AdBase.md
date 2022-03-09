# Informer For AdBase

## Organization of Datasets

Noticed that there are folders and tags that can be used to organize datasets.  Given that we are expecting/hoping end users will be creating their own reports, organizing our datasets will ease our development as well as the end users.

Thoughts:

- Tags to indicate if this is a BI or Core DB dataset.



## Datasets

Wondering if using Native SQL will give us better control over query optimization if needed and ability to test/modify datasets more easily since we can run the query to verify the data versus just see it in Informer.

However, if we use Native SQL, does it limit how the end users may interact with the dataset.

Some other possible issues on using the Informer dataset builder:

- How do we move that to each site? 
- If there is an issue, how do we push the change to each site.

### Native SQL - Views vs SQL

If we choose to go with Native SQL, the next question is do we paste SQL directly into the Native SQL Editor in Informer or use Views.

I can see pros and cons with both.  

- Views can be stored in the database.  This does "protect" the code, somewhat, from the users.  However, it is another object in our database to manage and maintain.  

Whether we use a View or SQL, we will need to maintain the source for the SQL in some sort of source control system.  I would recommend using GitHub for this source control.

### Informer Dataset Builder

The plus side with the Informer dataset builder is that we can define the 

## Filtering Datasets

You can create a filter while viewing the dataset and then save those filters with the dataset so that others can use them.

### Default Saved Filters

It might be useful for us to provide some common saved filters.  Not sure if filters can have prompts, but even if they don't there are most likely useful filters we could create.  

- Invoiced Only or Not Invoiced orders
- Order past deadline
- I'm sure customers may have suggestions.





## Source Control

Things to think about:

1. Source control - is there a way to keep a single version of the truth. 
2. Multiple Developers - Is there a way for multiple people to work on the source code at the same time?
3. Where/What is the source code.  
4. How do we push out fixes to the queries/datasets?  