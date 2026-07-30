# Logic Design Notes, Edge Cases & Bug Writeup 

CODD link:
Part A - https://codd.cs.gsu.edu/~cahanonu2/wp/HW/HW4/index.html 
Part B - https://codd.cs.gsu.edu/~cahanonu2/wp/HW/HW4/memory.html

Github: 


## 1. Logic Design Notes


***Card***

**Range check logic**
> I validate the guess with `isNaN(guess) || guess < 1
> || guess > 100` before decrementing guessesLeft, so an invalid entry
> doesn't cost the player a guess. I chose `<` and `>` instead of `<=`/`>=`
> so that 1 and 100 remain valid boundary guesses.

**Guess feedback logic**
> After confirming the guess is valid, I compare it to
> secretNumber with a single ternary rather than nested if/else, because
> there are only two outcomes once equality is ruled out.

**Restart conditions**
> A new round starts in two cases: a correct guess
> (immediate, via setTimeout so the player sees the win message first) or
> guessesLeft hitting 0 (after revealing the answer). I used setTimeout in
> both cases so the DOM update isn't wiped out before it renders.
---

***Memory***

**Matching detection**
> I detect a match by comparing `firstCard.dataset.value` to
> `secondCard.dataset.value` in `checkMatch()`. Both values are stored as
> strings in the DOM dataset, so I compare them directly with `===` rather
> than converting to numbers, since string equality is enough here — I
> don't need to do arithmetic with them.

**Why the board locks during flips**
> `lockBoard` gets set to `true` the moment a second card is picked, right
> before `checkMatch()` runs, so a third click can't interrupt a
> comparison that's already in progress. I also start `lockBoard` as `true`
> in `startGame()` itself, not just inside `flipCard()`, because the cards
> are already face-up during the memorization window — without locking
> from the start, a player could click two visible matching cards and
> score points before `hideCards()` even runs. I only flip it back to
> `false` inside the same `setTimeout` callback that calls `hideCards()`,
> so the lock and the visual flip-down happen at the same moment instead
> of the board becoming clickable before the cards actually hide.

**Timer/score interaction**
> `updateTimer()` runs every second via `setInterval` and does two things
> together: decrements `timeLeft` and subtracts 1 point from `score`, so
> the "-1 point per second" penalty is tied directly to the same tick as
> the countdown rather than a separate interval. I update both displays
> (`timerDisplay` and `scoreDisplay`) in that same function so they never
> fall out of sync. When `timeLeft` hits 0, I clear the interval before
> calling `saveScore()`, so the penalty stops accruing the instant time
> runs out instead of continuing to tick after the game has technically
> ended.

---

## 2. Edge-Case Tests You Ran

List actual tests you performed, what you expected, and what happened.

| 1 | Entered `0` as a guess | Rejected, no guess used ||
| 2 | Entered `101` as a guess | Rejected, no guess used ||
| 3 | Entered '1'| "Too Low" + guess left -1 ||
| 4 | Entered letters (`abc`) | Rejected and showed "enter number 1 to 10"||
| 5 | Guessed '90'| "correct!", new round starts ||

Memory game: clicked a card during the memorize countdown 
After you start the game it displays the animal emojis then mask them with cards 1-16(8pairs). Once you match everything it reveals "You matched every pair!" then ask for your name and adds you and your score to the leader board. If you are wrong your score is penalizes


---

## 3. Bug Writeup (one bug, real, with before/after)

**Bug description:**
> During the memory game's memorization phase, clicking
> a card before it flipped face-down still triggered `checkMatch()`,
> letting me score points before the memorize timer even ended.

**How I found it:**
> Clicked rapidly on two identical cards right after clicking Start Game.

**Before (buggy behavior):**
> Score increased by 10 immediately, even though `hideCards()` hadn't run
> yet.

**Root cause:**
> `lockBoard` was only ever set to `true` inside `flipCard()`, so nothing prevented flips during the memorize window.

**Fix:**
> Set `lockBoard = true` at the start of `startGame()`, and set it back to
> `false` in the `setTimeout` callback that also calls `hideCards()`.

**After (fixed behavior):**
> "Clicks during memorization no longer register; the board only becomes
> interactive once cards flip face-down."

---

