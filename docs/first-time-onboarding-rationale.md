# First-visit walkthrough: design rationale

The Quantum Realm intro and Qubi tour are a navigation and learning scaffold. The team reports that it reviewed the current science explanations for accuracy. This content review is separate from testing whether first-time visitors can use the tour and understand its pacing.

## Research applied

- Apple recommends teaching game mechanics through play so that people can discover ideas in the context of the experience. The intro therefore gives visitors one small action—measuring Qubi—before the tour begins. [Designing for games](https://developer.apple.com/design/human-interface-guidelines/designing-for-games/)
- Apple's onboarding guidance says a tutorial should be quick, optional, and easy to revisit, and cautions against overloading people with information. The intro can be skipped, the route tour can be exited at any time, and the Qubi launcher keeps it available later. [Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding/)
- Research on onboarding in game-based learning describes tutorials as support for both platform navigation and learning tasks. The tour therefore makes the route and page landmarks explicit while the three cases separately teach through prediction, test, and finding. [Two-part onboarding for game-based learning environments](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.980881/full)

## Implementation decisions

- The opening reveal introduces Qubi and one clearly labeled learning metaphor before visitors enter the archive. Sound remains opt-in, and its text and skip control sit on a high-contrast panel.
- The guided route moves through the site's real routes, scrolls to a relevant landmark, outlines it, and positions Qubi beside it. The mobile menu exposes both the guided tour and opening replay.
- Visitors can play each case experiment: change measurement basis and collect trials; compare the quantum and classical CHSH strategies; or test a basis-copying rule against a superposition input. The explanations stay next to the controls and show each model's limits.
- The intro appears on a new browser tab/session and can be replayed from the site menu. The visitor can skip it, and reduced-motion preferences disable smooth scrolling and decorative movement.

## Remaining visitor checks

Ask first-time visitors to try the 18-stop route and record where they hesitate. Check page targets, mobile layout, keyboard flow, repeated visits, and reduced-motion behavior in use. The team’s science accuracy review is recorded separately in `docs/science-source-register.md`.
