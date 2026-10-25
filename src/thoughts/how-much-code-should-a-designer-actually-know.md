---
title: How Much Code Should a Designer Actually Know?
category: Code
description: "AI writes the code now. The bar didn’t drop: it moved from writing code to reviewing it, and to describing exactly what to build."
tags:
  - AI
  - code
  - design systems
  - development
date: 2026-10-25
ogImage: /assets/images/thoughts/how-much-code-should-a-designer-actually-know.png
---

"Just enough to be dangerous" used to be the advice. Learn some HTML and CSS, maybe enough JavaScript to fake a prototype, and you earned a seat at the engineering table. Then AI started writing the code. Now it's writing whole features, and the question has shifted again.

## What's changed

Early AI gave you snippets. You pasted them in, tweaked them, and still understood most of what you were looking at.

Today's coding agents work at a different scale. They take a design, pull context from your design system, and can implement it all. Tools like Figma's MCP server exist specifically to hand that context to a coding agent. There's less to hand off now; many designers build working prototypes themselves, and "design engineer" is becoming a normal role rather than a rare one.

That doesn't mean everyone needs to become a developer. It means the thing you need to know has changed.

## What AI takes off the table

Syntax, boilerplate, and wiring are optional now. So is the first pass of nearly everything: scaffolding a component, translating a frame into markup, setting up a project. Nobody needs to remember how to center a div, and nobody should feel guilty about that.

## What gets more important

Taking syntax off the table doesn't lower the bar. It moves it.

**Review matters more than authorship.** When the output was a snippet, you could read every line. When an agent hands back a whole feature, you can't, so the skill becomes knowing where to look. Did it use your tokens or hardcode a hex value that happens to look close? Is the markup semantic or a pile of divs? Does it hold up at other breakpoints? AI is equally confident whether it's right or wrong, so confidence tells you nothing.

**Your design system is now an input, not just a reference.** Agents read your tokens, your naming and your documentation, and build from them. A fuzzy system produces fuzzy code. Clear names, documented reasoning and a few good examples are no longer nice-to-haves. They're the closest thing designers have to writing the spec the code gets built from.

**Knowing the follow-up question still belongs to you.** "This looks done" and "this is done" are different claims. Accessibility, semantics, and consistency with the existing system are exactly where generated code tends to cut corners, and the tool that generated it won't flag its own shortcuts.

## A practical floor

Here's roughly where the line sits now:

- **Enough HTML/CSS to review a pull request.** Not to write one from scratch, but to know what to skim and what to scrutinize.
- **A working grasp of how tokens map to code.** A variable and a hardcoded value can look identical in the browser and be completely different underneath.
- **The ability to write constraints an agent can follow.** Clear system docs, rules, and examples, whether that lives in a rules file for your coding tool or in the design system itself.
- **Enough git literacy to see what changed.** Branches, diffs, what an agent touched and what it left alone.
- **Comfort in dev tools.** Not to build, but to verify. Inspect an element, check computed styles, confirm what shipped is what you intended.
- **Shared vocabulary.** Enough words to describe what's wrong precisely, to an engineer or to an agent, so it actually gets fixed.

## The real skill

The job was never "know code." It's knowing what a good user experience looks like and describing a feature so a coding agent can build it accurately.

AI keeps getting better at writing code. It still doesn't know what the best human-centered experience looks like.
