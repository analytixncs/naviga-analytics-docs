---
id: metadata-jobs-average-run-time
title: METADATA-Jobs Average Run Time
sidebar_label: METADATA-Jobs Average Run Time
---

# METADATA-Jobs Average Run Time

**Type:** Informer Metadata

Calculates average Job runtimes

:::info METADATA-Jobs Average Run Time Downloads

Calculates average Job runtimes

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/metadata-jobs-average-run-time.tgz">METADATA-Jobs Average Run Time</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/metadata-jobs-average-run-time.json">metadata-jobs-average-run-time.json</a>

:::

## Summary

Reads the Informer Metadata datasource and returns the Average run time for each job.  It does this by examining all of the job runs via the Job History table and then aggregating and averaging the run times.  We throw away all the detail rows that go in to make up the average calculations.  If you need this data,  you can modify the Powerscript to not $omit that detail data.
### Mean and Median

You can use the mean and median as your primary measures of job performance.  The other statistics can be used to better understand how outliers and variations in run times affect those values.

- **Mean (Average):** The mathematical average calculated by dividing the total execution time across all runs by the run count. It offers a quick baseline of overall workload, though it can easily be distorted by extreme outliers such as sudden timeouts or aborted tasks. Use this alongside median to gauge overall skew.
    
- **Median (P50):** The middle execution time when all runs are arranged from fastest to slowest. Exactly half of all jobs complete faster than this mark, making it resistant to rare delays or early failures. It represents what users should expect as a truly typical runtime.

## Notes

Here are some notes on the statistics that are returned by this report.
### Interquartile Range (IQR) — "The Normal Window"

The **Interquartile Range (IQR)** is the width of the middle 50% of your data.

* **How it works:** Take your 75th percentile ($P_&#123;75&#125;$) and subtract your 25th percentile ($P_&#123;25&#125;$).
* **Analogy:** Imagine trimming off the lowest 25% of scores (the flukes or quick fails) and the top 25% of scores (the network freezes or hung tasks). What remains is the core bulk of typical executions.
* **Why it matters:** Outliers don't touch it. Even if a job stalled for three days, the IQR wouldn't shift at all. It tells you exactly how tight the typical experience is.
* **From your data:**
* $P_&#123;25&#125; = 305.7\text&#123;s&#125;$
* $P_&#123;75&#125; = 318.5\text&#123;s&#125;$
* $\text&#123;IQR&#125; = 12.8\text&#123;s&#125;$
* **Translation:** Most normal runs complete within a very predictable window of less than 13 seconds.

---
### Standard Deviation — "The Average Wobble"

**Standard Deviation** measures how far individual data points wander from the average (mean).

* **How it works:** It calculates the distance between every single data point and the mean, squares them, averages those squares, and takes the square root.
* **Analogy:** Think of standard deviation as the predictability score.
* **Low standard deviation:** Runs are clustered tightly around the average (like trains that consistently arrive within 30 seconds of their schedule).
* **High standard deviation:** Runs are scattered widely all over the board (like a bus that might show up in 2 minutes or 45 minutes).
* **The Catch:** Because standard deviation relies on the mean and squares the differences, **extreme values inflate it dramatically**.

---
### Skewness — "The Tail Direction"

**Skewness** is a single number that tells you whether your distribution is symmetric (like a classic bell curve) or lopsided.

```text
Negative Skew (Left-skewed)       Symmetric               Positive Skew (Right-skewed)
  Long tail to the left           Balanced                  Long tail to the right
      ________/\                _____/\_____                /\________
_____/          \             _/            \_             /          \_____

```

* **Near 0:** The data is balanced. Runs are distributed evenly around the center.
* **Positive (&gt; 1.0) — Right-Skewed:** Most jobs finish quickly, but a handful stretch into long delays, creating a "tail" dragging out to the right. This is typical for server requests (most finish in 100ms, but a few take 8,000ms).
* **Negative (&lt; -1.0) — Left-Skewed:** Most jobs take a consistent amount of time, but a few abort or finish much earlier than expected, creating a "tail" dragging out to the left.
* **Example:**
* If your skewness was **$-2.03$**.
* That strong negative number immediately tells you: *"Most runs hover around the normal 5-minute plateau, but a few quick runs are pulling the distribution far to the left."*

---
### Quick Comparison

| Metric       | What Question It Answers                          | Resilient to Outliers?                       | Best Used For                                                                       |
| ------------ | ------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------- |
| **IQR**      | "How wide is the middle, normal run-time window?" | **Yes** (ignores top/bottom 25%)             | Setting user expectations for a standard execution window.                          |
| **Std Dev**  | "How much overall variance is in the system?"     | **No** (heavily affected by flukes)          | Gauging queue/infrastructure stability when data is normally distributed.           |
| **Skewness** | "Is the average being distorted to one side?"     | **No** (measures the pull of those extremes) | Automated alerts (e.g., flagging that the average runtime is currently misleading). |
### Percentiles In Depth

A **percentile** shows how a value compares with the other values in a dataset. For example, when analyzing job run times, percentiles show how long jobs typically take and how long slower runs may take.

The percentile indicates the percentage of values that **fall at or below** a given point.
#### Example: Test Scores

A score in the 85th percentile does not mean you answered 85% of the questions correctly. It means you scored higher than approximately 85% of test takers.

The same concept applies to job run times. If a job's run time is at the 90th percentile, approximately 90% of runs finished in that amount of time or less.

#### Common Percentiles for Job Run Times

**50th Percentile (P50) — Median**
The P50 is the midpoint of the data. Half of the runs finished in less time, and half took longer.

**Why it matters:** The median provides a useful measure of typical performance because a small number of unusually fast or slow runs have less influence on it than they do on the average.

**25th and 75th Percentiles (P25 and P75)**
- **P25:** Approximately 25% of runs finished in this amount of time or less.
- **P75:** Approximately 75% of runs finished in this amount of time or less

The range between P25 and P75 contains the middle 50% of run times. This is known as the _interquartile range (IQR)_ and helps show how much run times vary under normal conditions.

**90th and 95th Percentiles (P90 and P95)**

- **P90:** Approximately 90% of runs finished in this amount of time or less.
- **P95:** Approximately 95% of runs finished in this amount of time or less.

These percentiles help identify slower runs and establish realistic performance expectations. For example, if the P95 is 5.5 minutes, approximately 95% of runs finish within that time.
#### Example: Analyzing Job Run Times

Consider a dataset containing 21 job runs. The average run time was 286 seconds, or approximately 4.8 minutes.

| Metric       | Run Time      | Interpretation                                       |
| ------------ | ------------- | ---------------------------------------------------- |
| P25          | 305.7 seconds | Approximately 25% of runs finished within this time. |
| P50 (Median) | 314.7 seconds | Half of runs finished within this time.              |
| P75          | 318.5 seconds | Approximately 75% of runs finished within this time. |
| P95          | 331.8 seconds | Approximately 95% of runs finished within this time. |

**What the Results Tell Us**

The middle 50% of runs completed between 305.7 and 318.5 seconds—a difference of just 12.8 seconds. This indicates that most runs in the middle of the distribution had consistent execution times.

The average of 286 seconds is lower because three runs completed in less than 105 seconds, pulling the mean down.

In this example, the median of approximately 315 seconds provides a better indication of a typical run than the average. The P95 of approximately 332 seconds also shows that nearly all runs completed in about 5.5 minutes or less.

**The key takeaway:** Percentiles provide a clearer picture of job performance than the average alone. They help distinguish typical run times from unusually fast or slow runs and provide a useful basis for monitoring performance over time.

## Description
Calculates average Job runtimes

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Owner | ownerId | keyword_text |  | User who owns the Job |
| Id | id | keyword_text |  | Job Id |
| Name | name | keyword_text |  | Job Name |
| Interval | interval | keyword_text |  | The actual CRON definition using Vixie-style (POSIX).  Even if the user has chosen a predefined Interval Type like Hourly, a CRON definition is still created. |
| Interval Type | intervalType | keyword_text |  | Informer Interval type:\nMinutes, Hourly, Daily, Weekly, Monthly, Yearly or Custom |
| Total Run Count | TotalRunCount | double |  | The total number of times that this Job was run.  This is a field created by our aggregation run and is used to calculate the average runtime values. |
| Total Run Seconds | TotalRunSeconds | double | ✓ | The total runtime in seconds of all the job runs.  This is a field created by our aggregation run and is used to calculate the average runtime values |
| Mean Run Seconds | meanRunSeconds | double |  | The mathematical average calculated by dividing the total execution time across all runs by the run count. It offers a quick baseline of overall workload, though it can easily be distorted by extreme outliers such as sudden timeouts or aborted tasks. Use this alongside median to gauge overall skew. |
| Median Run Seconds | medianRunSeconds | double |  | The middle execution time when all runs are arranged from fastest to slowest. Exactly half of all jobs complete faster than this mark, making it resistant to rare delays or early failures. It represents what users should expect as a truly typical runtime. |
| Min Run Seconds | minRunSeconds | double |  | The fastest run time in seconds |
| Max Run Seconds | maxRunSeconds | double |  | The slowest run time in seconds |
| Pct25 Run Seconds | pct25RunSeconds | double |  | The runtime threshold that 25% of jobs finish within, representing the faster quarter of executions. It marks the lower boundary of normal operational speed. Runs completing faster than this are unusually swift or may have bypassed normal processing steps. |
| Pct75 Run Seconds | pct75RunSeconds | double |  | The runtime threshold within which 75% of runs successfully complete. It marks the upper boundary of typical operational behavior. If a job runs longer than this value, it is entering the slower quartile of executions. |
| Pct90 Run Seconds | pct90RunSeconds | double |  | The threshold under which 90% or 95% of all job runs finish. These metrics represent near-worst-case operational performance while filtering out total system freezes. |
| Pct95 Run Seconds | pct95RunSeconds | double |  | The threshold under which 90% or 95% of all job runs finish. These metrics represent near-worst-case operational performance while filtering out total system freezes.  |
| Variance Seconds | varianceSeconds | double |  |  |
| Std Dev Run Seconds | stdDevRunSeconds | double |  | The square root of variance, measuring how far run times typically stray from the mean in actual seconds. A low value indicates that execution times are tightly clustered and predictable. A high value indicates erratic runtime behavior across execution cycles. |
| Iqr Seconds | iqrSeconds | double |  |  |
| Last Run Date | LastRunDate | date |  | Last run date of this Job |
| Mean Run Minutes | meanRunMinutes | double |  |  |
| Median Run Minutes | medianRunMinutes | double |  |  |
| Min Run Minutes | minRunMinutes | double |  |  |
| Max Run Minutes | maxRunMinutes | double |  |  |
| Pct25 Run Minutes | pct25RunMinutes | double |  |  |
| Pct75 Run Minutes | pct75RunMinutes | double |  |  |
| Pct90 Run Minutes | pct90RunMinutes | double |  |  |
| Pct95 Run Minutes | pct95RunMinutes | double |  |  |
| Variance Minutes | varianceMinutes | double |  |  |
| Std Dev Run Minutes | stdDevRunMinutes | double |  |  |
| Iqr Minutes | iqrMinutes | double |  |  |
| Enabled | enabled | boolean |  | Is this job enabled if so, true |
| Total Successful Runs | TotalSuccessfulRuns | double |  | Total number of successful runs |
| Job State | jobState | keyword_text |  | State of Job<br />"running"<br />"failed"<br />"queued" |
| History Success | history_success | boolean |  | Indicating if this job was successful. |
| Timezone | timezone | keyword_text |  |  |

## Flow

| # | Step | Detail |
|---|------|--------|
| 1 | Script: Calc Job durations |  |
| 2 | Script: Aggr | **Used Saved Functions**<br />naviga.calculateAggregates |
| 3 | Flush |  |
| 4 | Script: Post Aggr | **Used Saved Functions**<br />naviga.statsCalculation |
| 5 | Dataset join | jobState |
| 6 | Script: Clean up Job State | We are getting jobState from the Job Status dataset<br />That dataset only has the Jobs run for the last day<br />If a job doesn't show up in our join we will set the jobState below |
| 7 | Remove fields | groupKey1, history_createdAt, history_updatedAt, durationSeconds |
