# Capacity Calculator (Concept)

This document describes a simple capacity and cost calculator aligned with the
\"Cost Modeling & Capacity Planning\" module.

Suggested inputs:

- Number of users.
- Requests per user per day.
- Peak factor.
- CPU time (ms) per request.
- Average payload size.
- Logs per request (lines or KB).

Suggested outputs:

- Peak RPS.
- Estimated vCPU required (with safety factor).
- Estimated log volume per day.
- Rough egress estimates.

You can implement this as a spreadsheet or as code under the course repository.

