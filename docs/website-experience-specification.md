# wewantdrought — Website Experience Specification

**Owner:** Rain Li  
**Updated:** November 16, 2026  
**Status:** Design and experience requirements for guided implementation  
**Master repository:** `/Users/rain.li/projects/wewantdrought`  
**Current phase:** Implementation preparation; application changes paused pending review of the existing scaffold.

## 1. How to use this document

Read this document alongside:

- `AGENTS.md`
- `docs/project-charter-draft.md`
- `docs/design-philosophy.md`

The charter governs collaboration and engineering decisions. This document records the intended website experience, references, boundaries, and unresolved decisions.

Read-before-changes rules apply to all implementation. A requirement recorded here does not authorize writing its implementation automatically.

Distinguish these categories throughout development:

- **Established direction:** Rain has explicitly expressed or accepted this preference.
- **Proposed implementation:** A possible technical way to achieve it; still requires explanation and reviewed approval.
- **Placeholder:** Temporary content or treatment that can help evaluate an experience.
- **Deferred:** Part of the longer-term website, outside the current release.
- **Open:** Requires a decision or further content from Rain.

Do not promote a proposal or placeholder into a firm product requirement merely because an earlier agent wrote it.

## 2. Purpose and identity

This is Rain Li’s personal website, under the project identity “wewantdrought.”

It should express his interests, taste, creative work, and technical development. It is also his first substantial website-building project and an opportunity to understand the engineering personally.

The site should grow as Rain builds smaller projects and develops his skills. It does not need every eventual environment or interaction completed before the first release.

A polished opening chapter can be the initial finished product. Later releases can add the project collection, sound experience, and other sections.

Do not invent achievements, project descriptions, career claims, or biographical details. Use Rain’s own writing and verified content.

## 3. Reference hierarchy

### 3.1 Santal — strongest overall anchor

Reference: https://santalarch.com/#philosophy

Rain has repeatedly identified Santal as the strongest aesthetic and experiential reference.

The important qualities are:

- Confident, large typography.
- Carefully controlled composition.
- Fine lines and a visible underlying grid.
- Generous empty space.
- A premium, precise overall feeling.
- Strong monochrome contrast.
- Scroll-driven transformations.
- Typography becoming part of a spatial environment.
- Camera movement that creates continuity across stages.
- The reveal that seemingly flat arrangements actually have depth.

The reference should inform how the website feels and how its scenes connect.

The goal is not to transplant Santal’s architecture business, copy, branding, or room imagery into Rain’s website.

Rain has referred to this site as Santal, Santel, or Centel during discussion. These references mean the same website.

### 3.2 Porsche — motion, precision, and object presentation

Reference: https://shop.porsche.com/ca/en-CA

Rain likes:

- Smooth animations.
- A premium, engineered feeling.
- The way car visuals are embedded into the presentation.
- Rounded, carefully finished forms.
- Typography that feels precise and premium.

Rain described this feeling as “metallic.” Interpret that as a preference for tangible, engineered quality, rather than a requirement to make every heading chrome.

The Porsche font is a reference, not an approved font asset or license.

### 3.3 Wealthsimple — material quality and color relationships

Reference: https://www.wealthsimple.com/en-ca

Rain particularly likes:

- Matte surfaces that still feel expensive.
- Highly believable objects.
- Detailed coins and cards.
- Controlled metallic highlights.
- The relationships between green, light purple, and surrounding neutral colors.
- Visual fidelity comparable to carefully photographed physical products.

The attached Wealthsimple examples included:

1. A dark matte card with fine surface texture, a metallic edge, chip, and embossed details.
2. A gold coin with believable relief, edge ridges, and directional lighting.
3. A staged monitor/product scene with a dark atmosphere and controlled background light.

The attraction is the combined effect of geometry, surface finish, lighting, detail, and composition. A metallic gradient alone would not reproduce it.

### 3.4 Daniel Tan — personal character and immersive presentation

Website: https://danielrltan.com/  
Repository: https://github.com/danielrltan/danielrltan.com

Daniel’s site was an early strong anchor. Rain likes its aesthetic and confident use of color.

This does not establish bright orange as Rain’s color.

Daniel’s repository was inspected during the tools discussion. It includes React, TypeScript, Vite, Three.js, React Three Fiber, Drei, GSAP, and Lenis.

That stack informed discussion, but Rain’s website should be designed for its own requirements.

### 3.5 Lucas Jin — ASCII fidelity and typography

Reference: https://www.lucasjin.ca/

Rain likes:

- The detailed character-based imagery.
- The overall aesthetic and font choice.
- Some aspects of the surrounding layout.

Rain wants a Santal-influenced composition with ASCII art as the central object.

He does not want the entire experience constrained to a single rectangular frame containing an ASCII image.

The reference is evidence of the desired visual language, not a requirement to copy its content or controls.

### 3.6 Instagram reference — tangible digital objects

Reference: https://www.instagram.com/p/DfPlNNIxBES/

Rain shared this as a reference for the kind of dimensional, modeled presentation he imagines, especially for a future sound section.

The reel is a visual reference. Do not infer its precise implementation, tools, or asset-generation method without investigating it.

## 4. Overall aesthetic

### 4.1 Composition

Established direction:

- Use a disciplined layout.
- Use fine rules and intentional alignment.
- Give important elements room.
- Contrast oversized display text with smaller supporting text.
- Make the central object feel staged within the page.
- Preserve the feeling of an open composition.

Exact margins, column counts, heading sizes, and navigation placement remain reviewable.

Avoid filling space simply to make the website seem more complete.

### 4.2 Typography

Rain likes Santal’s typography, including its strong use of capitals, and the premium feeling of Porsche’s font.

He also likes Lucas Jin’s font and general aesthetic.

These are preferences to explore together. No final font family, licensed font, or universal uppercase rule is established.

Santal’s reference screenshots include mixed-case philosophy phrases. Do not turn the preference for capitals into an assumption that every line must be uppercase.

Typography should work through proportion, weight, tracking, line breaks, and alignment.

### 4.3 Color

The opening page should be black and white, with possible restrained color accents.

No accent color or final hex palette is approved.

Rain rejected an earlier assistant palette described as ivory, graphite, blue, and ember. Do not reuse that palette as approved direction.

Wealthsimple’s green and light purple relationships remain references for future exploration.

Evaluate color with materials, light, and atmosphere. Do not select disconnected swatches and assume they reproduce the references.

### 4.4 Feeling

The desired experience is premium, smooth, detailed, precise, and personal.

Rain’s repeated use of “metallic” points toward physical quality: controlled reflections, convincing edges, matte surfaces, and tangible objects.

Motion should support that feeling through continuity and deliberate staging.

## 5. Eventual website structure

The broader structure discussed comprises:

1. Home / opening experience.
2. Things I’ve Made.
3. Sound.
4. About.
5. Contact.

This structure does not mean all five sections must be fully implemented in the first release.

Rain is working on page content in a Google Doc:

https://docs.google.com/document/d/1QUck524-W17_ZZOb1LfaEfdio_0w4Nx4CPKDgpodfaU

Consult the current document before assuming detailed content. A new session may need to establish access through its available tools.

Writing or notes may link to Substack initially, as recorded in the existing design brief. Detailed implementation remains open.

## 6. Current release boundary

Rain wants to ship the first part of the website and tackle the CD-player environment later.

The first-release direction includes:

- The hero.
- A floating ASCII music object.
- Cursor interaction represented through the ASCII.
- The philosophy phrase sequence.
- The color inversion.
- The square matrix and cube reveal.
- Camera movement through the matrix.
- A coherent ending before the interactive CD player.

The final ending’s content and treatment remain open. “Still building” or “Still in the making” are possible placeholders, not final approved copy.

The first release should stand on its own and leave room for future additions.

Do not build the CD player, project-discovery mechanics, disc insertion, jog-wheel morph, or complete sound environment as part of this opening chapter without a separate scope decision.

## 7. Hero content and arrangement

### 7.1 Name and introduction

The displayed name is **Rain Li**.

The hero should combine the name, selective introductory content, and the central ASCII object.

Rain likes the combination of Santal’s layout discipline and Lucas Jin’s ASCII aesthetic.

Exact description text, name placement, navigation, supporting labels, and line breaks require review.

Do not treat placeholder biography, geographic coordinates, “study” labels, or captions from temporary code as approved content.

### 7.2 Central visual

The central visual should be:

- A recognizable music-related object.
- Floating in space.
- Rendered in characters.
- Detailed enough to communicate surface and depth.
- Integrated into the composition.
- Primarily monochrome.

Its appeal should come from the object’s recognizable structure and the character rendering.

## 8. ASCII object: floating vinyl record

### 8.1 Subject decision

Rain initially proposed a CDJ-3000.

He later identified the detailed model as an obstacle to shipping quickly and asked the agent to choose a simpler music-related object.

The proposed floating vinyl record was accepted.

The CDJ-3000 is therefore a superseded first-release subject, not an additional model to build now.

### 8.2 Why the vinyl fits

The vinyl provides:

- A recognizable circular silhouette.
- An immediate relationship to music.
- Grooves and a center region that can provide visual detail.
- A simpler modeling problem.
- A circular motif that can relate to later discs and a jog wheel.

The connection to later circular objects is useful design continuity. It does not establish that the hero vinyl must physically become the future CD-player disc.

### 8.3 Proposed physical details

The accepted proposal described:

- Concentric grooves.
- A center label.
- A spindle hole.
- A thin edge.
- A beveled or highlighted rim.
- A tilted orientation that communicates depth.
- Gentle floating motion.

Exact dimensions, label graphics, groove density, rotation, tilt, and surface treatment require visual evaluation.

Do not mistake a mathematically detailed model for a visually successful ASCII object.

### 8.4 Fidelity benchmark

Rain shared a dense character-rendered skull as a fidelity reference.

The skull is not the desired subject.

The important qualities are:

- A recognizable object.
- Fine detail.
- Convincing tonal structure.
- Visible volume.
- Enough character density to avoid a crude icon-like result.

A generic low-detail ASCII disc would not meet the intent simply because it is technically character-based.

### 8.5 Movement

The record should feel suspended.

Gentle movement can establish this through subtle changes in position or orientation.

Exact motion values are not approved.

Evaluate whether motion helps the object feel physical and calm. Preserve a reduced-motion alternative.

## 9. Cursor-controlled ASCII illumination

### 9.1 Essential requirement

Rain explicitly clarified:

**The ASCII characters themselves must emulate the pool of light around the cursor.**

A separate glow, spotlight-shaped overlay, or bright circle following the cursor would not satisfy the request.

### 9.2 Intended visible behavior

As the cursor moves across the object:

- A nearby area of the record appears differently illuminated.
- Character selection, density, brightness, or a combination changes.
- Those changes follow the object’s visible structure.
- The illuminated region moves with the cursor.
- The record remains recognizable.

The effect should feel like exploring a physical surface through light.

### 9.3 Baseline appearance

The object should remain readable while the cursor is elsewhere.

The pointer interaction enhances the image rather than being the only way to discover that an object exists.

The strength, radius, softness, and response speed of the illumination require review.

### 9.4 Proposed rendering pipeline

A candidate approach is:

1. Construct the vinyl geometry.
2. Calculate its surface appearance and shading.
3. Use pointer position to modify illumination on that surface.
4. Render an intermediate image.
5. Sample that image on a character grid.
6. Choose characters and their appearance according to the sampled values.
7. Display the final ASCII image.

This is a proposed implementation, not permission to write a custom shader without explanation.

A shader is a program used by the graphics processor to calculate appearance. If used, its code must be explained and reviewed like every other authored line.

### 9.5 Touch and reduced motion

The cursor effect is primarily a pointer interaction.

The site must still make sense on a touch device. Do not require a finger to hover.

A stable or gently lit fallback is a reasonable direction to evaluate. Exact touch behavior remains open.

Reduced-motion handling and readable fallbacks are engineering requirements under the charter.

## 10. Philosophy, matrix, and cube journey

### 10.1 What “matrix” means here

Rain wants the type of spatial typographic experience seen on Santal.

In this context, “matrix” refers to repeated words arranged across squares that are revealed as cube faces.

It does not mean green falling-code imagery.

The discussion does not conclusively establish that the literal word “matrix” must appear as final copy.

### 10.2 Philosophy phrases

Rain wants short phrases that represent his design philosophy or identity.

He offered ideas such as making change through technology as rough examples, while asking for something more sophisticated.

These examples are prompts for exploration, not final copy.

Rain has approved using placeholders while the experience is developed.

Temporary draft phrases included:

- “Curiosity drives creation.”
- “Creation shapes experience.”

These are assistant-written placeholders. They are not final statements of Rain’s identity.

### 10.3 Three-word structure

The discussion developed toward three-word phrases that work as large typographic compositions.

The reference sequence connects two statements through a shared idea.

The exact wording must be meaningful enough to support the later secondary words on cube faces.

Do not choose words purely because their lengths are convenient for a layout.

### 10.4 Continuity

The sequence should feel like one connected transformation:

**Hero → phrases → inversion → repeated words and squares → cubes → changing viewpoint → passage through the matrix → next reveal.**

The critical visual idea is that a previously flat composition turns out to have depth.

A crossfade to an unrelated cube scene does not fully accomplish this.

### 10.5 Reference evidence

Rain supplied sixteen Santal screenshots captured between 2:41:23 AM and 2:42:24 AM on November 16, 2026.

They show:

- The large opening title and supporting description.
- A cleared composition.
- “Architecture Shapes Perception” on a light background.
- “Perception Defines Experience” on a dark background.
- Repeated words across a square arrangement.
- Cube depth and secondary words.
- Progressive changes in viewpoint.
- Cube tops and a passage through the matrix.
- A room appearing through an opening.
- The room expanding into the next presentation.

The original screenshot files were attached from Rain’s Desktop. Their presence in the repository has not been established.

A new agent may revisit Santal to understand the animation. Reading the site’s text alone is insufficient for evaluating the motion.

### 10.6 Detailed stages

#### Stage A — Hero

Rain’s name, introduction, and floating ASCII vinyl establish identity and atmosphere.

The cursor interaction belongs here.

The hero must have time to register before the next scene takes over.

#### Stage B — Clearing the composition

As the visitor scrolls, the hero content leaves or disappears.

The resulting space provides a transition into the philosophy passage.

The exact exit mechanics remain open.

Do not skip directly from a busy hero into a busy matrix.

#### Stage C — First philosophy phrase

A large three-word phrase appears on a light background.

The typography should be legible as a complete statement.

Placement, line breaks, and entry treatment should reflect the disciplined reference composition.

The phrase needs a readable moment before its next transformation.

#### Stage D — Inversion and connected phrase

Further scrolling introduces the dark treatment and a second connected phrase.

The reference changes from “Architecture Shapes Perception” to “Perception Defines Experience.”

Rain’s phrases may differ, but the relationship between statements matters.

Preserve the order: the first phrase precedes the inversion and second phrase.

#### Stage E — Words spread into square matrices

The phrase’s words dissipate, spread, or repeat into an arrangement of squares.

The language from the phrase remains perceptually connected to the emerging field.

“Dissipate” is a visual description, not an approved particle algorithm.

Do not assume the effect requires particles, letter destruction, or random noise. Investigate the reference and propose the simplest method that achieves the intended continuity.

#### Stage F — Square faces reveal cube depth

The squares tilt, or the viewpoint changes, revealing cubes.

The visitor should understand that the apparently flat field had spatial structure.

Cube edges and surfaces should make that depth legible without overwhelming the words.

The cubes should feel like the next state of the matrix.

#### Stage G — Secondary words become visible

Other cube faces reveal words related to the main concepts.

Rain’s examples included words such as “hear,” “see,” and “experience” as components of an idea like design.

The reference also includes sensory words such as “Hear,” “Touch,” and “Feel.”

These examples establish a semantic relationship, not the final word list.

Assistant suggestions such as “build,” “listen,” “question,” “play,” and “learn” remain placeholders.

The secondary words should contribute meaning to the main phrases.

#### Stage H — Pull back and rise

As scrolling continues, the camera appears to pull back and move toward a higher viewpoint.

More of the cube field becomes visible.

The tops of the cubes become increasingly apparent.

This movement is a central part of what Rain likes about the reference.

The goal is a clear change in spatial understanding, not camera movement for its own sake.

#### Stage I — Move through the matrix

The camera progresses through or into a passage within the matrix.

The previous arrangement becomes a surrounding spatial environment.

The motion should maintain a comprehensible focal direction.

Exact camera paths, angles, speeds, and opening geometry remain open implementation decisions.

#### Stage J — Reveal the next space

In Santal, the movement reveals a room. The room grows to occupy the view and leads into later content.

Rain wants this type of reveal.

A literal architectural room is not established as the required destination for his website.

For this release, the sequence should resolve before the CD-player environment. The destination may be a carefully designed ending or a preview of the next chapter, subject to review.

### 10.7 Scroll behavior

Scrolling should control the progression through the narrative.

The exact scroll distance and whether particular sections remain fixed while animating must be explained before implementation.

The experience should preserve readable pauses and avoid forcing visitors through excessive scrolling.

Reverse scrolling should be considered when evaluating continuity.

Do not assume that smooth scrolling requires an additional library.

### 10.8 Current draft limitation

The temporary code written during the premature implementation uses separate phrase and cube treatments with opacity transitions.

It does not implement the fully continuous word-to-matrix-to-cube transformation described above.

That draft is an experiment, not proof that the interaction has been solved.

## 11. Deferred project collection: CD player

### 11.1 Core concept

For Things I’ve Made, Rain wants a CD-player-style experience.

The visitor can:

- Pick a CD.
- Put or throw it into the player.
- Reveal information about a project.

Each disc can represent a piece of work.

The website can grow as new projects populate this collection.

### 11.2 Interaction decisions still open

The following need later discussion:

- Whether insertion uses dragging, clicking, or both.
- How the player indicates a valid target.
- How discs are selected on touch devices.
- How project information appears.
- How visitors browse without performing a gesture.
- How to eject or switch discs.
- How artwork, titles, and project metadata are managed.

These details were not settled by the concept discussion.

Do not build them into the first release.

## 12. Deferred sound transition: disc to jog wheel

Rain emphasized that the same round object should continue through the transition.

The project disc morphs into a DJ-set jog wheel, leading into his digital sound work.

The emphasis is on identity and continuity of the object.

A cut between an unrelated disc and DJ scene would not fulfill that central idea.

The future sound area may contain music, mixes, and related digital work.

The precise controller form, music integration, audio playback, controls, and destination layout remain open.

Do not infer autoplay requirements.

## 13. Accepted tools and unresolved implementation

Accepted technical direction:

- React.
- TypeScript.
- Vite.
- CSS.
- Three.js through React Three Fiber.
- GSAP with ScrollTrigger.

Lenis remains optional and unselected.

Drei exists in Daniel’s reference stack but has not been established as necessary for Rain’s first implementation.

The proposal is a frontend website. A backend requirement has not been established.

Tool acceptance is separate from permission to install, configure, or write their implementation.

The following are still implementation decisions:

- Component and file structure.
- One canvas or multiple canvases.
- ASCII rendering method.
- Exact shader design.
- Model construction details.
- Text rendering on cube faces.
- Scroll timeline structure.
- Camera path.
- Loading behavior.
- Performance limits and fallbacks.
- Final hosting provider.

Choose these through explanation, small experiments, and Rain’s approval.

## 14. Quality and accessibility

The charter requires:

- Readable content.
- Responsive behavior.
- Keyboard-accessible navigation and controls.
- Reduced-motion handling.
- Reasonable rendering performance.
- Appropriate fallbacks.
- Honest verification.

The website must remain useful when the pointer interaction is unavailable.

Content should not depend entirely on WebGL or on completing a long animation.

Evaluate desktop and mobile compositions separately where necessary.

A screenshot alone cannot establish that the animation feels correct.

## 15. Review questions for each visual milestone

These are review criteria, not permission to implement all milestones at once.

### Hero and vinyl

- Is the object immediately recognizable as a vinyl record?
- Does it communicate thickness and volume?
- Does the ASCII have sufficient detail?
- Does the record feel suspended?
- Does the composition feel open and intentional?
- Are the name and introduction readable?

### Cursor illumination

- Is the changing light expressed through characters?
- Is there any unwanted separate glow overlay?
- Does the response feel connected to the pointer?
- Can the object be understood without interaction?
- Does lighting preserve the grooves and center structure?

### Philosophy passage

- Can the visitor read each statement?
- Is the inversion placed in the intended order?
- Are placeholder words clearly understood as placeholders?
- Does the typography have the scale and discipline of the reference?

### Matrix and cubes

- Does the phrase visibly relate to the word field?
- Does the square-to-cube reveal communicate depth?
- Are secondary words meaningful?
- Is the camera movement comprehensible?
- Are the cube tops revealed?
- Does the passage through the matrix feel continuous?
- Does the ending land before the deferred player experience?

## 16. Existing repository and temporary drafts

The previous agent started implementation before establishing the required guided workflow.

The master repo contains an incomplete scaffold, including:

- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `src/main.tsx`
- A favicon under `public/`
- Installed dependencies under `node_modules/`

The master entry file imports `App` and `style.css`, which were missing when inspected.

The application has not been verified as a working preview.

Temporary drafts exist under:

`/tmp/wewantdrought-release`

They include application, ASCII vinyl, cube scene, and scroll-related code.

Those drafts:

- Are unverified.
- Have not been accepted by Rain.
- Must not be integrated automatically.
- Must not be deleted or rewritten without approval.
- May contain unapproved copy, layout assumptions, and incomplete effects.
- Are not a substitute for guided implementation.

Temporary storage may not remain available indefinitely. If retaining drafts matters, propose a reviewed preservation step.

No implementation commit or deployment was made during the work documented here.

## 17. Learning and collaboration requirements

For this first project, Rain must read every proposed line of agent-authored project code before it is applied.

The agent must:

1. Explain the proposed step.
2. Identify the files and commands.
3. Show the exact proposed changes.
4. Explain unfamiliar concepts.
5. Give Rain a manageable hands-on role.
6. Wait for explicit authorization.
7. Apply only reviewed content.
8. Verify the result with Rain.
9. Stop at the agreed checkpoint.

These rules apply to boilerplate, shaders, configuration, documentation, temporary drafts, and generated implementation.

There is no standing permission to take over coding.

Before planning becomes implementation, announce the transition and the bounded scope. Approval of that transition does not waive content review.

Do not infer comprehension from silence.

## 18. New-session starting point

Open this repository in VS Code:

`/Users/rain.li/projects/wewantdrought`

The new agent should begin by reading the governing documents and this specification.

The first activity should be a read-only orientation of the existing scaffold.

Explain how:

- `index.html` provides the root element and application entry.
- `src/main.tsx` starts React.
- The application component would describe the interface.
- CSS would control appearance.
- The package file describes tools and commands.
- Vite and TypeScript configuration affect development.

Then let Rain decide whether to retain, revise, or remove the existing scaffold.

Do not begin by fixing missing files, running installations, copying temporary drafts, or generating the full website.

The immediate objective is to establish a small, understood, reviewed first milestone.

## 19. Remaining decisions

The new session should preserve these questions rather than silently answering them:

- Final hero introduction.
- Final philosophy phrases.
- Secondary cube vocabulary.
- Exact typography.
- Exact layout and grid.
- Accent colors.
- Vinyl label design.
- Character density and shading.
- Pointer-light radius and response.
- Continuous text-to-cube transformation technique.
- Camera path and scroll pacing.
- First-release ending.
- Mobile and reduced-motion presentation.
- Hosting and release process.

## 20. Source and migration limits

This document consolidates the requirements and discussion available in the current chat.

It does not reproduce every screenshot, the complete Google Doc, or the full earlier conversations.

When further detail depends on those sources, inspect them rather than inventing it.

The strongest sources for visual intent are Rain’s explicit descriptions, his supplied screenshots, and the referenced sites as experienced in motion.

If an older brief leaves a decision open that later discussion resolves here—such as choosing vinyl for the hero—use the later decision. If a genuine conflict remains, explain it to Rain before changing anything.

**The website should become an expression of Rain’s taste and growing skill, built through his informed participation.**
