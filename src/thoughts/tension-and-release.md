---
title: Tension and Release
category: Motion
description: Every animation has a promise and a payoff.
date: 2025-03-01
tags:
  - animation
  - easing
  - timing
order: 7
---

Every animation has a promise and a payoff. Tension builds anticipation; release delivers satisfaction. Without both, motion is just movement.

The easing curve is where this plays out technically. A linear easing — constant velocity from start to end — feels mechanical and unconvincing. Objects in the physical world don't move linearly. They accelerate and decelerate, they overshoot slightly and settle back. Ease-out (starting fast, decelerating to a stop) mimics something entering the frame and coming to rest. Ease-in (starting slow, accelerating out) mimics something leaving. These aren't arbitrary conventions; they reference the physics we've observed our entire lives.

## Spring physics and overshoot

Spring-based animation takes this further. A spring curve allows for overshoot — the element goes slightly past its destination and bounces back to settle. This tiny physical violation reads as lifelike. It's the difference between a menu that snaps into place and one that feels like it arrived.

The degree of overshoot controls the feeling: a small overshoot is polished and natural; a large overshoot reads as playful or exaggerated. Context determines the appropriate level. A financial dashboard wants minimal overshoot. A social app's like button wants just a touch more.

## Duration as texture

Duration is the other dimension. Fast animations (under 150ms) feel snappy and responsive, appropriate for micro-interactions. Slower animations (300–500ms) feel deliberate and weighty, appropriate for large state transitions or content reveals. Duration too slow reads as sluggish — it delays the user. Duration too fast reads as chaotic — the change isn't perceived as movement, just sudden state change. The middle is where motion lives as designed texture rather than technical artifact.
