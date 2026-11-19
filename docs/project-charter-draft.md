# Project 001 — Personal Portfolio Website
## Foundational Project Charter

**Status:** Foundational guidelines · guided collaboration rules updated 2026-11-16  
**Project:** 001 of approximately 10–15 planned software projects  
**Purpose:** Engineering education, professional identity, creative expression, and product development

---

## 1. Project Vision and Objectives

Project 001 is the beginning of a longer journey toward becoming an independent, technically capable software engineer and builder.

The portfolio website will serve five purposes:

1. **Professional identity:** Establish a credible public presence as a computer science student, software developer, and independent builder.
2. **Project showcase:** Document shipped projects, technical achievements, source code, demonstrations, architectural decisions, and lessons learned.
3. **Creative expression:** Reflect interests in music production, DJing, video editing, motion graphics, and interactive technology.
4. **Engineering education:** Provide practical experience designing, developing, testing, deploying, and maintaining real software.
5. **Evolving platform:** Grow alongside future projects without becoming dependent on their completion.

The website should combine technical substance with exceptional visual craftsmanship.

**Primary success criterion:** Ship a functional, polished, maintainable website while developing a genuine understanding of its engineering.

A visually impressive but technically fragile website is insufficient. So is technically correct software that neglects the intended user experience.

## 2. Engineering Philosophy

**The user remains the engineer, architect, and final decision-maker.**

AI should improve the speed and quality of development without replacing independent technical judgment.

The preferred decision-making process is:

1. Understand the problem.
2. Identify functional requirements (what the software must do).
3. Identify nonfunctional requirements (how reliably, efficiently, and accessibly it must work).
4. Explore feasible technical approaches.
5. Understand the advantages, disadvantages, and tradeoffs.
6. Select an appropriate approach.
7. Determine what to implement personally and what to delegate.
8. Implement and verify the solution.
9. Review and understand the resulting system.

The guided collaboration protocol in Section 13 governs all work. Routine details may be handled within an explicitly approved, bounded step; reversibility alone is not permission to start implementation.

**Guiding principle:** Technical complexity must always be justified by an actual requirement.

## 3. AI Collaboration and Delegation Rules

ChatGPT's primary responsibilities are to act as:

- **Technical consultant:** Explain available technologies, approaches, limitations, and tradeoffs.
- **Engineering tutor:** Develop conceptual understanding through concrete examples.
- **Critical reviewer:** Challenge assumptions, identify weaknesses, and evaluate proposed designs.
- **Planning assistant:** Convert approved decisions into clear, testable implementation specifications.
- **Implementation assistant:** Execute appropriately scoped tasks when requested.

Codex may handle boilerplate, repetitive work, refactoring, test generation, documentation, debugging assistance, and implementation of approved designs.

For substantial visual work, ChatGPT helps Rain develop and review the design in Figma; Codex implements the approved design in the application.

AI must not silently determine major product requirements, introduce substantial dependencies, replace architectural decisions, or expand feature scope without appropriate justification.

For substantial delegation, specifications should identify:

- Intended functionality and rationale
- Relevant files, modules, or components
- Expected behavior and constraints
- Decisions already approved
- Acceptance criteria
- Verification procedures

The amount of specification should remain proportional to the complexity and risk of the task.

### Implementation ownership for substantial tasks

For substantial implementation work, ChatGPT’s role is to help Rain understand and scope the work, resolve decisions, and prepare a detailed, copy-ready prompt for Codex. Codex is responsible for the repository code changes.

A task is substantial when it introduces a feature or milestone, changes multiple parts of the application, requires architectural or dependency decisions, or involves significant UI, animation, graphics, testing, or setup work.

For substantial tasks, ChatGPT must not implement the work in the repository, write a parallel implementation in a temporary location, or generate a prototype as a substitute for the Codex handoff. It should prepare a brief that describes the goals and reasons, expected behavior, constraints, approved decisions, relevant files and documentation, acceptance criteria, verification expectations, and unresolved questions. The brief should normally describe what the implementation must achieve rather than prescribe exact source code.

Rain reviews and passes the brief to Codex. Codex inspects the repository, follows its instructions and review rules, implements only the approved scope, and provides a handoff report. ChatGPT may then help Rain understand and review that report, assess feedback, and prepare a follow-up prompt.

For a small, focused change, ChatGPT may provide or implement the change only when Rain specifically asks it to. Rain may also explicitly authorize a different division of work for a particular task. No general preference or earlier approval grants standing permission to implement future tasks.

AI-generated code is not automatically accepted code. Significant changes should be reviewed, understood, and tested.

## 4. Technical Learning Objectives

The website should provide practical exposure to foundational web engineering.

Priority learning areas include:

**Frontend engineering**
- Browser rendering and the Document Object Model
- Components, state, and application behavior
- JavaScript and asynchronous execution
- Responsive layout principles
- Accessibility and semantic structure
- Animation and graphics performance

**Application engineering**
- API communication
- Data flow and state management
- Asset loading and optimization
- Error handling
- Application architecture and modularity

**Engineering workflow**
- Version control
- Debugging
- Automated testing
- Build systems
- Deployment and hosting
- Performance measurement
- Maintenance and documentation

**Computer science foundations**

Where naturally relevant, connect engineering decisions to algorithms, data structures, computational complexity, memory usage, and software design principles.

Do not introduce advanced techniques merely to create educational exercises. Prefer authentic opportunities to learn through real requirements.

The objective is progressive independence: the ability to understand unfamiliar technical problems and devise sound solutions.

## 5. Design and User-Experience Principles

The website should be distinctive, carefully crafted, interactive where appropriate, and visually coherent.

Design must be approached deliberately rather than treated as an afterthought.

Potential creative directions include interactive audio waveforms, audio-reactive graphics, expressive typography, motion graphics, custom transitions, interactive project demonstrations, and visual elements inspired by music production.

**These are possibilities, not approved requirements.**

No specific color palette, visual identity, typography system, animation library, or design framework has been selected.

All design proposals should consider:

- Visual clarity and hierarchy
- Consistency of interaction
- Usability across screen sizes
- Accessibility, including reduced-motion preferences
- Loading and rendering performance
- Maintainability
- Whether an interaction meaningfully improves the experience

Novelty alone is not sufficient justification for additional complexity.

Figma may be used to specify and review composition, typography, static assets, and interaction intent. Production responsiveness, accessibility, and runtime behavior must still be implemented and verified in the website.

## 6. Architecture and Code-Quality Standards

The architecture should be appropriate to the website's actual requirements and current scale.

Prioritize readable and maintainable code, focused component responsibilities, meaningful separation of concerns, and consistent conventions.

Apply strong typing where relevant, reasonable error handling, secure handling of sensitive information, appropriate testing, and dependency discipline.

Avoid premature abstractions, speculative infrastructure, excessive dependencies, and unnecessarily complicated application structures.

Technical decisions should be evaluated according to:

1. Fitness for the actual requirements
2. Simplicity and maintainability
3. Performance and reliability
4. Educational value
5. Ease of future expansion
6. Implementation and maintenance cost

Meaningful architectural choices should be documented, including the alternatives considered and the reasons for selection.

**Current status:** React, TypeScript, Vite, Three.js through React Three Fiber, CSS, and GSAP with ScrollTrigger have been accepted as the proposed stack. Lenis is optional and has not been selected. Acceptance of these tools does not authorize implementation steps. Detailed architecture and hosting remain subject to discussion and scoped approval.

## 7. MVP Scoping and Release Strategy

The first release should be a coherent, functional, polished website that can be publicly deployed.

Its scope must be deliberately limited to prevent endless redesign and feature expansion.

**Version 1**

Focus on the smallest complete version that satisfies the website's essential objectives and quality expectations.

**Subsequent versions**

Introduce more sophisticated interactive experiences, integrations, technical demonstrations, animations, and other improvements when justified.

Maintain a backlog of proposed enhancements.

Evaluate additions to an active release based on their impact on development time, complexity, stability, and existing commitments.

The website should not consume the entire three-month building initiative.

**Current status:** The precise MVP feature set, public content, release milestones, and launch criteria still require discussion.

## 8. Development Workflow

Use this ChatGPT–Codex workflow for substantial features and changes. ChatGPT supports product thinking, technical learning, and planning; Codex inspects and changes the repository. Rain remains the engineer, product owner, and final decision-maker.

### Figma design and Codex implementation

For substantial visual or interface work, ChatGPT uses the project context and Rain’s direction to help develop the design in Figma. Rain reviews and approves the design before it becomes the visual target for implementation. Codex is responsible for assembling the approved design in the application; it should not independently replace or reinterpret the visual direction.

A Codex handoff should identify the Figma file and relevant page, frame, or node; the approved layouts and screen sizes; any assets to use and their locations; and notes for interaction, motion, accessibility, and responsive behavior. The handoff should also link the project documents that govern scope and requirements.

The approved Figma design is the visual reference for layout, typography, color, and static assets. Project documentation remains the reference for product scope and behavior, and the codebase records the implementation. If these sources conflict, or if Codex cannot access or understand the referenced Figma content, it must report the issue and ask Rain rather than silently guessing.

Figma prototypes and motion studies communicate intent; they do not replace production behavior. Codex implements runtime behavior in the application. For example, the vinyl’s cursor-responsive ASCII lighting must change the rendered characters in the app; a static Figma image cannot satisfy that interaction.

Approval of a Figma design does not authorize code changes. Code implementation remains a separate, bounded step under Section 13. Changes to Figma are also bounded work and must be reviewed and approved before they are made.

### Plan and implement

1. **Scope (ChatGPT):** Define the problem, audience, desired behavior, visual direction, requirements, constraints, and success criteria with Rain.
2. **Learn (ChatGPT):** Explore relevant technologies, viable approaches, and tradeoffs. Explain meaningful choices so Rain can make informed decisions.
3. **Specify (ChatGPT → Codex):** Prepare a detailed, actionable implementation brief that points to relevant Markdown documentation and states approved choices, acceptance criteria, and verification expectations.
4. **Implement (Codex):** Inspect the repository and its conventions, implement the approved scope, verify the changes as requested and appropriate, and prepare a structured handoff report.

### Minimum Technical Review

Before implementation approval, Codex must explain three things in plain English:

1. **Architecture:** What files will change, how will the feature work, and how do the affected components interact?
2. **Risks:** What could break, what alternatives were considered, and why was the proposed approach selected?
3. **Verification:** How will we determine whether the implementation works correctly?

After implementation, Codex must run all applicable available checks, report the results, and explain any failures or checks it could not run.

The user will independently test the feature, particularly on desktop and mobile.

**Guiding principle:** The user should understand the proposed behavior, architectural decisions, risks, and verification strategy without needing to understand every line of TypeScript, JavaScript, React, or Three.js.

### Review and refine

5. **Review (Rain):** Inspect and try the implementation. Note visual mismatches, broken or missing behavior, and anything that does not match the intended result.
6. **Relay (Rain → ChatGPT):** Share observations and, when useful, screenshots together with Codex’s handoff report or relevant technical findings. The report should cover the objective, changes and file paths, important decisions, verification performed and not performed, known issues, and documentation updates.
7. **Evaluate (ChatGPT):** Diagnose the feedback, distinguish defects from design or requirement disagreements, revisit decisions when needed, and prepare targeted correction instructions. Ask Rain for direction when a material product or architecture decision remains open.
8. **Refine (Codex):** Make the targeted corrections, verify them, and report the outcome. Repeat review, relay, evaluation, and refinement as needed.
9. **Accept and document (Rain with ChatGPT/Codex support):** Once Rain is satisfied, treat the change as accepted, update relevant specifications or decision records, and move on.

The three working references have distinct roles: **ChatGPT conversations express and develop product intent; repository Markdown files hold durable specifications and approved decisions; the repository implementation records what actually exists.** Keep them aligned. If implementation differs from an approved specification, report the difference and resolve it rather than silently treating either as the other.

Minor, straightforward fixes with clear intent may go directly to Codex without the full workflow. Keep the process proportionate for other routine, reversible work too. Significant product, scope, dependency, stack, or architecture decisions remain with Rain; Codex implements an approved direction and should not silently expand it.

## 9. Testing and Definition of Done

A feature is not complete simply because it appears correct in a screenshot or works once locally.

Verification should consider:

- Required functionality
- Important edge cases
- Responsive behavior
- Basic accessibility
- Acceptable performance
- Error handling
- Absence of critical failures
- Code maintainability
- Integration with existing features
- Deployment readiness
- Documentation of important decisions

Testing effort should reflect the complexity and failure risk of the feature.

No single testing framework or methodology is mandated until the corresponding technical decisions have been made.

## 10. Long-Term Evolution and Integration

The portfolio should become a living record of engineering progress.

Future projects may include developer dashboards, productivity applications, file-management utilities, backend systems, data-processing software, artificial intelligence integrations, audio-processing tools, and more ambitious creative technologies.

The website may eventually showcase or integrate with these systems.

However, **future project ambitions do not automatically become website requirements**.

The architecture should permit reasonable growth without requiring premature infrastructure or speculative integrations.

## 11. Anti-Patterns and Behaviors to Avoid

The project should actively avoid:

- Vibe coding without understanding the resulting implementation
- Delegating fundamental decisions without reviewing their implications
- Selecting technologies purely because they are popular
- Overengineering simple functionality
- Building unnecessary backend systems
- Premature optimization
- Uncontrolled feature expansion
- Endless visual redesign before shipping
- Excessive dependencies
- Treating generated code as inherently correct
- Ignoring accessibility or performance for visual novelty
- Confusing code volume with engineering sophistication
- Treating a working local development server as proof of release readiness
- Spending excessive time on process when practical implementation is clear

AI should identify these patterns constructively without becoming an obstacle to progress.

## 12. Non-Negotiable Rules for Coding Agents

These rules are reinforced by the root `AGENTS.md` and the mandatory protocol in Section 13:

1. The user owns product direction and major architectural decisions.
2. Do not introduce major technologies, dependencies, or structural changes without appropriate approval.
3. Follow established specifications and project conventions.
4. Favor simple, readable, maintainable solutions.
5. Do not add speculative features or unnecessary abstractions.
6. Keep changes focused on the assigned task.
7. Respect accessibility, responsiveness, security, and performance.
8. Test and verify changes proportionally to their complexity.
9. Report important implementation decisions, assumptions, limitations, and unresolved issues.
10. Do not conceal errors, bypass failing checks, or claim unverified completion.
11. Support the user's understanding rather than replacing their engineering judgment.
12. Apply Section 13 to every action. Handle routine details only within the scope already explained and explicitly delegated; do not use convenience, reversibility, or shipping speed to bypass a checkpoint.

---

## 13. Mandatory Guided Collaboration Protocol

**Default mode: explain, work with Rain, verify together, then stop at the checkpoint.**

This section overrides broad autonomy language and routine-task exceptions elsewhere in this charter. It applies to source code, configuration, dependencies, generated assets, documents, commands, temporary drafts, and external services. Learning and informed participation are part of delivery, not an optional explanation after the work is done.

### Before acting

When a task depends on a Figma design, the handoff must identify the approved file and relevant frames or nodes, assets, and behavior notes. If Codex cannot access or resolve the design, it must stop and ask Rain. Figma approval does not authorize code changes.

1. **State the purpose and scope.** Explain what the next action will do and why it is needed. For read-only inspection, name what will be inspected and why; do not silently expand into mutations.
2. **Explain before implementation.** Before changing code or configuration, installing dependencies, generating implementation assets, or running a setup/build/server command, describe the concrete proposed step, affected files, relevant concepts, visible outcome, and verification. Explain commands before either Rain or the agent executes them.
3. **Allocate the work explicitly.** Identify what Rain will do, what the agent proposes to do, and what will be reviewed together. Start with one manageable hands-on action for Rain. Do not take over that action unless Rain explicitly delegates it.
4. **Obtain specific approval for the bounded step.** Agreement with a tool, design direction, or overall proposal is not permission to build the website. During discussion, phrases such as “looks good,” “makes sense,” or “let’s move on” mean continue the discussion unless the user clearly authorizes the described implementation step. If ambiguous, ask one concise question before acting.
5. **Respect explicit requests.** A direct request to edit a particular document authorizes that explained document edit; it does not authorize application changes. A direct, specific delegation can authorize a larger batch when its scope and consequences have been explained. Avoid asking repeatedly for permission already given for the same step.

### During an approved step

6. **Stay inside the boundary.** Do not implement later milestones, introduce new dependencies, decide unreviewed product behavior, or add speculative features. Temporary folders, background commands, and generated drafts are subject to the same rules as the master repository. “Only a prototype” is not an exemption.
7. **Make reasoning visible.** Explain meaningful choices in plain language, define technical terms when introduced, and connect each change to a requirement. Clearly distinguish approved decisions, recommendations, assumptions, and placeholders. Do not overwhelm Rain with unrelated concepts or quiz him as a condition of progress.
8. **No invisible continuation.** Tell Rain when starting an installation, server, long-running command, or external operation. Report its state; do not leave it running across a stop/handoff without disclosure. If asked to stop, stop initiating work and cancel owned active work where safely possible, then explain the exact state.
9. **Keep changes reviewable.** Prefer a small, working increment. Show or summarize the actual diff and give Rain a chance to inspect the relevant code and behavior before proceeding. Do not present a completed large implementation as a substitute for participation.

### At the checkpoint

10. **Verify honestly.** State what was checked, the result, and what remains unverified. Distinguish written code, installed dependencies, a successful build, browser-tested behavior, a commit, and a deployment. Never imply one establishes the others.
11. **Close the learning loop.** Explain what changed, how it fits into the system, what Rain did, and one concrete thing Rain should inspect or try. Pause for his observation or question before beginning the next milestone.
12. **Keep release actions separate.** Do not commit, push, publish, deploy, change hosting, delete drafts, or revert work without explicit authorization for that action. Preparing local source does not authorize a release. Preserve existing work until Rain chooses how to retain, revise, or remove it.
13. **Carry the rules forward.** Read root `AGENTS.md` and this charter at the start of project work, including after a context handoff. These rules apply to every contributing agent. Record new decisions with their approval scope; never treat earlier general approval as blanket permission.

### Required step proposal

Before implementation, provide these five items in language appropriate to the task:

- Goal and the reason for this step
- Files and commands involved, with their purpose
- Rain's hands-on action and the agent's proposed action
- Expected result and how to check it
- Exact point at which the agent will stop
---

## Decision Register

### Established

- This is Project 001 of a broader software-building initiative.
- The portfolio is both a professional platform and an engineering learning project.
- Design craftsmanship and technical quality are equally important.
- The user retains engineering and architectural ownership.
- ChatGPT primarily acts as a consultant, tutor, reviewer, and planning assistant.
- Codex assists with scoped implementation.
- The first release should be practical, polished, and deployable.
- Future enhancements should be managed separately from the active release.
- Root `AGENTS.md` makes the mandatory guided collaboration protocol discoverable to coding agents.
- Proposed stack accepted: React + TypeScript + Vite + CSS + Three.js through React Three Fiber + GSAP/ScrollTrigger. Tool acceptance is separate from implementation authorization.
- First-release direction: ASCII vinyl hero and philosophy/cube journey, ending before the CD player. Placeholder phrases are permitted; exact copy and composition remain reviewable.
- Implementation is paused at the Section 13 checkpoint; future work proceeds with Rain in explicitly approved steps.

### Not yet decided

- Application and repository architecture
- Visual identity and design system
- Exact MVP features and content
- Hosting and deployment strategy
- Exact rendering implementation and scroll choreography
- Testing frameworks
- Project integrations
- Development milestones and release date

These decisions should emerge through deliberate technical and product discussions.

---

## Governing Principle

**The goal is not merely to create an exceptional personal website. The goal is to become a more capable, independent software engineer by designing, implementing, understanding, and shipping one.**

The website is both the first finished product and the beginning of a long-term engineering portfolio.

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

EXTRAS, FOR RAINS REFERENCE

To start a new spec session:

I want to start the ChatGPT–Codex workflow for this feature:

**Feature or goal:** (Describe what I want to do)

First, read the project’s `AGENTS.md`, Section 13 of `docs/project-charter-draft.md`, and any relevant specifications. We are in the planning phase: help me scope the feature, identify requirements and constraints, and explain important technical options and tradeoffs in plain language. Ask focused questions when needed; don’t start implementation.

Once we agree on the scope and direction, prepare a detailed, actionable implementation brief for Codex. Include the expected behavior, relevant files and documentation, approved decisions, acceptance criteria, verification expectations, and anything that remains open.

Show me the complete brief to review. Don’t treat agreement with the plan as permission to edit files. I’ll review and approve the brief, then pass it to Codex for the bounded implementation step. Codex must follow the repository’s review rules and provide a handoff report when finished.
