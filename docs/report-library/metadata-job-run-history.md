---
id: metadata-job-run-history
title: METADATA-Job Run History
sidebar_label: METADATA-Job Run History
---

# METADATA-Job Run History

**Type:** Informer Metadata

Historical data for jobs that have run

:::info METADATA-Job Run History Downloads

Historical data for jobs that have run

**Bundle (TGZ):** <a target="_blank" href="/downloads/report-library/metadata-job-run-history.tgz">METADATA-Job Run History</a><br />
**Definition JSON:** <a target="_blank" href="/downloads/report-library/metadata-job-run-history.json">metadata-job-run-history.json</a>

:::

## Summary

This dataset will show the last 10 days of Job run history.

## Description
Historical data for jobs that have run

## Fields

| Label | Alias | Type | Hidden | Description |
|-------|-------|------|--------|-------------|
| Job Id | jobId | keyword_text |  | Main Job Id |
| Job History Id | id | keyword_text |  | History Job Id.  Each job run gets a unique Id |
| Created At | createdAt | date_tz |  | Date the history record was created |
| Updated At | updatedAt | date_tz |  | Date the history record was updated.  Each run gets update every minute or so.  Most of these history records will not be for actively running jobs, the updated At will be considered the end time of the job. |
| Success | success | boolean |  | true = job finished successfully |
| Warnings | warnings | boolean |  | Were there any warnings |
| Progress | progress | object |  | JSON object showing each step of the job and the outcome.  We are using the last entry to pull the error message if the job failed. |
| Error Message | errorMessage | keyword_text |  | Text error message if the job failed (Success = false) |

## Criteria

- **Created At** is on or after TODAY - 10d

## Flow

| # | Step | Detail |
|---|------|--------|
| 1 | Script: Pull Error Message | If not running, check to see if this job has a failure message and if so put in $record.errorMessage |
