---
id: informer-system
title: Informer System Stuff
sidebar_label: Informer System Stuff
---

## Setting up Informer Postgres Database as Datasource

> NOTE: The information below is for **Informer 5.1.2 or greater only** 

Download the following TGZ file to your hard drive: 

**[Informer5--5.1.2OrLater.tgz](../assets/downloads/informer/Informer5--5.1.2OrLater.tgz)**

This file has all the information needed to create the Datasource, mappings, and sample Datasets.

Once downloaded, navigate to the **Datasource** page within Informer.

Simply drag and drop the downloaded *tgz* file onto this page:

![image-20200501151233660](..\assets\informer-system_metadata-001.png)

You will then be presented with a dialog where you can enter the new Datasource information.



![image-20200501151711846](..\assets\informer-system_metadata-002.png)

1. **Datasource Name** - Can be anything, but Informer5 makes sense.
2. **Server and Port** - You will need to get this information from whoever setup the Informer instance.  There is a **config.json** file that will be on the server with this information, usually found in `C:\Entrinsik\Informer5`
3. **User  and Password** - You will need to get this information from whoever setup the Informer instance.  
4. **Database** - You must use **Informer5**

![img](..\assets\informer-system_postgreDB.PNG)

Then click **Save** and the Informer5 Datasource will be created along with all the mappings and nine sample Datasets.

To keep things organized, go to the Datasets page and find the nine Datasets just created, they will be found by looking for ones with the Datasource of "Informer5".

Create a new Folder called **Informer_System** and move these nine Datasets into it.

### Job Status Dataset

There is not a Job Status sample Dataset, it is pretty easy to build your own, but here is a sample one.

[Sample Job Status Dataset Bundle](../assets/downloads/informer/job-status.tgz)



