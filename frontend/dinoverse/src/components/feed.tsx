import React from 'react';

import Post from './post';

const posts = [
    { username: "TinyArmsBigHeart", content: "Why do door handles have to be so high up? This is discrimination." },
    { username: "RexRants", content: "@HerbivoreHero won’t shut up about fiber. Bro, we get it, you **** a lot." },
    { username: "HerbivoreHero", content: "Why do carnivores always talk about protein? Ever heard of fiber? (Also @RexRants stop talking about me.)" },
    { username: "AstroDino", content: "Anyone else notice that growing light in the sky? Or am I just being paranoid?" },
    { username: "DippyLongNeck", content: "The real reason we have long necks is to avoid awkward eye contact at the waterhole." },
    { username: "ClubTailWarrior", content: "Hey @CarnivoreKing, remember when you said ‘I’m the top predator’? My tail says otherwise. How’s your shin?" },
    { username: "CrestedCrier", content: "Can we PLEASE stop acting like Triceratops is the only cool one with a headpiece? My crest is literally built-in surround sound." },
    { username: "RaptorRogue", content: "Yo @VelociRipped, stop flexing in the river’s reflection. We’re supposed to be hunting." },
    { username: "MeteorTruthers", content: "‘The meteor is coming’ blah blah blah. Y’all really believe everything Big Science says? Wake up, sheeple." },
    { username: "DinoLover92", content: "Pterodactyls aren’t dinosaurs? Oh okay, and next you’re gonna tell me @AstroDino isn’t crazy for screaming at the sky every day." },
    { username: "LeafLover", content: "Not all dinosaurs eat meat. Some of us enjoy a good salad. Meanwhile, @ClubTailWarrior out here cracking knees." },
    { username: "CarnivoreKing", content: "Imagine having to chew your food. Couldn’t be me. Chomp and gulp, baby." },
    { username: "DoomedDino", content: "I don’t get why everyone’s freaking out. It’s just a rock. Probably nothing. (Also @AstroDino, calm down.)" },
    { username: "EggProtector", content: "HEY @RaptorRogue STOP STEALING MY EGGS AND CALLING IT ‘MEAL PREP’ I SWEAR TO—" },
    { username: "SpikyDefense", content: "Who needs speed when you have a tail that can shatter femurs? (Looking at you, @CarnivoreKing.)" },
    { username: "PaleoKaren", content: "‘Extinction event’ this, ‘end of an era’ that. Y’all are so dramatic." },
    { username: "necktoolong", content: "Ever tried scratching your back when your neck is 30 feet long? Yeah, didn’t think so. (Also @DippyLongNeck, I know you feel my pain.)" },
    { username: "MeteorBeliever", content: "@MeteorTruthers called me crazy. Who’s crazy now?" },
    { username: "BrontoBroski", content: "Why are y’all so obsessed with running? Just be large and hope for the best." },
    { username: "PteroNoYouDidnt", content: "Why do people assume I can’t land? Bro, I just don’t want to. Also @DinoLover92 stop spreading lies." },
    { username: "velociripped3223", content: "@RaptorRogue stop acting like you’re the alpha when you skipped leg day." },
    { username: "FossilFighter", content: "Imagine getting buried for millions of years just for some dude in khakis to dig you up and call you ‘a find.’" },
    { username: "TailslapTyrant", content: "Y’all ever just smack a predator so hard he starts reconsidering his life choices? (Hi @CarnivoreKing.)" },
    { username: "RockDodger", content: "Tried moving out of the way of the meteor. Didn’t work. Thoughts?" },
    { username: "TinyClawsBigDreams", content: "If I type slow, mind your business. You try using two fingers to text." },
    { username: "TriceraTopsTier", content: "@CrestedCrier sounds mad jealous. Sorry my horns are iconic." },
    { username: "LeafItAlone", content: "Y’all carnivores keep talking about ‘hunt or be hunted’ while I’m just over here vibing with my ferns." },
    { username: "SkullCrusher6", content: "I headbutted a tree yesterday. Zero thoughts, only impact." },
    { username: "DinoDrip", content: "Why did no one tell me scales were out and feathers were in?? I look ridiculous." },
    { username: "SpinoSpitter", content: "Jurassic Park did me dirty. I don’t even look like that, bro." },
    { username: "ClawMyGod", content: "Just trimmed my talons and immediately regret it. I can’t hold anything." },
    { username: "FeatheredFiend", content: "Oh, NOW y’all respect me? Back in the day, everyone called me a big chicken." },
    { username: "Extinct_AF", content: "Some days you’re on top of the world. Other days, a rock ends your entire bloodline." },
    { username: "TyrannoDrama", content: "@TinyArmsBigHeart still crying about door handles while I’m out here trying to survive." },
    { username: "cometttt33", content: "@MeteorBeliever owes me an apology. And maybe a bunker." },
    { username: "SnackSized", content: "I swear if ONE MORE T. rex calls me a ‘walking appetizer’ I’m gonna lose it." },
    { username: "bigmoodsauropod", content: "Why is everyone so stressed? Just be 40 tons and nothing can hurt you. (Except meteors.)" },
    { username: "RockSnack", content: "You guys ever eat a rock just to see what happens? Asking for a friend." },
    { username: "HotBlooded", content: "@LeafLover okay but have you ever tried steak? Just saying." },
    { username: "Bonecollector", content: "@RaptorRogue dude, why do you hoard so many bones? You don’t even eat them, weirdo." },
    { username: "PrehistoricPat", content: "Would love to hang out with y’all but I just sank into a tar pit. RIP me I guess." },
    { username: "tinyarms_bigheart", content: "bro i dropped my phone and now it’s just... there. forever." },
    { username: "REX.RANTS", content: "@herbivorehero still won’t shut up about fiber. bro ur entire personality is salad." },
    { username: "herbivorehero", content: "some of us enjoy a balanced diet, @REX.RANTS. go choke on a femur." },
    { username: "astro_dino", content: "guys the big light in the sky is getting bigger. im NOT crazy." },
    { username: "DIPPYlongNeck99", content: "water tastes better when u almost fall in trying to drink it." },
    { username: "clubtail_warrior", content: "do you think i feel bad about shattering @carnivoreking’s ankle? i do not." },
    { username: "CrestedCryBaby", content: "ppl keep saying triceratops is ‘majestic.’ okay and?? my crest is literally a natural speaker system." },
    { username: "raptor_rogue", content: "@velociRIPPED ur legs are tiny bro why do u act like u got speed" },
    { username: "METEOR_TRUTHER_420", content: "wake up. the gov’t doesn’t want you to know that meteors are just sky propaganda." },
    { username: "jurassicjeff", content: "do you think fish know they’re wet or do they just think that’s how life is" },
    { username: "leafluvr", content: "eating plants isn’t a ‘personality trait’ it’s a lifestyle. respect it." },
    { username: "CARNIVOREKING", content: "herbivores say ‘salad’ like it’s a real meal. bro that’s a side dish." },
    { username: "doomed.dino", content: "y’all stress too much. the sky rock is probs just a shooting star. make a wish lol" },
    { username: "eggprotector.mad", content: "@raptor_rogue stop calling it ‘meal prep’ that’s MY CHILDREN" },
    { username: "SPINY_DEFENSE", content: "someone tried to sneak up on me today. keyword: tried." },
    { username: "paleoKaren", content: "this extinction nonsense is just fearmongering. bet we’ll be fine." },
    { username: "rockdodger", content: "tried moving out of the way of the meteor. update: it’s still coming." },
    { username: "TINYclaws_BIGdreams", content: "typos aren’t my fault. try texting with two fingers." },
    { username: "tricera_TOPS", content: "why do people think i can’t fight? u ever seen my horns?? i’m basically a medieval war machine." },
    { username: "velociRIPPED", content: "@raptor_rogue keep talking when u have my muscle mass." },
    { username: "snack.sized", content: "just because i’m small doesn’t mean i’m food. @carnivoreking back off." },
    { username: "notapet_", content: "baby raptors are cute until they grow up and eat your whole family." },
    { username: "bigmoodsauropod", content: "when ur 40 tons nothing matters. except meteors. those matter." }
];


const Feed = () => {
  return (
    <div className="flex flex-col gap-4 px-4">
      {posts.map((post, index) => (
        <Post className='w-full' key={index} username={post.username} content={post.content} />
      ))}
    </div>
  );
};

export default Feed;