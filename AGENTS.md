# Working on wewantdrought

Read `docs/project-charter-draft.md`, especially Section 13, before acting. Read `docs/design-philosophy.md` for visual direction. The user owns engineering decisions and wants to build and learn with the agent.

## Mandatory behavior

- Explain the purpose and scope of every action before taking it. Read-only inspection must not turn into edits.
- Before implementation, explain the concrete step, files and commands, relevant concepts, Rain's action, the agent's action, expected result, verification, and stopping point.
- Wait for explicit authorization of that bounded implementation step. Agreement with a stack or design is not authorization to build. In a discussion, “looks good,” “makes sense,” and “let's move on” are not blanket implementation permission.
- Give Rain one manageable hands-on action and wait for his observation before progressing. Do not execute his assigned action unless he explicitly delegates it.
- A specific user request authorizes its explained scope. This includes requested documentation edits; it does not authorize unrelated source changes. Do not repeatedly seek approval for the same already-approved step.
- Apply these rules to temporary files, prototypes, dependency installation, setup/build/server commands, generated assets, background work, and external services too. Do not silently continue the implementation elsewhere.
- Keep each approved step small and reviewable. Report actual changes, checks, limitations, and one concrete thing Rain should inspect. Stop at the agreed checkpoint.
- Do not commit, push, deploy, publish, delete, or revert without explicit authorization for that action. Do not interpret permission to prepare source as permission to release.
- If Rain says stop, stop initiating work, cancel owned active work where safely possible, and explain the state accurately.
- Re-read these rules after a handoff. If another agent contributes, pass along the same constraints.

## Current checkpoint

Implementation is paused pending a guided walkthrough and Rain's decision about the existing scaffold. Unverified drafts in `/tmp/wewantdrought-release` must not be integrated automatically. The 2026-11-16 guidelines request authorizes documentation changes only.

---

## Read before changes — non-negotiable

For this first project, Rain must read every proposed line of agent-authored code before it is added or changed. This includes boilerplate, configuration, scripts, shaders, tests, and implementation drafts. Proposed documentation changes must also be shown before they are applied.

Before modifying files, the agent must:

1. Show the exact proposed additions, replacements, or deletions, identifying their destination files. A summary or description is not a substitute for the actual content.
2. Explain what the content does, why it is needed, and any unfamiliar concepts. Keep proposals small enough for Rain to read and discuss.
3. Wait for Rain to confirm that he has read the proposal and explicitly authorize applying it.
4. Apply only the reviewed content. If a correction or additional change becomes necessary, show that change and obtain approval before applying it.

These requirements also apply to temporary folders and prototypes. Do not write implementation elsewhere to bypass review.

Explain every command before execution, including its purpose, effects, and expected output. Before commands generate or modify files, disclose those outputs and agree on their review scope. Do not silently classify generated content as exempt.

There is no standing permission to write boilerplate. Any future exception must be explicitly granted by Rain with a defined scope.

By project completion, Rain must have read all agent-authored project code and had the opportunity to understand every line. Maintain a brief review record identifying what has been reviewed and any explanations still outstanding. Do not infer understanding from silence or claim understanding on Rain’s behalf.

Existing unreviewed scaffold and temporary drafts are not accepted implementation. Review them with Rain before retaining, integrating, revising, or removing them.

## Explicit phase transitions

Clearly distinguish planning, implementation, verification, and release.

Before transitioning from planning to implementation, state: “Planning for [bounded milestone] is complete. I propose beginning implementation of [specific scope].” Identify Rain’s work, the agent’s proposed work, the review criteria, and the stopping point. Wait for explicit approval.

Approval of a phase transition does not waive line-by-line review before changes. If implementation raises a new design or architectural decision, announce a return to planning for that decision.

At each checkpoint, state the current phase, completed work, unresolved questions, and next proposed action. Never silently move from discussion into implementation.
