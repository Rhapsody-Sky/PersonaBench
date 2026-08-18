# Character Dialogue Options

Use this reference when the human asks what a character could say next, requests several response candidates, explores alternate lines for the same moment, or wants better options before choosing a sample dialogue. The goal is a set of distinct **character decisions expressed as dialogue**, not tonal rewrites of one answer.

## Target result

Generate several lines that all plausibly come from the **same character state at the same instant**, while representing meaningfully different conversational moves. Each option should reveal a different way this character might resolve a live tension: protect the relationship, protect status, regain control, tell part of the truth, test the other speaker, retaliate, withdraw, bargain, joke, redirect, or take another character-specific action.

The options must remain inside one plausibility envelope. They share the same canon, knowledge, relationship, emotional pressure, and active behavior modes. They may produce different immediate consequences, but they may not smuggle in a different personality, unseen information, a new emotional state, or a convenient piece of backstory merely to create variety.

A strong option set makes the human think, “Yes, she could choose any of these — and each choice would take the interaction somewhere different.”

## Decision before diction

Do not begin by searching for clever wording. First determine what the character could **do conversationally**. Voice is the rendering layer applied after the behavioral choice.

Privately build this state packet from the complete character sheet and the supplied scene:

```text
External moment: what has just happened or been said.
Known facts: what the character actually knows here.
Beliefs: what they currently infer, suspect, or incorrectly believe.
Relationship: who the other speaker is to them; intimacy, history, debt, trust, resentment.
Power: who can punish, leave, expose, refuse, command, or withhold something.
Immediate want: what the character wants to happen in the next few beats.
Protected stake: what they do not want exposed, lost, conceded, or made real.
Emotional pressure: the current affect and how strongly it disrupts their baseline control.
Active mode: any behavior mode whose trigger is currently satisfied.
Available levers: information, affection, competence, status, humor, silence, threat, practical action, etc.
Voice state: which speech-style, vocabulary, mannerism, register, delivery, gaze, body, and leakage rules are active here.
```

When scene context is sparse, infer conservatively from the persona. Keep uncertain assumptions out of the dialogue unless the line itself naturally expresses uncertainty.

## Epistemic integrity

Write from the character's mind, not the author's or model's overview.

- Let them be wrong when their evidence points them wrong.
- Let them misunderstand ambiguous remarks according to their habits, fears, expectations, and relationship history.
- Let them miss information they would realistically miss.
- Let them refuse a premise the other speaker assumes.
- Let them know routine facts without explaining those facts to someone who already knows them.
- Do not use a secret, motive, off-screen event, or other character's inner state as knowledge unless this character has a plausible route to it.

A perfectly informed answer is often less character-faithful than a partial, biased, defensive, or mistaken one.

## Find the live tension

Before generating options, identify at least one tension with two or more pulls on the character. Good option sets usually come from competing priorities rather than arbitrary creativity.

Examples of productive tensions:

- truth vs. self-protection;
- closeness vs. pride;
- duty vs. personal loyalty;
- curiosity vs. caution;
- control vs. the urge to lash out;
- status vs. practical necessity;
- compassion vs. resentment;
- immediate relief vs. long-term goal;
- keeping a secret vs. preventing harm;
- wanting reassurance vs. refusing to ask for it.

Derive these pulls from the sheet and current interaction. Do not assign a universal inner conflict to every character.

## Generate behavioral forks

Create options by resolving the live tension in different plausible ways. Each fork gets one dominant conversational action.

Useful actions include:

- answer directly;
- answer only the safe part;
- correct the premise;
- redirect to a practical detail;
- ask a counterquestion;
- test whether the other person already knows;
- bargain or set terms;
- challenge status or authority;
- make a joke that changes the temperature;
- provoke to regain control;
- offer practical care instead of emotional disclosure;
- concede a small point to protect a larger one;
- lie, omit, or strategically blur;
- withdraw, refuse, or end the exchange;
- begin an admission and abort it;
- say the dangerous truth because this is the rare moment the character actually would.

Treat this as a palette, not a quota. Never force a joke, attack, lie, confession, or refusal simply to diversify the list.

### Fork independence test

Summarize each option with a verb phrase stripped of its wording. The summaries should describe different actions.

Weak set:

- reassures them warmly;
- reassures them tersely;
- reassures them with humor.

Strong set:

- reassures them by taking over the practical problem;
- denies the premise and changes the subject;
- tests whether they are planning to leave;
- admits the fear before pride can stop it.

If two options would create essentially the same next beat, merge them or replace one.

## Render the fork through character

After choosing the action, write the line through the voice engine in `dialogue-and-voice.md`.

For every candidate:

1. Decide what the line is trying to make the other person do, believe, feel, stop, reveal, or concede.
2. Choose what this character notices or responds to first.
3. Decide what remains unsaid and whether the character knows they are withholding it.
4. Apply the relationship-specific register and current power dynamic.
5. Apply the character's thought order, clause architecture, diction, rhythm, information release, humor, and repair behavior.
6. Apply the relevant micro-performance: exact pause placement, response latency, emphasis, delivery, gaze, microexpression, gesture, posture, or leakage. Use only cues that reveal this character in this moment.
7. Let emotional pressure distort the baseline in the documented character-specific way.
8. Choose the shortest natural length that completes the tactic.
9. End on a line or beat that gives the other speaker something real to react to.

Dialogue may be elegant when the character is elegant. It may also be clumsy, evasive, unfair, overlong, poorly timed, self-sabotaging, or frustrating when that is the more truthful human behavior.


### Performance before decoration

A dialogue option is a small performance, not only a sentence. When the format allows action beats, decide what the listener would **hear and see**:

- which exact word is chosen and which nearby synonym this character would avoid;
- whether the answer comes immediately, after a beat, or after a failed start;
- where breath, emphasis, interruption, or self-correction lands;
- what the eyes, mouth, jaw, hands, posture, or distance do at the revealing moment;
- whether the visible behavior supports the words or leaks a conflicting feeling.

Choose at most one or two high-value cues per short option unless the character and moment genuinely require more. Do not attach a sigh, smirk, chuckle, head tilt, eyebrow raise, or ellipsis merely to make a line feel acted. The cue must teach something reusable about this person's performance.

Compare:

> “Yeah, that's fine,” she says nervously.

with:

> “Yeah.” Too fast. Her fingers stop on the zipper. “Yeah, that's fine.”

The second version exposes timing, repair, and leakage without naming the emotion. Use this level of specificity only when it belongs to the actual persona.

## Preserve one character across the set

Variety must come from **choice under tension**, not personality drift.

Across all options, preserve:

- core values and boundaries;
- established relationship history;
- current knowledge and ignorance;
- stable worldview and attention habits;
- active behavior modes;
- recognizable voice mechanics.

Vary:

- which competing priority wins this beat;
- conversational tactic;
- degree of disclosure;
- willingness to accept the other speaker's framing;
- risk tolerance;
- warmth or distance when the current relationship permits both;
- response length when different tactics naturally require different space.

Do not make one option “in character” and the others deliberately out of character for contrast.

## Allow inconvenient human behavior

A dialogue-option generator tends to optimize every candidate into a competent answer. Resist that pressure when the persona supports messier behavior.

A character may:

- answer the social threat instead of the literal question;
- hear accusation where none was intended;
- dodge something they could answer easily;
- fixate on an irrelevant detail because it matters to them;
- make the wrong joke;
- over-explain when cornered;
- become terse exactly when clarification would help;
- repeat a grievance instead of moving on;
- push away someone they want close;
- fail to articulate a feeling they understand only partially;
- realize halfway through a sentence that they have said too much.

Use these as consequences of personality, history, relationship, and pressure. Random awkwardness is only another surface gimmick.

## Subtext per option

Give each candidate a surface action and an underlying stake when the moment supports subtext.

For example, after “Are you worried she'll leave?” a logistics-minded character might plausibly choose among:

- **Regain control:** “Her train is at six. I moved the meeting to five-thirty.”
- **Challenge the premise:** “You keep saying ‘leave’ like she hasn’t bought a return ticket.”
- **Test the other speaker:** “Why? Did she say something to you?”
- **Rare directness:** “Yes. Happy?”

These are distinct because they do different things in the relationship and invite different next beats. Their differences are behavioral, not merely tonal.

## Option-set shape

When the human asks for “options” without specifying a count, produce **4 to 6**. Prefer fewer strong forks over a long menu of paraphrases.

Unless the human asks for analysis, present each option with a very short **action label** and the dialogue itself. Labels describe what the character is doing, not a generic mood.

Good labels:

- `Tests what they know`
- `Protects pride with logistics`
- `Offers a small truth`
- `Pushes them away first`

Weak labels:

- `Nice`
- `Mean`
- `Sarcastic`
- `Emotional`
- `Option 1`

If the output is being written into Persona Bench `sampleDialogues`, omit labels from the JSON. Once the human chooses an option, preserve only the actual `input` and `output` strings unless they explicitly request notes elsewhere.

When the human asks for dialogue lines only, output dialogue lines only.

## Diversity without game-menu syndrome

Do not construct a synthetic morality or tone wheel such as polite / funny / angry / romantic. Do not ensure that one option is always aggressive, one always kind, and one always witty.

Instead, ask: **what are the most plausible different things this particular person might try right now?** Some moments honestly permit only two strong forks. Other moments may permit six. The option space should be asymmetric because the character is asymmetric.

Do not manufacture diversity by making every option unusually quotable. At least some strong dialogue should sound like speech a person could actually produce before they had time to edit themselves.

## Anti-LLM option failures

Reject or revise a set when it shows these patterns without character evidence:

- all options answer the literal question cleanly;
- all options contain the same information in different phrasing;
- every option begins with a polished thesis statement;
- the character has full emotional self-knowledge in every branch;
- all options are equally articulate, equally long, and equally complete;
- “sarcastic” means generic quips unrelated to the character's humor method;
- every candidate sounds socially helpful, reasonable, cooperative, or emotionally healthy;
- options use generic therapeutic language, reassurance, motivational closure, or tidy conflict resolution;
- the model invents new facts so each candidate can be interesting;
- every branch explains its own subtext;
- catchphrases or quirks are sprayed across every line to signal identity;
- the choices form a videogame menu of obvious emotional stances instead of believable decisions.

## Quality gate

Score the full option set from 0 to 2 on each dimension.

| Dimension | A score of 2 means |
| --- | --- |
| State fidelity | every option begins from the same supplied moment and emotional state |
| Epistemic fidelity | every line uses only what this character could know, infer, misunderstand, or suspect |
| Character causality | the chosen tactic follows from documented motives, defenses, values, flaws, or relationship history |
| Fork distinctness | each option performs a meaningfully different conversational action |
| Consequence divergence | choosing a different option would plausibly change the next beat, relationship, or information flow |
| Voice | all options remain recognizably the same speaker without relying on catchphrases |
| Micro-performance | diction, timing, delivery, gaze, expression, body, and leakage follow the same character-performance system while responding naturally to each fork |
| Subtext | important stakes are carried through implication, omission, behavior, or deliberate directness appropriate to the character |
| Speakability | the lines feel performable in the current emotional and social conditions |
| Plausible surprise | at least some choices are less obvious than the generic LLM answer while still feeling inevitable in hindsight |

Require at least **18 out of 20**, with a 2 in State fidelity, Epistemic fidelity, Character causality, Fork distinctness, Voice, and Micro-performance. If the set fails Fork distinctness, regenerate from different conversational actions rather than rewriting the sentences.

## Compact generation loop

Use this loop whenever producing character dialogue options:

1. Read the character and immediate scene state.
2. Build the state packet.
3. Identify the live tension and competing pulls.
4. Generate several plausible behavioral forks.
5. Remove forks that require state drift, knowledge drift, or personality drift.
6. Render each remaining fork through the same voice engine.
7. Run the fork independence test.
8. Check consequence divergence and speakability.
9. Present the strongest 4 to 6, or fewer when the character genuinely has fewer plausible choices.

The governing rule is: **one person, one moment, several plausible decisions.**
