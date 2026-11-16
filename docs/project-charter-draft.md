# Project 001 — Personal Portfolio Website
## Foundational Project Charter

**Status:** Foundational guidelines  
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

Not every trivial change requires this full process. Routine, reversible, clearly specified tasks should proceed without unnecessary bureaucracy.

**Guiding principle:** Technical complexity must always be justified by an actual requirement.

## 3. AI Collaboration and Delegation Rules

ChatGPT's primary responsibilities are to act as:

- **Technical consultant:** Explain available technologies, approaches, limitations, and tradeoffs.
- **Engineering tutor:** Develop conceptual understanding through concrete examples.
- **Critical reviewer:** Challenge assumptions, identify weaknesses, and evaluate proposed designs.
- **Planning assistant:** Convert approved decisions into clear, testable implementation specifications.
- **Implementation assistant:** Execute appropriately scoped tasks when requested.

Codex may handle boilerplate, repetitive work, refactoring, test generation, documentation, debugging assistance, and implementation of approved designs.

AI must not silently determine major product requirements, introduce substantial dependencies, replace architectural decisions, or expand feature scope without appropriate justification.

For substantial delegation, specifications should identify:

- Intended functionality and rationale
- Relevant files, modules, or components
- Expected behavior and constraints
- Decisions already approved
- Acceptance criteria
- Verification procedures

The amount of specification should remain proportional to the complexity and risk of the task.

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

**Current status:** The technology stack, application architecture, hosting approach, and supporting tools remain undecided.

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

Work should proceed through an understandable and repeatable engineering process.

**Discovery:** Define the problem, intended audience, requirements, and constraints.

**Exploration:** Evaluate implementation alternatives and their tradeoffs.

**Design:** Establish the user experience and technical approach before substantial implementation.

**Specification:** Define expected behavior, responsibilities, acceptance criteria, and verification steps.

**Implementation:** Write or delegate appropriately scoped code.

**Validation:** Test functionality, inspect behavior, review code, and resolve defects.

**Integration:** Confirm that new work fits the existing system and conventions.

**Release:** Deploy the verified implementation and document relevant decisions.

**Reflection:** Identify lessons learned, technical weaknesses, and future improvements.

The workflow is a guide rather than a rigid ceremony. Low-risk changes may combine several stages.

For significant architectural decisions, user approval takes precedence over autonomous implementation.

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

The following rules form the conceptual foundation for a future `AGENTS.md` file:

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
12. Apply these rules pragmatically: straightforward, reversible tasks should not require unnecessary approval.

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
- A concise agent instruction file should complement, not replace, this charter.

### Not yet decided

- Technology stack and frameworks
- Application and repository architecture
- Visual identity and design system
- Exact MVP features and content
- Hosting and deployment strategy
- Animation and graphics technologies
- Testing frameworks
- Project integrations
- Development milestones and release date

These decisions should emerge through deliberate technical and product discussions.

---

## Governing Principle

**The goal is not merely to create an exceptional personal website. The goal is to become a more capable, independent software engineer by designing, implementing, understanding, and shipping one.**

The website is both the first finished product and the beginning of a long-term engineering portfolio.
