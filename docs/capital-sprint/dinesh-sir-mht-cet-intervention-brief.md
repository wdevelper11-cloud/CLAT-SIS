# Dinesh Sir Live Study: MHT-CET Maths Cohort Intervention Brief

## Scope and boundary

This is a targeted Student Intelligence System (SIS) operating brief for an MHT-CET Maths test-series cohort. It is based only on Dinesh Sir Live Study's public catalogue of courses and self-evaluation test series. It does **not** use learner data or claim that any current student workflow is inadequate. The sample student names and scores below are illustrative.

## What I noticed

Dinesh Sir Live Study publicly offers MHT-CET Maths live courses, study material, and test series for self-evaluation. Once a test series grows, the operational question changes from “who scored low?” to “which learner needs which action this week, and who owns it?” I could not see a public, per-topic intervention layer, so I treated it as an opportunity to validate—not as a missing-feature claim.

## What I built

I designed a compact weekly intervention view that turns test data into a simple counsellor and educator queue. It does not need a new product: one cohort, one input sheet, and a repeatable decision rule are enough to test whether SIS produces useful actions.

### Minimal inputs after each test

| Signal | Why it matters |
| --- | --- |
| Mock score and percentile | Separates overall result from subject-specific weakness. |
| Topic accuracy and questions attempted | Distinguishes a knowledge gap from a speed/attempt gap. |
| Change versus the previous two tests | Finds declining momentum before the final revision window. |
| Last resource used | Lets the follow-up recommend the relevant replay, practice set, or live doubt session. |
| Mentor/counsellor owner | Makes one person responsible for the next action. |

### Intervention rules

| Risk level | Trigger | Action within 24–48 hours |
| --- | --- | --- |
| Red | Topic accuracy under 55% **and** at least 12 attempted questions, or a drop of 15+ points across two tests. | Personal callback; assign one replay and 20-question corrective set; book the next doubt session. |
| Amber | Topic accuracy 55–70%, or high accuracy with low attempts. | Send the precise topic resource and timed 12-question retest. |
| Green | Accuracy above 70% with stable or improving trend. | Assign mixed challenge set; no individual counsellor action needed. |

### Illustrative cohort queue (fictional data)

| Learner | Latest mock | Trend | Weak signal | Risk | Owner | Next action |
| --- | ---: | ---: | --- | --- | --- | --- |
| Student A | 46/100 | -18 | Definite Integration: 42% on 14 attempts | Red | Counsellor 1 | Call, replay module 7, 20-question retest by Friday. |
| Student B | 58/100 | -4 | Vectors: 74% but only 6 attempts | Amber | Mentor 2 | Timed Vectors set; review pacing in next doubt session. |
| Student C | 71/100 | +6 | Probability: 78% on 15 attempts | Green | — | Mixed PYQ challenge set. |
| Student D | 52/100 | -16 | Matrices: 51% on 16 attempts | Red | Counsellor 3 | Call, short diagnostic, targeted revision plan. |
| Student E | 63/100 | +2 | Differentiation: 66% on 18 attempts | Amber | Mentor 1 | Send practice set; verify improvement after the next mock. |

### One weekly operating loop

1. Import the latest test-result sheet after the mock.
2. Generate the red/amber/green queue by topic and trend.
3. Assign only red and amber learners to a named person.
4. Log the intervention and the next-test outcome.
5. Review the batch-level pattern: which topic, cohort, or resource needs an educator response.

This produces both learner-level help and a management view: **what is happening, who owns the next action, and whether it worked**.

## What it improves

The proof replaces a generic score list with a decision layer. Counsellors have a small, prioritised queue instead of a spreadsheet of names; educators see recurring topic failures; and the institute can measure time-to-action and next-test recovery before investing in a larger SIS rollout.

## Small paid-pilot shape

Start with one MHT-CET Maths test-series batch for two weeks. Use existing exported test data, agree the red/amber rules with an academic lead, and review: (1) percentage of at-risk learners contacted, (2) time from result to action, and (3) topic-level recovery in the following test. No learner data is used outside the institute, and no automation is added until the workflow proves useful.

## Proof link

This document is the proof: a bounded operational design that can be reviewed before any SIS build or data access is discussed.
