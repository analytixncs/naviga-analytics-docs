# Period Revenue Allocation

## Overview

This report is designed to allocate line-level revenue across financial periods. In Naviga, we allocate revenue based on calendar months.  If a customer has financial periods that do not follow calendar months, this report will help to show the revenue distribution based on their Financial periods.  It uses a combination of calculated fields, external data, PowerScripts, normalization, and aggregation steps to:

- Load all financial period spread records - These need to be loaded into a Workspace in Informer.  You can download and modify an extract from Naviga here -> `https://xxx.navigahub.com/EW/xxx/accounting/setup/period_maint`
- We load these into the report and store period metadata so we can calculate our period allocation
- Calculate daily line cost values
- Determine which financial periods each line spans AND how many days fall into our financial periods given the start and end dates of the line details.
- Expand multi-period results into individual rows - We may have lines that drop days into multiple financial periods.  For example if a period run over the month end date into the next month or ends before the end of the month a single line detail could contain days that fall into two separate financial periods.  We need to give each of the periods its own row.
- Since we have created output that will have a single line that could have more than one row in a financial period, we need to aggregate revenue by campaign, line, and financial period so that we are left with our revenue per financial periods.

------

## Flow Step Types

### 1. `outerjoin` (Calculated Field)

**Purpose:**
Creates a constant value of `1` so every row can join to all records in the `financial_period_spreads` datasource.

**What it does:**

- Returns a constant `1` 
- Matches against an `outerjoin` field in the `financial_period_spreads` External Data Workspace datasource
- Ensures all financial period spread records are pulled in

**Why it exists:**
This is used as a simple cross-join mechanism so the report can access the full set of financial period records.

------

### 2. Fields from Another Datasource

**Purpose:**
Brings in all records from the `financial_period_spreads` datasource and joins them to each row.

**What it does:**

- Matches against an `outerjoin` field created in the above step
- Ensures all financial period spread records are pulled in.  Will initially store on EACH row, but we will take care of this in later step.
- Pulls financial period spread fields into the flow
- Makes those fields available for later PowerScript processing

**Why it exists:**
The later steps need access to the financial period date ranges and period identifiers.

**Source note:**
The `financial_period_spreads` table is a copy of the data from:
`https://xxxtest.navigahub.com/EW/XXX/accounting/setup/period_maint`

------

### 3. `Store Local Var ...` (PowerScript)

**Purpose:**
Stores financial period data in a persistent `$local` array and calculates the line-level daily cost.

**What it does:**

- Creates a persistent array of objects on `$local`
- Stores all financial period spread information for later use
- Calculates `$record.lineCostPerDay` for each line row - We use a special helper function to calculate the net amount by looping through the act and est amount fields and apply the logic based on the campaign type to determine which field to use in net revenue.

**Why it exists:**
The financial period data is needed later in `Calc Days in Period`, and storing it once allows the joined fields to be removed from the output.

**Stored structure:**

```ts
type FinancialPeriod = {
  periodStart: string;   // YYYY-MM-DD
  periodEnd: string;     // YYYY-MM-DD
  daysInPeriod: number;
  periodText: string;    // YYYY-MM
}
```

**Primary outputs:**

- `$local.financialPeriods`
- `$record.lineCostPerDay`

------

### 4. Remove Fields

**Purpose:**
Removes the financial period spread columns from the output after their values have been stored in `$local`.

**What it does:**

- Cleans up the output dataset
- Prevents unnecessary columns from continuing through the flow

**Why it exists:**
Once the period data has been persisted in `$local`, the original joined columns are no longer needed.

------

### 5. Flush

**Purpose:**
Ends the first processing pass and starts the next phase of the flow.

**What it does:**

- Forces the current pass to complete
- Ensures all rows have finished calculating `$record.lineCostPerDay`

**Why it exists:**
The next steps depend on the first pass being fully complete before period allocation begins.

------

### 6. Normalize

**Purpose:**
Normalizes the month fields so the dataset is structured as one row per line detail.

**What it does:**

- Expands the data into a consistent row-level format
- Standardizes month-based detail records for later period calculations

**Why it exists:**
The allocation logic requires a normalized row structure before matching date ranges to financial periods.

------

### 7. `Calc Days in Period` (PowerScript)

**Purpose:**
Determines which financial periods each line detail overlaps and calculates the covered days and allocated revenue for each period.

**What it does:**

- Analyzes the line detail start and end dates
- Compares them to the financial period start and end dates stored in `$local.financialPeriods`
- Determines which financial periods the line detail belongs to
- Builds arrays containing the period allocation results

**Why it exists:**
A single line detail may span one or more financial periods, so this step calculates how the value should be distributed.

**Primary outputs:**

- `$record.calcPeriodText`
- `$record.calcDaysCovered`
- `$record.calcRevOfDaysCovered`
- `$record.calcPeriodStartEnd` 

**Important note:**
These outputs are arrays, because one line detail can map to multiple financial periods.

------

### 8. Normalize

**Purpose:**
Expands the arrays created in `Calc Days in Period` into separate rows.

**What it does:**

- Converts each array element into its own record
- Creates one row per calculated financial period allocation

**Why it exists:**
If a line detail spans multiple periods, each period must become its own row before aggregation can occur.

------

### 9. `Aggr` (PowerScript)

**Purpose:**
Begins aggregation so multiple rows for the same campaign, line, and calculated period can be combined.

**What it does:**

- Aggregates rows at the level of:
  - Campaign Id
  - Line Id
  - Calculated Period
- Aggregates the field:
  - `$record.calcRevOfDaysCovered` - 
  - `$record.'calcDaysCovered'` - This is the number of days in this period that was used to calculate the revenue

**Why it exists:**
After normalization, multiple rows may still exist for the same logical period grouping. This step starts rolling them up into a single row.

**Reference:**
Informer aggregate function documentation:
`https://naviga-informer-docs.netlify.app/docs/informer/informer-saved-functions#calculateaggregates---usage`

------

### 10. Flush

**Purpose:**
Required flush step for the aggregation process.

**What it does:**

- Finalizes the aggregation pass
- Prepares the flow for post-aggregation logic

**Why it exists:**
Informer aggregation requires a flush before downstream post-aggregation calculations can be finalized.

------

### 11. `Post Aggregation` (PowerScript)

**Purpose:**
Finalizes the aggregated output and creates the final total field.

**What it does:**

- Creates the final aggregated total field:
  - `$record.calcRevPerPeriod_Total` - revenue for this period based on the number of days that fell into the period.
  - `$record.calcDaysInPeriod_Total` - This is the number of days in this period that was used to calculate the revenue

**Why it exists:**
This is the final revenue-per-period value used in the report output.

------

## Flow Summary by Pass

### Pass 1: Load and Prepare Financial Period Data

1. `outerjoin` (Calculated Field)
2. Fields from Another Datasource
3. `Store Local Var ...` (PowerScript)
4. Remove Fields
5. Flush

### Pass 2: Calculate Period Coverage

1. Normalize
2. `Calc Days in Period` (PowerScript)
3. Normalize

### Pass 3: Aggregate Period Revenue

1. `Aggr` (PowerScript)
2. Flush
3. `Post Aggregation` (PowerScript)

------

## Key Outputs

### Local variables

- `$local.financialPeriods`

### Row-level calculated fields

- `$record.lineCostPerDay`
- `$record.calcPeriodText`
- `$record.calcDaysCovered`
- `$record.calcRevOfDaysCovered`
- `$record.calcPeriodStartEnd`
- `$record.calcRevPerPeriod_Total`

------

## Practical Result

At the end of this flow:

- Each line detail is matched to the financial periods it overlaps
- Revenue is allocated by number of days covered in each period
- Results are normalized and aggregated
- A final revenue-per-period total is produced for reporting