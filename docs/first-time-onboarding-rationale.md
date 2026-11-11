# First-visit walkthrough: design rationale

The Quantum Realm intro and Qubi tour are a navigation and learning scaffold. They are not evidence for the quantum explanations; those still need review against CCST9077 lectures and authoritative physics sources by the group.

## Research applied

- Apple recommends teaching game mechanics through play so that people can discover ideas in the context of the experience. The intro therefore gives visitors one small action—measuring Qubi—before the tour begins. [Designing for games](https://developer.apple.com/design/human-interface-guidelines/designing-for-games/)
- Apple's onboarding guidance says a tutorial should be quick, optional, and easy to revisit, and cautions against overloading people with information. The intro can be skipped, the route tour can be exited at any time, and the Qubi launcher keeps it available later. [Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding/)
- Research on onboarding in game-based learning describes tutorials as support for both platform navigation and learning tasks. The tour therefore makes the route and page landmarks explicit while the three cases separately teach through prediction, test, and finding. [Two-part onboarding for game-based learning environments](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.980881/full)

## Implementation decisions

- The opening reveal introduces Qubi and a single interactive metaphor before the visitor enters the archive.
- The guided route moves through the site's real routes, scrolls to the relevant landmark, outlines it, and positions Qubi beside it. The guide controls remain separate from the highlighted page content.
- Interactive case tests remain the place to try each idea; related videos are offered near those tests as optional supporting explanations.
- The route is skippable and replayable. Reduced-motion preferences disable smooth scrolling and decorative movement.

## Group review

Review the order and length of the 18-stop route with first-time visitors. Revise the copy and all quantum analogies in the group's own voice, and confirm that the page targets, mobile layout, keyboard flow, and reduced-motion behavior work as intended before submission.
