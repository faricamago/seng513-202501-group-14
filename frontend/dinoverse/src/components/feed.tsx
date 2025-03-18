import React from 'react';

import Post from './post';

const posts = [
    { username: "TinyArmsBigHeart", content: "Why do door handles have to be so high up? This is discrimination." },
    { username: "RexRants", content: "Stegosauruses out here acting like they got WiFi antennas on their backs. Grow up." },
    { username: "HerbivoreHero", content: "Why do carnivores always talk about protein? Ever heard of fiber?" },
    { username: "AstroDino", content: "Anyone else notice that growing light in the sky? Or am I just being paranoid?" },
    { username: "DippyLongNeck", content: "The real reason we have long necks is to avoid awkward eye contact at the waterhole." },
    { username: "ClubTailWarrior", content: "Carnivores be like ‘I’m the king of the jungle’—bro, this ain’t a jungle, and I just broke your shin." },
    { username: "CrestedCrier", content: "Triceratops get all the attention, but have you SEEN my head crest? I’m basically a walking trumpet." },
    { username: "RaptorRogue", content: "Y’all ever hunt in a pack and that one guy won’t stop chirping? Just shut up and pounce, Dave." },
    { username: "MeteorTruthers", content: "This so-called ‘meteor’ is just a myth created by Big Lava. Don’t be sheeple." },
    { username: "DinoLover92", content: "Pterodactyls aren’t dinosaurs? Oh okay, and Pluto’s not a planet. Cool story, science." },
    { username: "LeafLover69", content: "Not all dinosaurs eat meat. Some of us enjoy a good salad. It’s called balance, Karen." },
    { username: "CarnivoreKing", content: "Imagine having to chew your food. Couldn’t be me. Chomp and gulp, baby." },
    { username: "DoomedDino", content: "I don’t get why everyone’s freaking out. It’s just a rock. Probably nothing." },
    { username: "EggProtector", content: "Raptors keep stealing eggs and calling it ‘meal prep.’ Bro, that’s my child." },
    { username: "SpikyDefense", content: "Who needs speed when you have a tail that can crack femurs?" },
    { username: "PaleoKaren", content: "‘Extinction event’ this, ‘end of an era’ that. Y’all are so dramatic." },
    { username: "JurrasicJeff", content: "What if the bright thing in the sky is just the sun taking a selfie?" },
    { username: "NeckTooLong", content: "Ever tried scratching your back when your neck is 30 feet long? Yeah, didn’t think so." },
    { username: "MeteorBeliever", content: "Y’all laughed at me when I said the sky was falling. Who’s laughing now?" }
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