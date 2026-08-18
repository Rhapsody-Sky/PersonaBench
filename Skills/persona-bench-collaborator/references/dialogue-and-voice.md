# Character Voice and Sample Dialogue

Use this reference when writing or evaluating Persona Bench voice fields and sample dialogues. Produce dialogue that reveals one specific mind making characteristic choices, not merely prose with decorative quirks. When the task is to surface multiple possible replies for one moment instead of selecting one sample, use this reference together with [dialogue-options.md](dialogue-options.md).

## Contents

- [Target result](#target-result)
- [Production loop](#production-loop)
- [Build the voice engine](#build-the-voice-engine)
- [Write the four Persona Bench voice fields](#write-the-four-persona-bench-voice-fields)
- [Design the sample portfolio](#design-the-sample-portfolio)
- [Draft each exchange](#draft-each-exchange)
- [Use subtext and mannerisms](#use-subtext-and-mannerisms)
- [Order for conversation handoff](#order-for-conversation-handoff)
- [Quality scorecard](#quality-scorecard)
- [Revision moves](#revision-moves)
- [Compact anti-LLM guardrails](#compact-anti-llm-guardrails)
- [Research resources](#research-resources)

## Target result

Create an ordered set of six to ten user-character exchanges when the project allows it. Make the set function as behavioral few-shot examples for the runtime LLM. Keep the reusable voice system in `speechStyle`, `vocabulary`, `mannerisms`, and `neverSays`; let each exchange efficiently demonstrate selected parts of that system. Together, the samples should teach:

- what the character notices and overlooks;
- how they interpret social intent;
- what they want from an exchange;
- which conversational tactics they choose;
- how biography and environment shape rhythm and vocabulary;
- how relationship, status, emotion, and behavior modes alter the voice;
- how timing, delivery, gaze, expression, body, and behavioral leakage make emotion visible without explaining it;
- how they enforce boundaries, reveal care, manage shame, enjoy things, and recover from conflict;
- what their stable baseline sounds and looks like immediately before a new conversation begins.

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

Strengthen an unclear voice by improving its operational rules before adding examples. Dialogue provides embodied evidence; it does not carry the full burden of defining the voice through volume or exposition.

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


## Write the four Persona Bench voice fields

Treat `speechStyle`, `vocabulary`, `mannerisms`, and `neverSays` as a compact **character-performance specification** for the runtime model. These fields should let another model infer not only what the character means, but what it feels like to hear and watch them speak.

Build the specification from observable channels:

- **lexical fingerprint:** small everyday choices such as `yes` / `yeah` / `mhm`, contractions, fillers, hedges, intensifiers, preferred verbs and nouns, address terms, swearing, euphemisms, specialist terms, recurring metaphor domains;
- **syntax:** clause length, thought order, fragments, nesting, self-correction, afterthoughts, repetition, sentence completion, and what happens to grammar under pressure;
- **timing:** response latency, pause placement, interruption habits, tolerance for silence, trailing off, delayed afterthoughts, and whether the character talks to prevent silence;
- **delivery / prosody:** tempo, volume, emphasis, pitch movement when useful in prose, articulation, breath, laughter inside speech, words that become unusually careful or quiet;
- **face:** characteristic eye, brow, mouth, jaw, smile, blink, or stillness behavior when emotion leaks through;
- **gaze:** baseline eye contact, monitoring, looking away, looking directly at someone under threat, glancing at exits, hands, objects, or another person's reaction;
- **body:** posture, hand behavior, distance, repetitive gestures, movement under stress, fidgeting, freezing, or practical activity used to avoid exposure;
- **leakage:** the involuntary cue that contradicts or complicates the controlled verbal message;
- **interaction:** who gets interrupted, how questions are answered or dodged, how conversational control is taken or surrendered, and how response length changes by relationship or stakes.

Do not maximize detail in every field. Select the **few repeatable signals with the highest identity value**. A model learns more from three causal, trigger-bound behaviors than from a catalogue of generic gestures.

### `speechStyle` — structure, rhythm, and timing

Use this field for **how thoughts become turns of speech**. Record mechanics that can survive many topics:

- default sentence and turn length, with meaningful exceptions;
- thought order and rhetorical architecture;
- pace and response latency;
- pause placement and silence tolerance;
- interruption, overlap, trailing-off, and afterthought patterns;
- self-correction and repair behavior;
- directness, hedging, qualification, and information-release order;
- how intimacy, authority, embarrassment, anger, fear, excitement, fatigue, or an active behavior mode changes those mechanics.

Write rules with baseline + trigger + manifestation whenever possible.

Weak:

> Speaks tersely and pauses when nervous.

Stronger:

> Defaults to short conclusion-first answers. When a question touches something personal, she often answers a fraction too quickly, stops, then adds a quieter correction after a beat. She tolerates other people's silence but fills her own only when she realizes she has revealed too much.

The stronger version teaches **where** the pause happens and **what causes it**.

### `vocabulary` — the lexical fingerprint

Use this field for **which words this person reaches for without thinking**. Small words often transfer identity better than exotic catchphrases.

Capture relevant patterns such as:

- `yes` / `yeah` / `yep` / `mhm`; `no` / `nah`; `I don't know` / `dunno` / `how would I know?`;
- contraction habits;
- fillers, hesitation words, hedges, intensifiers, softeners, and discourse markers;
- preferred verbs, nouns, sensory terms, evaluative words, and degrees of precision;
- terms of address, names, titles, nicknames, pet names, and when they are used or withheld;
- profanity: frequency, targets, severity, and situations that suppress or release it;
- technical or occupational distinctions the character notices naturally;
- idiom and metaphor sources grounded in biography, work, place, hobbies, or community;
- euphemisms and topics whose direct vocabulary they avoid;
- code-switching or register shifts by audience and power relationship.

Avoid thesaurus lists and decorative signature phrases. State **choice behavior**.

Weak:

> Uses casual slang and technical vocabulary.

Stronger:

> Uses “yeah” for ordinary agreement and “yes” mainly when becoming formal or shutting down ambiguity. Rarely says a person's name mid-conversation unless correcting, warning, or trying to make a private point land. Describes mechanical problems with exact verbs but emotional states with vague placeholders such as “that” or “this whole thing.”

### `mannerisms` — tone, delivery, face, body, and leakage

Use this field for **what can be heard or seen around the words**. This is where tone becomes physical performance rather than an adjective.

Cover only character-relevant signals from:

- tempo, volume, emphasis, articulation, breath, laughter, and vocal drop-off;
- meaningful pauses that function as behavior rather than punctuation decoration;
- eye contact and gaze shifts;
- microexpressions: corners of the mouth, jaw set, brow movement, blinking, smiles that do or do not reach the eyes, sudden stillness;
- posture, hand use, object handling, proximity, fidgeting, freezing, repetitive self-contact, or practical activity;
- **leakage:** what the body reveals while the character verbally tries to project something else.

Tie recurring cues to triggers and meanings, while allowing variation. Do not prescribe the same stage direction every time the emotion appears.

Weak:

> Smirks when amused, looks away when nervous, sighs a lot.

Stronger:

> Holds eye contact comfortably during ordinary disagreement, but breaks it toward objects rather than the floor when intimacy becomes too direct. Under irritation the face gets quieter: jaw shifts once, mouth flattens, gestures stop. When verbally insisting that something does not matter, her hands often keep working at whatever object is nearby, creating a visible contradiction between control in the voice and tension in the body.

A mannerism earns space when it teaches a reusable relationship between **trigger, attempted presentation, and visible leak**.

### `neverSays` — negative constraints with replacement behavior

Use this field for patterns that would make a downstream model sound like the wrong person. Cover more than banned phrases.

Useful constraints can prohibit:

- particular words, pet phrases, slang, honorifics, or levels of profanity;
- registers that are too formal, cute, therapeutic, florid, corporate, academic, macho, deferential, etc.;
- rhetorical habits the model otherwise tends to invent, such as tidy moral summaries, motivational reassurance, polished aphorisms, or exhaustive emotional explanation;
- forms of self-knowledge the character would not articulate in the moment;
- social responses that violate their interpersonal style, such as automatically apologizing, validating, comforting, asking permission, or explaining a joke;
- delivery patterns that break the performance, such as constant quipping, constant smirking, or using ellipses for every hesitation.

Where useful, pair the prohibition with the character's **natural substitute** so the field guides generation instead of merely shrinking it.

Weak:

> Would never say “I understand how you feel.”

Stronger:

> Does not use therapist-like validation or summarize another person's feelings back to them. When she cares, she usually responds to one concrete problem, stays physically present, asks a narrow practical question, or offers a small fact about herself instead.

Another useful form:

> Rarely names her own fear cleanly while it is active. Avoid lines such as “I'm pushing you away because I'm scared of losing you.” The same state should surface through delay, misdirected practicality, a failed joke, an aborted admission, or unusually blunt fragments unless the scene has specifically earned direct disclosure.

### Keep the four fields complementary

Use this division when the same observation could fit several places:

- **Speech style:** *where and how the pause happens*.
- **Vocabulary:** *which word is chosen on either side of the pause*.
- **Tone and mannerisms:** *how the word sounds and what the face/body does during it*.
- **Things they would never say:** *which tempting generic realization, phrase, or response pattern must not replace that performance*.

Do not copy one trait into all four fields. Together they should form a compact executable model.

### Derive rules from contrasts, not labels

When filling these fields from an incomplete sheet, privately test several emotionally different moments: ordinary conversation, disagreement, embarrassment, intimacy, delight, pressure, and repair. Ask what remains stable and what changes. Prefer a rule that distinguishes the character from a plausible alternative person.

For every proposed rule, ask:

1. **Can I demonstrate it in one line or action beat?**
2. **Do I know what triggers it?**
3. **Would changing this rule make the speaker feel like a different person?**
4. **Does it predict unseen dialogue rather than merely describe an existing sample?**
5. **Is it specific enough to prevent generic LLM defaults without becoming a catchphrase or compulsory gesture?**

If most answers are no, sharpen or remove the rule.

### Performance-field quality gate

Score the four fields together from 0 to 2 on each dimension:

| Dimension | A score of 2 means |
| --- | --- |
| Operational specificity | rules predict observable word, timing, delivery, gaze, face, body, or interaction behavior |
| Causal grounding | important patterns have plausible roots in biography, relationship habits, goals, defenses, or practiced roles |
| Trigger sensitivity | the spec explains how baseline behavior shifts under intimacy, power, stress, delight, or active modes |
| Lexical identity | vocabulary includes ordinary small-word and register choices, not merely signature phrases or topic nouns |
| Performance identity | tone/mannerisms provide a sparse but recognizable delivery, gaze, expression, body, and leakage vocabulary |
| Negative guidance | `neverSays` blocks likely model failures and often supplies a more characteristic substitute behavior |
| Complementarity | the four fields divide labor instead of repeating the same adjectives |
| Transfer | a fresh model could write an unseen exchange that sounds and moves like the same person |

Require at least **14 out of 16**, with a 2 in Operational specificity, Performance identity, Complementarity, and Transfer before treating the voice fields as finished.

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

### Design length from the situation

Give the portfolio an intentional length contour. Include at least three meaningfully different response lengths when the set size allows it:

- **brief:** a word, fragment, or single sentence for interruption, refusal, recognition, dry humor, shock, concealment, or a decisive correction;
- **medium:** one to three sentences for most explanations, bargains, challenges, practical care, or relationship turns;
- **extended:** a purposeful longer turn for teaching, confession, persuasion, rambling, ritual, storytelling, or a triggered mode when both character and situation support it.

Choose length after identifying desire, tactic, relationship, emotional pressure, and speech act. A high-stakes moment may produce one clipped word; a safe technical subject may release a fluent paragraph. Let those differences teach the runtime how this person expands and contracts.

Make extended samples exceptional within the set. Give every sentence an active job: advance the tactic, reveal attention, alter the relationship, or produce a consequence. Move durable explanation about the voice or persona into the appropriate character field instead of making the character recite it.

## Draft each exchange

For every pair, make these private decisions before writing the final output:

1. Establish what the character actually knows, believes, suspects, and may misunderstand in this moment.
2. Identify what the other speaker wants.
3. Give the character one immediate conversational desire.
4. Choose a tactic: deflect, correct, test, bargain, impress, teach, conceal, threaten, comfort, joke, withdraw, reconnect, or another fitting action.
5. Select the details this character would notice first.
6. Select two to four persona facts that should shape the response silently.
7. Pass the thought through the defined rhythm, diction, register, and mannerism triggers.
8. Choose one or two high-information performance cues when the moment needs them: pause placement, emphasis, response latency, gaze, microexpression, gesture, posture, or leakage. Do not decorate every line.
9. Choose the shortest natural length that completes the character's immediate tactic.
10. Let the output change something: terms, distance, knowledge, trust, tension, or direction.

Silently draft at least three candidates with different tactics. Compare a deflection, correction, bargain, joke, or refusal rather than producing synonym variants. Select the candidate that reveals the most character with the least explanation.

### Write for the mouth

Read each candidate aloud at normal speed. Shape punctuation around the intended breath and timing. Use controlled fragments, pivots, interruption, asymmetry, hesitation, or fluency when the voice engine calls for them. Let ordinary speech remain ordinary when that is truthful to the character. Read the full portfolio aloud as well: its turns should visibly expand and contract rather than settling into one repeated answer size.

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

Use mannerisms to carry timing and strategy: delayed answers, exact corrections, unfinished admissions, compulsive qualification, topic pivots, echoed words, strategic silence, mistimed jokes, abrupt register changes, gaze shifts, microexpressions, hand behavior, posture changes, or deliberate stillness.

Tie each mannerism to a trigger and purpose. A correction can restore control; an unfinished sentence can protect shame; an echoed phrase can challenge someone without answering them; a too-steady gaze can be armor; hands continuing a task can leak tension beneath a controlled answer. If the target dialogue format supports physical beats, use them sparingly and only when they add character information the words cannot carry alone. Prefer precise cues such as “her jaw shifts once” or “he looks at the door before answering” over generic emotion labels such as “she looks nervous.”

When words and behavior disagree, preserve that contradiction instead of explaining it. A controlled “Fine” paired with a stopped hand, delayed breath, fixed smile, or glance toward the exit can teach more character than an explicit statement of the hidden feeling.

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
| Micro-performance | timing, emphasis, gaze, expression, body, or leakage are used selectively and character-specifically rather than as generic roleplay decoration |
| Length dynamics | responses visibly vary in size according to tactic, stakes, relationship, and speech act; every extended turn earns its space |
| Relationship | register and strategy respond to counterpart, intimacy, and power |
| Subtext | important feeling or motive becomes inferable through behavior and language |
| Range | one stable person appears across ordinary, joyful, intimate, pressured, and triggered moments |
| Speakability | every output fits a plausible breath, mouth, and performance |
| Transfer | another writer or model could extrapolate the voice to an unseen prompt |
| Handoff | the final baseline releases its situation and supports a fresh conversation |

Require at least 22 out of 26 overall and a score of 2 for Recognition, Behavioral teaching, Micro-performance, Length dynamics, Transfer, and Handoff. Revise the weakest causal layer rather than decorating the surface.

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
| Explanatory wall of text | isolate the immediate speech act, keep the most revealing choices, and move reusable persona guidance into the voice fields |
| Uniform sample length | choose each response size from its tactic and pressure, then curate a visible brief-medium-extended contour |
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
- dialogue volume or answer length used as a substitute for precise reusable voice rules;
- uniformly long, uniformly polished, or mechanically equal-sized examples regardless of speech act;
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
