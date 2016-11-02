import React, { Component } from 'react';

export default class BonesJokes extends Component {
  componentDidMount() {
    this.nextJoke()
  }

  nextJoke = () =>
    this.setState({
      joke: randomJoke(),
      answered: false,
    })

  answer = () =>
    this.setState({answered: true})

  render() {
    if (!this.state) { return null }

    const {joke, answered} = this.state    
    return (
      <div onClick={answered ? this.nextJoke : this.answer}>
        <h1>{joke.q}</h1>
        {answered && <h2>{joke.a}</h2>}
        <cite>~xoxo, bones</cite>
      </div>
    )
  }
}

function randomJoke() {
  return jokes[Math.floor(Math.random() * jokes.length)]
}

const jokes = `Q: Who won the skeleton beauty contest? 
A: No body
Q: What do skeletons say before they begin dining? 
A: Bone appetit !
Q: When does a skeleton laugh? 
A: When something tickles his funny bone.
Q: Why didn't the skeleton dance at the Halloween party? 
A: It had no body to dance with.
Q: What type of art do skeletons like? 
A: Skull tures
Q: What did the skeleton say when his brother told a lie? 
A: You can't fool me, I can see right through you.
Q: What did the skeleton say while riding his Harley Davidson motorcycle? 
A: I'm bone to be wild!
Q: Why didn't the skeleton dance at the party? 
A: He had no body to dance with.
Q: What do you give a skeleton for valentine's day? 
A: Bone-bones in a heart shaped box.
Q: Who was the most famous skeleton detective? 
A: Sherlock Bones.
Q: Who was the most famous French skeleton? 
A: Napoleon bone-apart
Q: What instrument do skeletons play? 
A: Trom-BONE.
Q: What does a skeleton orders at a restaurant? 
A: Spare ribs!!!
Q: When does a skeleton laugh? 
A: When something tickles his funny bone.
Q: Why didn't the skeleton eat the cafeteria food? 
A: Because he didn't have the stomach for it!
Q: Why couldn't the skeleton cross the road? 
A: He didn't have the guts.
Q: Why are skeletons usually so calm ? 
A: Nothing gets under their skin !
Q: Why do skeletons hate winter? 
A: Beacuse the cold goes right through them !
Q: Why are graveyards so noisy ? 
A: Beacause of all the coffin !
Q: Why didn't the skeleton go to the party ? 
A: He had no body to go with !
Q: What happened when the skeletons rode pogo sticks ? 
A: They had a rattling good time !
Q: Why did the skeleton go to hospital ? 
A: To have his ghoul stones removed !
Q: How did the skeleton know it was going to rain ? 
A: He could feel it in his bones !
Q: What's a skeleton's favourite musical instrument ? 
A: A trom-bone !
Q: How do skeletons call their friends ? 
A: On the telebone !
Q: What do you call a skeleton who won't get up in the mornings ? 
A: Lazy bones !
Q: What do boney people use to get into their homes ? 
A: Skeleton keys !
Q: What do you call a skeleton who acts in Westerns ? 
A: Skint Eastwood !
Q: What happened to the boat that sank in the sea full of piranha fish ? 
A: It came back with a skeleton crew !
Q: What do you call a skeleton snake ? 
A: A rattler !
Q: What is a skeletons like to drink milk ? 
A: Milk - it's so good for the bones !
Q: Why did the skeleton stay out in the snow all night ? 
A: He was a numbskull !
Q: What do you call a stupid skeleton ? 
A: Bonehead !
Q: What happened to the skeleton who stayed by the fire too long ? 
A: He became bone dry !
Q: What happened to the lazy skeleton ? 
A: He was bone idle !
Q: Why did the skeleton pupil stay late at school ? 
A: He was boning up for his exams !
Q: What sort of soup do skeletons like ? 
A: One with plenty of body in it !
Q: Why did the skeleton run up a tree ? 
A: Because a dog was after his bones !
Q: What did the skeleton say to his girlfriend ? 
A: I love every bone in your body !
Q: Why wasn't the naughty skeleton afraid of the police ? 
A: Because he knew they couldn't pin anything on him !
Q: How do skeletons get their mail ? 
A: By bony express !
Q: Why don't skeletons play music in church ? 
A: They have no organs !
Q: What kind of plate does a skeleton eat off ? 
A: Bone china !
Q: Why do skeletons hate winter ? 
A: Because the wind just goes straight through them !
Q: What's a skeleton's favourite pop group ? 
A: Boney M !
Q: What do you do if you see a skeleton running across a road ? 
A: Jump out of your skin and join him !
Q: What did the old skeleton complain of ? 
A: Aching bones !
Q: What is a skeleton ? 
A: Somebody on a diet who forgot to say "when" !
Q: What happened to the skeleton that was attacked by a dog ? 
A: He ran off with some bones and didn't leave him with a leg to stand on !
Q: Why are skeletons so calm ? 
A: Because nothing gets under their skin !
Q: What do you call a skeleton that is always telling lies ? 
A: A boney phoney !
Q: Why didn't the skeleton want to play football ? 
A: Because his heart wasn't in it !
Q: What happened to the skeleton who went to a party ? 
A: All the others used him as a coat rack !
Q: What do you call a skeleton who presses the door bell ? 
A: A dead ringer !
Q: When does a skeleton laugh? 
A: When something tickles his funny bone.
Q: How did skeletons send their letters in the old days? 
A: By bony express!
Q: How do you make a skeleton laugh? 
A: Tickle his funny bone!`
  .split('\n')
  .reduce((all, row, i) =>
    i % 2 === 0
    ? [...all, {q: row}]
    : [...all.slice(0, all.length - 1), Object.assign({a: row}, all[all.length - 1])],
    [])