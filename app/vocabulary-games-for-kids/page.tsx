import Link from 'next/link';
import { ArrowRight, BookOpen, Check, Eye, Languages, Lightbulb, LockKeyhole, MessageCircle, RefreshCw, Shapes } from 'lucide-react';
import { EducationHubLayout } from '@/components/education-hub-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vocabularyLevelOneGames } from '@/lib/games/academy-games';
import { ACADEMY_SOCIAL_IMAGE, createEducationalMetadata } from '@/lib/seo';

export const metadata = createEducationalMetadata({
  title: 'Vocabulary Games for Kids – English Word Practice | Zalea Studio',
  description: 'Practical vocabulary guidance for parents and teachers, with simple activities that help children understand, recognise, remember and use new English words.',
  path: '/vocabulary-games-for-kids',
  image: ACADEMY_SOCIAL_IMAGE,
});

const learningSteps = [
  { title: 'Meet the word', text: 'A child first sees the written word or hears someone say it.' },
  { title: 'Connect it with meaning', text: 'A picture, object, action or short explanation shows what the word means.' },
  { title: 'Meet it again', text: 'The word appears on another day, in a book or in a different conversation.' },
  { title: 'Recognise it', text: 'The child can identify the word when they hear or see it again.' },
  { title: 'Use it', text: 'With time and practice, the child can say or write the word without being shown the answer.' },
];

const homeActivities = [
  { title: 'Name what you can see', text: 'Choose a room and name a few useful objects together, such as a chair, cup, window or towel.' },
  { title: 'Sort by category', text: 'Group real objects or pictures into simple sets such as food, clothes, animals or school things.' },
  { title: 'Describe and guess', text: 'Describe an object without naming it: “It is round, red and we can eat it.” Let the child guess the word.' },
  { title: 'Ask “What is this?”', text: 'Point to a familiar object or picture. If recall is difficult, offer two possible answers rather than giving the word immediately.' },
  { title: 'Make a short sentence', text: 'After naming an object or action, use it in a simple sentence such as “The apple is red” or “The dog is running.”' },
  { title: 'Go on a word hunt', text: 'Look or listen for a target word in a story, a sign, a lesson or an everyday conversation.' },
];

const memoryTips = [
  'Introduce a manageable group of words instead of a long list.',
  'Revisit difficult words later, after attention has had time to reset.',
  'Use the same word in different simple contexts so its meaning is not tied to one picture.',
  'Invite the child to say, point to, draw or use the word.',
  'Treat mistakes as useful information, not as a high-pressure test.',
];

export default function VocabularyGamesForKidsPage() {
  return <EducationHubLayout eyebrow="Vocabulary learning guide" title="Vocabulary Games for Kids" introduction="This guide gives parents and teachers practical ways to help children understand, recognise, remember and use new English words. The activities can be used at home or in class with everyday objects, pictures, books and conversation.">
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="build-vocabulary">
      <div className="max-w-3xl"><h2 id="build-vocabulary" className="text-3xl font-bold tracking-tight">How children build vocabulary</h2><p className="mt-4 leading-relaxed text-muted-foreground">Learning a word is usually a gradual process. A child may understand a word before being ready to say it independently, and one successful answer does not always mean the word is secure. Repeated, meaningful encounters help make it familiar.</p></div>
      <ol className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{learningSteps.map((step, index) => <li key={step.title} className="rounded-xl border border-border/60 bg-white p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">{index + 1}</span><h3 className="mt-4 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p></li>)}</ol>
    </section>

    <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="themes"><div className="mx-auto grid max-w-[1000px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
      <div><Shapes className="h-8 w-8 text-primary" aria-hidden="true" /><h2 id="themes" className="mt-4 text-3xl font-bold tracking-tight">Learning vocabulary by theme</h2></div>
      <div className="leading-relaxed text-muted-foreground"><p>Words are easier to discuss when they belong to a familiar situation. A food theme can be practised in the kitchen, while school words can be connected with items in a bag or classroom. The theme gives each word a useful context and makes it easier to compare related ideas.</p><p className="mt-4">Start with a theme that matters in the child&apos;s day. Colours, animals, food, family, body parts, clothes, actions and objects around the home or school all offer real things to point to, describe and use. Mix the words once they are familiar so the child also learns to recognise them outside their original group.</p></div>
    </div></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="recognition-recall">
      <div className="max-w-3xl"><h2 id="recognition-recall" className="text-3xl font-bold tracking-tight">Recognition and recall are different</h2><p className="mt-4 leading-relaxed text-muted-foreground">Both are useful stages of practice. Recognition gives the child clues; recall asks them to find the word for themselves.</p></div>
      <div className="mt-8 grid gap-5 md:grid-cols-2"><Card><CardHeader><Eye className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Recognition</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">A child hears “penguin” and chooses the correct picture, or sees the word “blue” and points to the matching colour. The answer is present, so the task is to notice and identify it.</CardContent></Card><Card><CardHeader><Lightbulb className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Recall</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">A child sees a penguin and names it without answer choices, or answers “What colour is the cup?” Recall is more demanding because the child must retrieve the word.</CardContent></Card></div>
      <p className="mt-6 leading-relaxed text-muted-foreground">If recall is difficult, return to recognition for a while or give the first sound as a clue. This is support, not failure. Gradually reduce the clues as the word becomes easier to retrieve.</p>
    </section>

    <section className="border-y border-border/60 bg-blue-50/50" aria-labelledby="home-activities"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl"><MessageCircle className="h-8 w-8 text-primary" aria-hidden="true" /><h2 id="home-activities" className="mt-4 text-3xl font-bold tracking-tight">Simple vocabulary activities at home</h2><p className="mt-4 leading-relaxed text-muted-foreground">These activities need no special materials. Choose one, use a small number of words and stop while the conversation still feels comfortable.</p></div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{homeActivities.map((activity) => <Card key={activity.title}><CardHeader><CardTitle className="text-xl">{activity.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{activity.text}</CardContent></Card>)}</div>
    </div></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="pictures-context">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12"><div><BookOpen className="h-8 w-8 text-primary" aria-hidden="true" /><h2 id="pictures-context" className="mt-4 text-3xl font-bold tracking-tight">Pictures, context and repetition</h2><p className="mt-4 leading-relaxed text-muted-foreground">A clear picture can make an unfamiliar noun or action understandable without a long definition. Real objects, gestures and short sentences add more information: “cup” becomes the cup a child drinks from, not only an image on a card.</p><p className="mt-4 leading-relaxed text-muted-foreground">Repetition is most useful when the word appears in slightly different ways. A child might point to a coat in a picture, find their own coat, hear “Please put on your coat,” and later describe its colour. Each encounter strengthens both meaning and use.</p></div>
        <Card className="border-blue-200"><CardHeader><RefreshCw className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-2xl">Helping a child remember new words</CardTitle></CardHeader><CardContent><ul className="space-y-3 leading-relaxed text-muted-foreground">{memoryTips.map((tip) => <li key={tip} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span>{tip}</span></li>)}</ul></CardContent></Card>
      </div>
    </section>

    <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="using-words"><div className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h2 id="using-words" className="text-3xl font-bold tracking-tight">From recognising words to using them</h2><p className="mt-4 leading-relaxed text-muted-foreground">Move forward in small steps. For the word “apple,” a child might first point to the apple when it is named, then choose it from several pictures, name it without choices, describe it as red or green, and finally say or write a sentence such as “I have an apple.”</p><p className="mt-4 leading-relaxed text-muted-foreground">The same pattern works for actions and describing words. A child can match “jump” to a picture, act it out, answer “What is she doing?” and then use it in “She can jump.” Younger learners can respond by pointing or speaking; children who are ready to write can add labels, captions or one short sentence.</p>
    </div></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="zalea-themes"><div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]"><div><h2 id="zalea-themes" className="text-3xl font-bold tracking-tight">Vocabulary themes on Zalea</h2><p className="mt-4 leading-relaxed text-muted-foreground">Zalea English Academy&apos;s Vocabulary Level 1 uses ten familiar themes. Each activity focuses on a particular kind of word or relationship rather than repeating the same task description.</p><ul className="mt-7 grid gap-3 sm:grid-cols-2">{vocabularyLevelOneGames.map((game) => <li key={game.slug} className="flex gap-3 rounded-xl border border-border/60 bg-white p-4"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span><strong>{game.title}</strong><span className="mt-1 block text-sm text-muted-foreground">{game.learningObjective}</span></span></li>)}</ul></div><Card className="h-fit border-violet-200 bg-violet-50"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><LockKeyhole className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-2xl">An additional practice option</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-violet-900">Vocabulary Level 1 is included with Zalea English Academy – Lifetime Access. It contains ten visual games with Easy, Normal and Challenge modes for children who would benefit from interactive practice alongside reading and conversation.</p><Button asChild className="mt-6 min-h-12 w-full bg-violet-700 hover:bg-violet-800"><Link href="/games/english/academy">View Academy details<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button></CardContent></Card></div></section>

    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><Languages className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold">For parents and teachers</h2><p className="mt-4 leading-relaxed text-muted-foreground">Vocabulary games can complement shared reading, classroom lessons, everyday conversation and chances to use language in real situations. A game can introduce or revisit a word, while books and daily life show how that word works with other words. Zalea&apos;s free English collection and the Academy are optional ways to add interactive practice to that broader routine.</p><div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3"><Link href="/games/english" className="font-semibold text-primary hover:underline">Play free English games</Link><Link href="/english-games-for-kids" className="font-semibold text-primary hover:underline">Read the English learning guide</Link><Link href="/grammar-games-for-kids" className="font-semibold text-primary hover:underline">Explore grammar practice</Link></div></div></section>
  </EducationHubLayout>;
}
