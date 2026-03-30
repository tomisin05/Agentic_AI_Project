export interface StoryTheme {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  gradient: string;
  characterName: string;
  characterAvatar: string;
  backgroundImage: string;
  chapters: {
    title: string;
    focused: {
      work: string;
      break: string;
    };
    struggling: {
      work: string;
      break: string;
    };
  }[];
}

export const STORY_THEMES: StoryTheme[] = [
  {
    id: 'dragon-warrior',
    name: 'Dragon Warrior',
    tagline: 'Defeat the Dragon of Distraction',
    icon: '🐉',
    gradient: 'from-red-600 to-orange-600',
    characterName: 'Alex',
    characterAvatar: 'https://images.unsplash.com/photo-1641444473327-ea736547d7bb?w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1637255499922-f15bc6c4153f?w=1080',
    chapters: [
      {
        title: 'Chapter 1: The Dragon Awakens',
        focused: {
          work: "Excellent! My sword of concentration cuts through the dragon's first wave of distractions. With shield raised and mind sharp, I advance steadily toward the beast. Each focused moment weakens its power over me. The dragon roars in frustration as my disciplined approach proves effective!",
          break: "Victory in the first skirmish! The Dragon of Distraction retreats, wounded by my focused assault. I've earned a moment's respite to tend my weapons and review battle tactics. The ancient knowledge grows closer with each successful engagement."
        },
        struggling: {
          work: "The dragon's flames of distraction are overwhelming me! My sword wavers, my shield feels heavy, and the beast advances with each moment my mind wanders. I must find my inner strength and remember why I fight - for the treasure of wisdom that lies beyond!",
          break: "The dragon has gained ground in this battle. Its fiery breath of scattered thoughts has left me singed and weary. But a true warrior learns from defeat. I'll use this respite to strengthen my resolve and plan a better strategy for the next encounter."
        }
      },
      {
        title: 'Chapter 2: The Battle Intensifies',
        focused: {
          work: "My battle prowess grows stronger! The dragon's attacks seem slower now as my focus-forged blade strikes with precision. I've learned its patterns of distraction and counter each with disciplined study. The beast begins to show real fear of my unwavering determination!",
          break: "Incredible progress! I've wounded the great dragon significantly with my concentrated efforts. The path to the treasure chamber is becoming clearer. My weapons shine brighter with each victory, and I can almost taste the sweet knowledge that awaits!"
        },
        struggling: {
          work: "The dragon adapts to my tactics, breathing new forms of confusion and doubt. My concentration falters under its relentless mental assault. Perhaps I'm trying to strike too hard, too fast. I need to remember that even the greatest warriors must sometimes retreat to regroup.",
          break: "This battle grows more challenging than expected. The dragon's experience shows as it exploits every moment of weakness in my focus. But legends aren't made from easy victories. I'll rest, recover, and return with renewed purpose."
        }
      },
      {
        title: 'Chapter 3: The Final Confrontation',
        focused: {
          work: "This is it - the final battle! My blade blazes with the light of pure concentration, and my shield bears the insignia of unwavering determination. The dragon unleashes its most powerful attacks, but I stand firm. Each focused moment brings me closer to claiming the ultimate prize!",
          break: "VICTORY! The mighty Dragon of Distraction lies defeated at my feet! The treasure chamber opens, revealing infinite scrolls of wisdom and knowledge. All my focused effort, every moment of disciplined study, has led to this triumphant moment. The knowledge is mine!"
        },
        struggling: {
          work: "In the final hour, when victory seemed within reach, the dragon musters its last desperate strength. My focus wavers at this crucial moment, and I can see the beast preparing for a final, devastating attack. I must dig deeper than ever before to find the strength to prevail!",
          break: "So close to victory, yet the dragon still draws breath. My scattered attention in these final moments has given it time to recover. But this is not the end - even the greatest heroes face setbacks before their ultimate triumph. The treasure still awaits the truly persistent."
        }
      }
    ]
  },
  {
    id: 'space-explorer',
    name: 'Space Explorer',
    tagline: 'Build your ship, discover new worlds',
    icon: '🚀',
    gradient: 'from-blue-600 to-purple-600',
    characterName: 'Nova',
    characterAvatar: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1080',
    chapters: [
      {
        title: 'Chapter 1: Launch Preparations',
        focused: {
          work: "Excellent progress on the ship's systems! Each focused session brings me closer to launch. The navigation computer is calibrating perfectly, and the fuel cells are charging efficiently. The cosmos awaits, and my disciplined approach to preparations ensures a successful mission!",
          break: "Systems check complete! My focused work has advanced the launch timeline significantly. The ship's AI reports all systems nominal. I've earned this break to review star charts and plan our route to the unknown galaxies ahead."
        },
        struggling: {
          work: "Warning! Distraction alerts are flooding the control panel. My scattered attention is causing system errors and delays. The ship's AI is concerned - we can't launch with this level of focus drift. I need to recalibrate my mental processes and lock onto the mission objective!",
          break: "Launch delayed due to incomplete preparations. My wandering mind has set back the mission timeline. But every great explorer faces setbacks. I'll use this break to refocus and remember why I chose this journey - to discover what lies beyond the stars."
        }
      },
      {
        title: 'Chapter 2: Through the Asteroid Field',
        focused: {
          work: "Navigating the asteroid field with precision! My concentration allows me to plot the perfect course through this cosmic obstacle. Each focused calculation brings me deeper into uncharted space. The stars shine brighter as I prove my worth as an explorer!",
          break: "Successfully cleared the asteroid field! My sharp focus and quick thinking saved the ship from collision. Scanning for new planets now... this break allows the long-range sensors to process the incredible data we're collecting!"
        },
        struggling: {
          work: "Collision alert! My distracted navigation is putting the ship at risk. Asteroids are coming too close, and I'm missing optimal routes. The autopilot can only do so much - I need to engage my full attention before we sustain critical damage!",
          break: "Minor hull damage from near-miss collisions. My lack of focus nearly ended the mission. The repair drones are working, but I need to use this break to center myself. Space exploration demands unwavering attention."
        }
      },
      {
        title: 'Chapter 3: New World Discovery',
        focused: {
          work: "Incredible! My focused analysis has detected a habitable planet! This could be the discovery of a lifetime. Every data point I process brings us closer to landing. The scientific community will celebrate this achievement born from disciplined exploration!",
          break: "DISCOVERY! Landing successful on a new world! My concentrated efforts have led to this historic moment. The planet's surface is beyond imagination - lush valleys, alien flora, knowledge beyond measure. This is what focused determination achieves!"
        },
        struggling: {
          work: "Sensors are giving conflicting readings due to my scattered analysis. Is that a planet or just cosmic interference? My lack of focus is creating uncertainty at the worst possible time. I must sharpen my attention before we miss this opportunity!",
          break: "Opportunity missed. My distraction caused us to overshoot the optimal landing window. We're still in orbit, still searching. But great discoveries require great focus. The next opportunity will be mine if I can maintain concentration."
        }
      }
    ]
  },
  {
    id: 'garden-grower',
    name: 'Wisdom Garden',
    tagline: 'Grow your tree of knowledge',
    icon: '🌱',
    gradient: 'from-green-600 to-emerald-600',
    characterName: 'Sage',
    characterAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1080',
    chapters: [
      {
        title: 'Chapter 1: Planting Seeds',
        focused: {
          work: "Perfect! Each focused moment is like planting a seed of knowledge in fertile soil. I'm watering them with concentration, giving them sunlight through understanding. Tiny sprouts are already emerging - the garden of wisdom is beginning to grow!",
          break: "The first seedlings have sprouted! My attentive care has created the foundation of a magnificent knowledge garden. This break allows the young plants to absorb nutrients while I sketch plans for the sections to come."
        },
        struggling: {
          work: "Oh no! The garden is being overrun by weeds of distraction! My scattered attention has left the soil untended, and the precious seeds of learning are struggling to take root. I must refocus and clear these mental weeds before they choke out all progress!",
          break: "The garden shows signs of neglect. Weeds have spread due to my wandering mind. But a true gardener knows that with patience and renewed effort, any garden can be restored. I'll use this time to prepare better tools and strategies."
        }
      },
      {
        title: 'Chapter 2: Nurturing Growth',
        focused: {
          work: "Beautiful! The knowledge trees are growing strong and tall. My consistent focus provides the perfect environment - regular watering of practice, sunlight of understanding, and the nutrients of curiosity. The garden is flourishing beyond expectations!",
          break: "What magnificent progress! The trees are bearing fruit - actual wisdom I can harvest and use! My dedicated nurturing has created a thriving ecosystem of learning. This peaceful break lets me enjoy the shade of the trees I've grown."
        },
        struggling: {
          work: "The plants are wilting! My inconsistent attention has left them thirsty for focus and starved of mental nutrients. Some leaves are browning, and growth has slowed. I need to establish a better watering schedule - more consistent concentration!",
          break: "The garden looks stressed from irregular care. My distracted approach shows in every drooping leaf. But gardens are resilient, and so am I. With renewed commitment and better focus habits, these plants can still thrive."
        }
      },
      {
        title: 'Chapter 3: Harvest Time',
        focused: {
          work: "The garden has become a paradise! Towering trees of knowledge, blooming flowers of insight, and fruits of wisdom everywhere. My unwavering focus has created something extraordinary. Now comes the harvest - gathering all this knowledge to share with the world!",
          break: "ABUNDANT HARVEST! The Wisdom Garden is complete, overflowing with knowledge fruits ready to be shared. Every tree, every flower represents a concept mastered through focused cultivation. This achievement will nourish minds for years to come!"
        },
        struggling: {
          work: "The harvest is at risk! My wavering attention at this crucial stage could damage what I've grown. I'm dropping fruits, breaking branches - wasting the potential of all this effort. I must slow down, refocus, and handle this harvest with care!",
          break: "Harvest incomplete. My scattered approach left potential unrealized - fruits unpicked, knowledge ungathered. The garden still stands, but I could have achieved so much more. Next season, I'll bring sharper focus to the final stage."
        }
      }
    ]
  },
  {
    id: 'detective-mystery',
    name: 'Detective Mystery',
    tagline: 'Solve the case through focus',
    icon: '🔍',
    gradient: 'from-slate-700 to-slate-900',
    characterName: 'Detective Morgan',
    characterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1080',
    chapters: [
      {
        title: 'Chapter 1: The Case Opens',
        focused: {
          work: "Excellent detective work! My sharp focus is revealing clues others would miss. Each piece of evidence falls into place as I maintain laser-like concentration. The patterns are emerging, the mystery is unraveling, and I'm hot on the trail!",
          break: "Breakthrough in the investigation! My focused analysis has connected several key clues. The case board is filling up nicely. This break gives me time to step back and see the bigger picture forming from all these details."
        },
        struggling: {
          work: "I'm losing the thread! My distracted mind is jumbling the evidence, missing obvious connections. Red herrings are distracting me from real leads. A detective needs a clear, focused mind - I'm letting the case slip through my fingers!",
          break: "Case progress stalled. My scattered attention has led me down wrong paths and wasted valuable investigation time. But every good detective has setbacks. I'll review my notes and refocus on what really matters."
        }
      },
      {
        title: 'Chapter 2: Following Leads',
        focused: {
          work: "The investigation is heating up! My concentrated effort is paying off - witnesses are remembering details, forensics are coming back positive, and the suspect list is narrowing. Focus is the detective's greatest tool, and mine is sharp today!",
          break: "Major lead confirmed! My diligent focus has cracked a crucial part of the case. The pieces are falling into place faster now. This break allows me to interrogate what we know and prepare for the final push to solve this mystery."
        },
        struggling: {
          work: "I'm chasing shadows! My lack of focus has me investigating dead ends while the real culprit remains at large. Evidence is piling up unexamined, and time is running out. I need to clear my head and approach this with the focus it deserves!",
          break: "Investigation derailed by lack of focus. I've been running in circles, and the case has gone cold. But the game isn't over yet. Sometimes stepping back helps a detective see what was right in front of them all along."
        }
      },
      {
        title: 'Chapter 3: Solving the Mystery',
        focused: {
          work: "This is it - everything is coming together! My sustained focus throughout the investigation has built an ironclad case. Every clue, every detail, every connection clear in my mind. Time to close this case once and for all!",
          break: "CASE SOLVED! My unwavering focus and dedication have brought a criminal to justice! All the evidence, all the careful attention to detail, has paid off. Another mystery solved through the power of concentrated investigation!"
        },
        struggling: {
          work: "So close, yet the final pieces aren't fitting! My wavering focus at this critical juncture is creating doubt where there should be certainty. The case could fall apart if I don't sharpen my attention right now!",
          break: "Case remains open. My scattered focus in the final stages left reasonable doubt. The culprit walks free for now. But a true detective never gives up - next time, I'll maintain focus from start to finish."
        }
      }
    ]
  },
  {
    id: 'mountain-climber',
    name: 'Peak Ascent',
    tagline: 'Climb the mountain of mastery',
    icon: '🏔️',
    gradient: 'from-cyan-600 to-blue-700',
    characterName: 'Summit',
    characterAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080',
    chapters: [
      {
        title: 'Chapter 1: Base Camp',
        focused: {
          work: "Solid start to the ascent! Each focused step carries me higher up the mountain. My breathing is steady, my pace measured, my mind clear. The summit seems distant, but every concentrated moment brings it closer. This is how legends climb mountains!",
          break: "First checkpoint reached! My disciplined climbing has earned this rest at a scenic overlook. The view is already breathtaking, and I've only just begun. Using this break to hydrate, check equipment, and prepare for the next section of the climb."
        },
        struggling: {
          work: "The altitude of distraction is affecting me! My pace is erratic, I'm stumbling over rocks I should easily clear, and I'm wasting energy on inefficient routes. I need to refocus, check my climbing technique, and remember my training!",
          break: "Progress slower than planned. My unfocused climbing burned energy without gaining much elevation. The mountain teaches that scattered effort leads nowhere. I'll rest here and reset my mental approach to the climb."
        }
      },
      {
        title: 'Chapter 2: The Steep Ascent',
        focused: {
          work: "Powering through the challenging section! My focus keeps me anchored to each handhold, each foothold secure. The mountain tests my resolve, but concentrated effort conquers all obstacles. Other climbers have fallen here - I will not be one of them!",
          break: "Incredible progress! The hardest section is behind me, conquered through pure focused determination. From this elevation, I can see how far I've come. The summit is in sight now - the final push awaits after this well-earned rest!"
        },
        struggling: {
          work: "Dangerous ground! My wandering attention nearly caused a fall. The mountain demands respect and focus - I'm giving neither. Every distracted moment on this steep section risks a serious setback. I must concentrate or retreat to safer ground!",
          break: "Had to backtrack due to unsafe climbing caused by poor focus. Losing elevation hurts, but it's better than a catastrophic fall. The mountain will still be here when I'm mentally ready to tackle it with proper attention."
        }
      },
      {
        title: 'Chapter 3: The Summit Push',
        focused: {
          work: "The summit is within reach! Every focused breath, every deliberate movement brings me closer to the peak. The thin air doesn't matter - my concentration provides all the oxygen my mind needs. This is the moment all the training was for!",
          break: "SUMMIT ACHIEVED! Standing at the peak, the world spread below me! Every moment of focused climbing has led to this incredible vista. The knowledge I've gained, the strength I've built - all worth it for this triumphant moment at the top!"
        },
        struggling: {
          work: "Summit fever and lack of focus - a dangerous combination! I'm making mistakes this close to the goal. The peak is right there, but if I don't sharpen my attention, I could fail at the final hurdle. Focus. Breathe. Climb with intention.",
          break: "Turned back just short of the summit. My scattered focus made the final push too risky. It's disappointing, but a wise climber knows when to retreat. The mountain will be here tomorrow, and I'll return with better focus."
        }
      }
    ]
  },
  {
    id: 'ocean-diver',
    name: 'Deep Sea Explorer',
    tagline: 'Dive deep for hidden treasures',
    icon: '🌊',
    gradient: 'from-blue-500 to-teal-600',
    characterName: 'Marina',
    characterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1080',
    chapters: [
      {
        title: 'Chapter 1: Surface Preparation',
        focused: {
          work: "Equipment check successful! My focused preparation ensures every piece of diving gear is perfect. Oxygen tanks full, compass calibrated, dive computer programmed. The ocean depths hold treasures of knowledge, and I'm ready to find them with disciplined exploration!",
          break: "Excellent preparation complete! My careful, focused planning has set the stage for a successful dive. The water beckons, and I'm confident in my readiness. This surface break allows me to visualize the dive and mental prepare for the descent."
        },
        struggling: {
          work: "Critical safety check failed! My scattered attention has led to equipment oversights that could be dangerous below. You can't dive distracted - the ocean punishes lack of focus. I need to slow down, concentrate, and verify everything properly!",
          break: "Dive postponed due to inadequate preparation. My unfocused approach to equipment checks revealed too many issues. The ocean will wait - it's eternal. I'll use this time to properly prepare with the attention this expedition demands."
        }
      },
      {
        title: 'Chapter 2: The Deep Descent',
        focused: {
          work: "Descending smoothly into the depths! My focused breathing controls my buoyancy perfectly. Each meter deeper reveals new wonders - coral formations, schools of exotic fish, and hints of the treasure below. Concentration keeps me safe and efficient in this alien world!",
          break: "Incredible discoveries at depth! My careful, focused exploration has revealed amazing marine life and ancient artifacts. The underwater world rewards patient, concentrated observation. Hovering here in the blue, I catalog my findings and plan the final descent."
        },
        struggling: {
          work: "Losing depth control! My distracted mind has disrupted my breathing rhythm, and I'm burning through oxygen faster than planned. The current is pushing me off course. Underwater, focus isn't optional - it's survival. I must center myself now!",
          break: "Forced to ascend early due to poor focus underwater. I wasted oxygen and missed key markers. The ocean's treasures remain hidden from the distracted diver. I'll decompress here and reflect on maintaining better concentration below."
        }
      },
      {
        title: 'Chapter 3: The Treasure Chamber',
        focused: {
          work: "The underwater cave entrance found! My sustained focus led me through murky waters to this hidden grotto. Inside, treasures of knowledge shine in my light - ancient scrolls preserved in waterproof containers, jewels of wisdom waiting to be claimed. The ultimate dive!",
          break: "TREASURE SECURED! Surfacing with an incredible haul of knowledge artifacts! My focused diving, careful navigation, and concentrated exploration have paid off beyond imagination. The ocean has shared its deepest secrets with a worthy, attentive explorer!"
        },
        struggling: {
          work: "The cave system is confusing me! My lack of focus has me turned around in these passages. Air supply is getting low, and I'm not sure which way leads to the treasure chamber. Panic and distraction are a diver's worst enemies - I must calm my mind!",
          break: "Emergency ascent completed. My scattered attention led me astray in the cave system. I escaped safely but without the treasure. The ocean keeps its secrets from the unfocused. Next dive, I'll bring sharper concentration to navigate these depths."
        }
      }
    ]
  }
];

export function getThemeById(id: string): StoryTheme | undefined {
  return STORY_THEMES.find(theme => theme.id === id);
}
