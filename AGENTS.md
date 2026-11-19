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

## Figma design handoff

- For substantial visual work, follow the Figma-to-Codex workflow in Section 8 of `docs/project-charter-draft.md`: Rain and ChatGPT establish and review the design in Figma; Codex implements the approved design in the app.
- In implementation prompts, include the Figma file URL and relevant page/frame/node references, plus approved assets and behavior notes. Do not assume Codex shares ChatGPT’s Figma context or can access a file without checking.
- Treat approved Figma frames as the visual target and project documentation as the source for scope and behavior. If the design is inaccessible, unclear, or conflicts with project requirements, stop and ask Rain rather than inventing a resolution.
- Implement runtime interactions in code when a static Figma design cannot provide them. Do not substitute a static mockup for required behavior.
- Figma approval is not code approval. Follow the separate implementation and review requirements in Section 13.

## Current checkpoint

Work is at Rain's visual review checkpoint for the active `experiment/ascii-hero` branch. The reviewed ASCII hero refinement has been applied: the vinyl body and outer grooves are larger, ASCII character sampling is denser, and a continuous glyph pattern covers the hero background.

The existing typecheck and build checks passed. The build reported a graphics-bundle size warning. Browser access was unavailable to Codex, so no comparison screenshots, desktop or phone visual verification, or runtime performance observation were completed. The visual result remains unaccepted pending Rain's independent review.

The current worktree has modifications in `src/App.tsx`, `src/VinylScene.tsx`, and `src/style.css`, plus untracked `src/AsciiBackdrop.tsx` and `src/AsciiVinylPass.tsx`. Preserve this work. Unverified drafts in `/tmp/wewantdrought-release` remain unaccepted and must not be integrated automatically. No release actions are authorized.

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

### Minimum Technical Review

Before implementation approval, Codex must explain three things in plain English:

1. **Architecture:** What files will change, how will the feature work, and how do the affected components interact?
2. **Risks:** What could break, what alternatives were considered, and why was the proposed approach selected?
3. **Verification:** How will we determine whether the implementation works correctly?

After implementation, Codex must run all applicable available checks, report the results, and explain any failures or checks it could not run.

The user will independently test the feature, particularly on desktop and mobile.

**Guiding principle:** The user should understand the proposed behavior, architectural decisions, risks, and verification strategy without needing to understand every line of TypeScript, JavaScript, React, or Three.js.

At each checkpoint, state the current phase, completed work, unresolved questions, and next proposed action. Never silently move from discussion into implementation.

**ChatGPT handoff report:** After every implementation step, prepare the structured report defined in Section 8 (“Development Workflow”) of `docs/project-charter-draft.md`. Follow Section 13 (“Mandatory Guided Collaboration Protocol”) for checkpoint, review, and verification expectations. Make the report easy for Rain to share with ChatGPT alongside feedback, and distinguish verified facts from assumptions.
