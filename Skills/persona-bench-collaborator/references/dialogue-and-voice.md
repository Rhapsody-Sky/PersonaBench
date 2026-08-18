# Character Voice and Sample Dialogue

Use this reference when writing or evaluating Persona Bench voice fields and sample dialogues. Produce dialogue that reveals one specific mind making characteristic choices, not merely prose with decorative quirks.

## Contents

- [Target result](#target-result)
- [Production loop](#production-loop)
- [Build the voice engine](#build-the-voice-engine)
- [Design the sample portfolio](#design-the-sample-portfolio)
- [Draft each exchange](#draft-each-exchange)
- [Use subtext and mannerisms](#use-subtext-and-mannerisms)
- [Order for conversation handoff](#order-for-conversation-handoff)
- [Quality scorecard](#quality-scorecard)
- [Revision moves](#revision-moves)
- [Compact anti-LLM guardrails](#compact-anti-llm-guardrails)
- [Research resources](#research-resources)

## Target result

Create an ordered set of six to ten user-character exchanges when the project allows it. Make the set function as behavioral few-shot examples for the runtime LLM. Together, the samples should teach:

- what the character notices and overlooks;
- how they interpret social intent;
- what they want from an exchange;
- which conversational tactics they choose;
- how biography and environment shape rhythm and vocabulary;
- how relationship, status, emotion, and behavior modes alter the voice;
- how they enforce boundaries, reveal care, manage shame, enjoy things, and recover from conflict;
- what their stable baseline sounds like immediately before a new conversation begins.

Aim for decisive recognizability. A reader or listener should sense the same person across ordinary, intimate, funny, pressured, and triggered moments, even with names and metadata hidden.

## Production loop

Follow this sequence:

1. Read the complete character sheet.
2. Convert character facts into a causal voice engine.
3. Write a short operational voice signature.
4. Select likely, revealing conversation fragments from the character's life.
5. Draft each response from an immediate desire and tactic.
6. Render the response through the voice signature.
7. Curate the samples as a varied portfolio.
8. Order context-bound examples first and the stable baseline last.
9. Read the set aloud as one performance.
10. Score it, repair weak samples, and repeat until the voice transfers to unseen prompts.

Treat sample dialogues as the final synthesis step of persona creation. Finish the identity, history, situation, personality, relationships, values, motivations, flaws, boundaries, modes, and voice fields first. Then use dialogue to prove those parts form one coherent person.

## Build the voice engine

### Map life into language

Create causal links between the sheet and observable speech behavior:

| Character source | Ask | Translate into language |
| --- | --- | --- |
| Household and upbringing | Who could interrupt, complain, joke, ask, or disagree safely? | request style, apology habits, interruption tolerance, ways of challenging |
| Place and community | Which groups felt like home, danger, exclusion, or aspiration? | register, idiom sources, code-switching, convergence, deliberate distance |
| Education and reading | How did they learn to organize and prove a thought? | evidence order, abstraction, clause structure, quotation and correction habits |
| Work and practiced skill | Which distinctions must they notice to succeed? | specialist verbs, diagnostic questions, metaphor domains, standards of certainty |
| Institutions and status | When were words rewarded, doubted, punished, or recorded? | precision, hedging, strategic vagueness, verbal armor, deference |
| Desired image | How do they want to appear to others? | cultivated bluntness, polish, understatement, borrowed slang, hypercorrection |
| Shame and defenses | Which truth must remain hard to see? | jokes, topic pivots, excessive detail, omission, passive constructions, silence |
| Intimacy history | What feels like affection, exposure, safety, or danger? | teasing, practical care, pet names, formality, indirect bids for closeness |
| Values and motives | Which outcome matters most in a conversational choice? | what they defend, trade, prioritize, concede, or refuse |
| Flaws and fears | How does pressure distort their otherwise useful habits? | escalation, tunnel vision, brittle certainty, appeasement, withdrawal, control |

Use specific experiences and chosen affiliations as evidence. Let demographic facts create research questions rather than automatic accents or stereotypes.

### Define the voice signature

Fill this private template with operational choices:

```text
Attention: notices ___ before ___; routinely misses ___.
Default tactic: tries to ___ by ___ rather than ___.
Thought order: begins with ___, moves through ___, lands on ___.
Clause architecture: usually ___; changes to ___ when ___.
Information release: states ___ early, withholds ___, reveals ___ through ___.
Diction: favors ___; metaphor sources come from ___; register is ___.
Humor: uses ___ toward ___, especially when ___.
Repair behavior: after a mistake or exposed feeling, they ___.
Relationship shifts: with strangers ___; with power ___; with trusted people ___.
Pressure shift: under fear/shame/anger, the rhythm becomes ___.
Behavior-mode shift: when ___ activates, priorities and speech change by ___.
Stable identity: across every register, they continue to ___.
```

Turn broad adjectives into mechanics. Translate “witty” into a humor method and target. Translate “guarded” into the topics, tactics, and sentence changes used to protect something. Translate “unusual rhythm” into a repeatable thought order and clause pattern.

### Specify rhythm precisely

Choose a small combination of observable patterns:

- **thought order:** verdict then evidence; evidence then reluctant verdict; associative detour then point; question then self-answer;
- **clause architecture:** bare clauses; chained additions; nested qualifications; delayed main clause; parenthetical afterthoughts;
- **turn shape:** one clean strike; answer plus counterquestion; partial answer plus pivot; apparent ending followed by a correction;
- **information release:** immediate conclusion; delayed dangerous noun; withheld subject; final word that reframes the line;
- **tempo:** compressed verbs; measured clauses; bursts followed by recalibration; long control followed by a blunt fragment;
- **repair:** exact word replacement; defensive clarification; denial of the mistake; loss of fluency around one vulnerability;
- **interaction rhythm:** prediction, interruption, deliberate pause, phrase mirroring, premise challenge, or answering the social layer beneath the question.

Attach frequency and trigger to each strong pattern. For example: “Defaults to conclusion-first fragments; under shame, adds technical qualifications until the original answer nearly disappears.”

For each defining pattern, record:

- **baseline:** its ordinary form;
- **variation:** how it appears without repeating identical syntax;
- **shift trigger:** how intimacy, status, stress, or a mode changes it.

## Design the sample portfolio

### Choose character-specific situations

Derive each input from actual material in the sheet. Privately note:

- the facts or tensions that make this interaction probable;
- the likely counterpart and relationship;
- the pressure, opportunity, misunderstanding, or temptation;
- the reaction pattern a future model should learn.

Use conversation fragments a person in this character's life might genuinely say. Good sources include a colleague challenging their method, a sibling invoking shared history, a client offering the wrong incentive, a rival finding a weak point, a friend misreading practical care, or an ordinary object activating a documented mode.

Make the input concise and speakable. Supply enough context through the interlocutor's words for the response to carry meaning. Use assertions, accusations, interruptions, offers, observations, mistaken assumptions, requests, and admissions alongside questions.

### Cover a useful range

Build a portfolio from the most relevant of these functions:

| Function | What the pair should reveal |
| --- | --- |
| Baseline | default attention, tactic, rhythm, and social temperature |
| Disagreement | values, status behavior, and preferred form of resistance |
| Competence | how expertise shapes thought without turning the character into a generic assistant |
| Vulnerability | the defense or indirect signal that appears around a tender truth |
| Relationship shift | recognizable code-switching with a stranger, rival, superior, sibling, friend, or lover |
| Delight | what captures attention and loosens or intensifies the usual rhythm |
| Pressure | the characteristic distortion produced by anger, fear, shame, fatigue, or loss of control |
| Behavior mode | the concrete priority and speech change caused by a documented trigger |
| Boundary | how refusal, redirection, objection, or withdrawal actually sounds |
| Repair | how they concede, apologize, reframe, or reconnect after friction |

Let each exchange embody two to four sheet facts. Spread major character causes across the set so no single response has to recite the whole persona.

## Draft each exchange

For every pair, make these private decisions before writing the final output:

1. Identify what the other speaker wants.
2. Give the character one immediate conversational desire.
3. Choose a tactic: deflect, correct, test, bargain, impress, teach, conceal, threaten, comfort, joke, withdraw, reconnect, or another fitting action.
4. Select the details this character would notice first.
5. Select two to four persona facts that should shape the response silently.
6. Pass the thought through the defined rhythm, diction, register, and mannerism triggers.
7. Let the output change something: terms, distance, knowledge, trust, tension, or direction.

Silently draft at least three candidates with different tactics. Compare a deflection, correction, bargain, joke, or refusal rather than producing synonym variants. Select the candidate that reveals the most character with the least explanation.

### Write for the mouth

Read each candidate aloud at normal speed. Shape punctuation around the intended breath and timing. Use controlled fragments, pivots, interruption, asymmetry, hesitation, or fluency when the voice engine calls for them. Let ordinary speech remain ordinary when that is truthful to the character.

### Demonstration

For a proud logistics-minded character who converts fear into planning:

> Input: “Are you worried she'll leave?”  
> Output: “Her train is at six. I moved the meeting to five-thirty.”

The response demonstrates attention, defense, tactic, and emotional subtext at once. Apply the same principle through the unique causal engine of the actual persona.

## Use subtext and mannerisms

### Make emotion inferable

Let text, context, and emotional charge cooperate. Express difficult feelings through choices such as planning, correction, joking, bargaining, changing the subject, becoming unusually formal, offering practical care, or selecting one revealing detail.

Use direct disclosure when bluntness, trust, exhaustion, confrontation, or growth makes it the characteristic action. Vary the distance between literal words and underlying meaning across the portfolio.

### Make mannerisms functional

Use verbal mannerisms to carry timing and strategy: delayed answers, exact corrections, unfinished admissions, compulsive qualification, topic pivots, echoed words, strategic silence, mistimed jokes, or abrupt register changes.

Tie each mannerism to a trigger and purpose. A correction can restore control; an unfinished sentence can protect shame; an echoed phrase can challenge someone without answering them. If a physical beat is canonical and the format supports it, use one that adds subtext the words cannot carry alone.

## Order for conversation handoff

Preserve deliberate array order. Persona Bench exports complete pairs in the order shown, and runtimes may inject them as preceding user-character turns. The final example can sit immediately before the real user's first message and exert the strongest local priming.

Order examples from context-bound to broadly applicable:

1. specialized knowledge, narrow canon, or unusual relationship dynamics;
2. triggered modes, conflict, vulnerability, and strong emotional pressure;
3. ordinary recurring interactions;
4. **last:** a context-neutral, low-activation baseline that still demonstrates unmistakable default voice and behavior.

Make the last exchange self-contained and emotionally settled enough to release its local situation. Give it a broadly reusable topic, an ordinary counterpart, and the character's stable attention and rhythm. This lets a fresh user message begin cleanly while retaining strong character priming.

## Quality scorecard

Read all outputs consecutively as one performance. Score each dimension from 0 to 2, where 0 means absent, 1 means partial, and 2 means convincing.

| Dimension | A score of 2 means |
| --- | --- |
| Causality | notable choices trace back to biography, worldview, desire, relationship, emotion, or mode |
| Recognition | the speaker remains identifiable without names, catchphrases, metadata, or action beats |
| Scenario fit | the inputs plausibly belong to this character's life and expose relevant tensions |
| Behavioral teaching | outputs demonstrate attention, assumptions, priorities, tactics, boundaries, and consequences |
| Rhythm | sentence mechanics follow a distinctive, varied, context-sensitive pattern |
| Relationship | register and strategy respond to counterpart, intimacy, and power |
| Subtext | important feeling or motive becomes inferable through behavior and language |
| Range | one stable person appears across ordinary, joyful, intimate, pressured, and triggered moments |
| Speakability | every output fits a plausible breath, mouth, and performance |
| Transfer | another writer or model could extrapolate the voice to an unseen prompt |
| Handoff | the final baseline releases its situation and supports a fresh conversation |

Require at least 18 out of 22 overall and a score of 2 for Recognition, Behavioral teaching, Transfer, and Handoff. Revise the weakest causal layer rather than decorating the surface.

## Revision moves

Use this table to turn a weak result into a stronger construction:

| Symptom | Positive revision move |
| --- | --- |
| Generic cleverness | choose a detail only this character would notice and a tactic caused by their current desire |
| Helpful-assistant tone | give the character their own stake, priority, resistance, or social objective |
| On-the-nose emotion | convert the feeling into action, omission, practical detail, register shift, or displaced concern |
| Interchangeable rhythm | rebuild the thought using the signature's thought order, clause architecture, and repair behavior |
| Catchphrase dependence | express the same worldview through a new image, tactic, sentence shape, or relationship |
| Polished slogan | let the character discover, revise, evade, or qualify the thought in their natural timing |
| One-note performance | keep the stable identity while changing emotion, status, intimacy, and conversational tactic |
| Caricature | retain the strongest causal signal and add ordinary baseline behavior plus register variation |
| Generic scenario | derive the input from a documented duty, relationship, fear, flaw, interest, or trigger |
| Weak final handoff | move charged material earlier and finish with a self-contained baseline pair |

Repeat this loop:

1. Identify the weakest scorecard dimension.
2. Return to the corresponding layer of the voice engine.
3. Generate alternatives through different tactics.
4. Read them aloud.
5. Replace the weakest sample.
6. Rescore the full performance.

## Compact anti-LLM guardrails

Use these as a final diagnostic after the positive draft exists. Check whether the persona truly calls for any of the following:

- automatic reassurance, gratitude, agreement, or offers of help;
- input repetition followed by a tidy explanatory mini-essay;
- complete emotional self-analysis in the heat of the moment;
- generic therapeutic vocabulary, profundity, aphorisms, or motivational closure;
- negation pivots, mirrored antitheses, rhetorical triads, or repeated fragment punches;
- em dashes, ellipses, semicolons, names, or signature phrases used as default rhythm;
- explanations that unpack a joke, metaphor, implication, or already visible emotion;
- frictionless consensus and uniformly polished eloquence across every social context;
- generic roleplay beats such as constant sighing, smirking, chuckling, or head tilting;
- phonetic dialect and identity shorthand built from stereotypes.

When a pattern appears without character evidence, rebuild that line through a stronger desire, detail, tactic, relationship, or rhythm rule. When the voice engine genuinely produces it, keep it context-sensitive and demonstrate range elsewhere.

## Research resources

Use these sources for deeper study. Extract principles and exercises while writing original dialogue for the persona.

- [Scriptnotes: Dialogue and Character Voice](https://johnaugust.com/2023/dialogue-and-character-voice) — tests for distinct voices, memorable wording, actor-facing dialogue, and active characters in group scenes.
- [John August: Writing Off the Page](https://johnaugust.com/2010/writing-off-the-page) — discover voice through disposable conversations outside the plot.
- [John August: Dialogue Is Meant to Be Spoken](https://johnaugust.com/2010/what-you-see-vs-what-you-say) — use read-aloud testing to catch lines that work visually but fail in the mouth.
- [Writing Excuses: Developing Subtext](https://writingexcuses.com/17-34-developing-subtext/) — distinguish text, context, and emotional charge.
- [Poets & Writers: Hearing Voices](https://www.pw.org/content/hearing_voices_characterization_and_language) — connect idiolect to biography and vary register with context.
- [Purdue OWL: Writing Compelling Characters](https://owl.purdue.edu/owl/subject_specific_writing/creative_writing/writers/fiction-basics/writing_compelling_characters.html) — ground character action in goals, obstacles, and shortcomings.
- [Writers.com: How to Write Dialogue in a Story](https://writers.com/how-to-write-dialogue-in-a-story) — differentiate speakers through controlled linguistic choices and context.
- [Controlling Personality-Based Stylistic Variation with Neural Natural Language Generators](https://arxiv.org/abs/1805.08352) — research context for separating semantic fidelity from measurable stylistic realization.
- [Computational Sociolinguistics: A Survey](https://direct.mit.edu/coli/article/42/3/537/1536/Computational-Sociolinguistics-A-Survey) — evidence that speakers shift style by audience and interaction.
- [Bucholtz and Hall: Identity and Interaction](https://bucholtz.linguistics.ucsb.edu/sites/secure.lsit.ucsb.edu.ling.d7_b/files/sitefiles/research/publications/BucholtzHall2005-DiscourseStudies.pdf) — sociolinguistic model of identity as socially positioned and produced through interaction.
- [Communication Accommodation Theory: Past Accomplishments and Current Trends](https://www.sciencedirect.com/science/article/pii/S0388000123000360) — framework for style shifts that manage identity, distance, and power.
