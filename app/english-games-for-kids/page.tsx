import Link from 'next/link';
import { ArrowRight, BookOpen, Languages, Lightbulb, MessageCircle, RefreshCw, Users } from 'lucide-react';
import { EducationHubLayout } from '@/components/education-hub-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata } from '@/lib/seo';

export const metadata = createEducationalMetadata({
  title: 'Free English Games for Kids | Zalea Studio',
  description: 'Find free English grammar games for children ages 5–8, plus mobile-friendly grammar and vocabulary learning in Zalea English Academy.',
  path: '/english-games-for-kids',
});

const learningAreas = [
  {
    icon: BookOpen,
    title: 'Basic grammar',
    text: 'Grammar helps children notice how words work together. Early practice can include articles, pronouns, singular and plural nouns, simple verb forms, possession and position words.',
  },
  {
    icon: Languages,
    title: 'Vocabulary',
    text: 'Vocabulary practice builds a useful bank of words for people, objects, actions and places. It is especially helpful when a child understands an idea but does not yet know the English word for it.',
  },
  {
    icon: MessageCircle,
    title: 'Sentence building',
    text: 'Sentence practice brings grammar and vocabulary together. A child chooses a word, reads the completed sentence and begins to hear which patterns sound natural.',
  },
];

const learningPath = [
  {
    title: '1. Begin with names and number',
    description: 'These games use familiar nouns and one clear clue at a time.',
    games: [
      { title: 'A or An?', href: '/games/english/a-or-an', skill: 'Choose an article by listening to the first sound in a noun.' },
      { title: 'One or Many?', href: '/games/english/one-or-many', skill: 'Connect number clues with singular and plural nouns.' },
    ],
  },
  {
    title: '2. Move to personal pronouns',
    description: 'Pronoun practice asks children to notice who or what a sentence is about.',
    games: [
      { title: 'He, She, It', href: '/games/english/he-she-it', skill: 'Replace one familiar person, animal or object with he, she or it.' },
      { title: 'Who Is It?', href: '/games/english/who-is-it', skill: 'Choose among I, you, he, she, it, we and they using the speaker and group clues.' },
    ],
  },
  {
    title: '3. Practise simple verb forms',
    description: 'Once the subject is clear, children can match it with a suitable verb form.',
    games: [
      { title: 'Is, Am, Are', href: '/games/english/is-am-are', skill: 'Match I, one subject or several subjects with the correct form of “to be”.' },
      { title: "Can or Can't?", href: '/games/english/can-or-cant', skill: 'Use positive and negative forms to describe an ability.' },
      { title: 'Has or Have?', href: '/games/english/has-or-have', skill: 'Choose the present form of “have” that agrees with the subject.' },
    ],
  },
  {
    title: '4. Add ownership, position and distance',
    description: 'These ideas ask the child to use more than one clue in a sentence.',
    games: [
      { title: 'Whose Is It?', href: '/games/english/whose-is-it', skill: 'Connect an owner with my, your, his, her, our or their.' },
      { title: 'Where Is It?', href: '/games/english/where-is-it', skill: 'Describe position with in, on, under, behind, in front of and next to.' },
      { title: 'This, That, These or Those?', href: '/games/english/this-that-these-those', skill: 'Combine near or far with one or many to choose a demonstrative.' },
    ],
  },
];

export default function EnglishGamesForKidsPage() {
  return <EducationHubLayout
    eyebrow="English learning guide"
    title="English Games for Kids Ages 5–8"
    introduction="This guide helps parents and teachers choose useful English practice for an early learner. It explains the skills behind the games, suggests a sensible order and offers practical ways to support a child without turning a short activity into a test."
  >
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="english-practice">
      <div className="max-w-3xl">
        <h2 id="english-practice" className="text-3xl font-bold tracking-tight">What English practice can include</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">Children between five and eight are often working on several connected skills. They may know the word for an object but still be learning how to place it in a sentence, or they may recognise a sentence pattern before they can explain the grammar rule. The aim is useful, repeated practice—not memorising technical definitions.</p>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {learningAreas.map(({ icon: Icon, title, text }) => <Card key={title}><CardHeader><Icon className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{text}</CardContent></Card>)}
      </div>
      <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8">
        <h3 className="text-xl font-bold">Grammar or vocabulary: which is useful now?</h3>
        <p className="mt-3 leading-relaxed text-muted-foreground"><strong className="text-foreground">Choose grammar practice</strong> when the child knows the words but is unsure which form completes a sentence. <strong className="text-foreground">Choose vocabulary practice</strong> when the main difficulty is recognising, recalling or using the word itself. Sentence building becomes useful when both the words and the basic pattern are familiar.</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3"><Link href="/grammar-games-for-kids" className="font-semibold text-primary hover:underline">Read the grammar guide</Link><Link href="/vocabulary-games-for-kids" className="font-semibold text-primary hover:underline">Read the vocabulary guide</Link></div>
      </div>
    </section>

    <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="learning-order"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl"><h2 id="learning-order" className="text-3xl font-bold tracking-tight">A practical order for the free games</h2><p className="mt-4 leading-relaxed text-muted-foreground">This sequence starts with concrete clues and gradually adds relationships between words. It is a guide rather than a fixed programme: start anywhere that matches what the child is learning at home or in class.</p></div>
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {learningPath.map((stage) => <Card key={stage.title}><CardHeader><CardTitle className="text-xl">{stage.title}</CardTitle><p className="pt-2 leading-relaxed text-muted-foreground">{stage.description}</p></CardHeader><CardContent><ul className="space-y-5">{stage.games.map((game) => <li key={game.href}><Link href={game.href} className="font-bold text-primary hover:underline">{game.title}</Link><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{game.skill}</p></li>)}</ul></CardContent></Card>)}
      </div>
      <Button asChild size="lg" className="mt-8 min-h-12"><Link href="/games/english">Browse All Free English Games<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button>
    </div></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="choose-practice">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div><Lightbulb className="h-8 w-8 text-primary" aria-hidden="true" /><h2 id="choose-practice" className="mt-4 text-3xl font-bold tracking-tight">Choosing a level and session length</h2><p className="mt-4 leading-relaxed text-muted-foreground">Begin with a skill the child partly understands and use Easy first when the pattern is new. Move to Normal or Challenge when answers are consistently correct and the child can give a simple reason for a choice.</p><p className="mt-4 leading-relaxed text-muted-foreground">A short, focused session is often more useful than continuing after attention has faded. One game can be enough. It is reasonable to stop, talk about one difficult example and return another day.</p></div>
        <Card className="border-blue-200"><CardHeader><Users className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-2xl">Support without taking over</CardTitle></CardHeader><CardContent><ul className="space-y-3 leading-relaxed text-muted-foreground"><li><strong className="text-foreground">Read it aloud:</strong> hearing the whole sentence can make the missing word clearer.</li><li><strong className="text-foreground">Ask for a reason:</strong> invite the child to explain what clue helped.</li><li><strong className="text-foreground">Offer one clue:</strong> point to the subject, number or position instead of giving the answer.</li><li><strong className="text-foreground">Repeat selectively:</strong> return to a difficult example later rather than repeating everything immediately.</li></ul></CardContent></Card>
      </div>
    </section>

    <section className="border-y border-border/60 bg-blue-50/50" aria-labelledby="guessing"><div className="mx-auto grid max-w-[1000px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
      <div><RefreshCw className="h-8 w-8 text-primary" aria-hidden="true" /><h2 id="guessing" className="mt-4 text-3xl font-bold tracking-tight">When a child keeps guessing</h2></div>
      <div className="leading-relaxed text-muted-foreground"><p>Guessing usually means the current example or level is not giving the child a usable clue. Reduce the difficulty, explain the idea with one simple real-life example, or practise a few examples away from the screen.</p><p className="mt-4">For position words, move a toy in, on or under a box. For singular and plural, compare one pencil with several pencils. For pronouns, point to yourself, the child and a group while saying I, you and we. Then revisit the game later and see whether the pattern feels more familiar.</p><p className="mt-4">Errors are part of practice and do not need to become a judgement about the child&apos;s ability.</p></div>
    </div></section>

    <section className="mx-auto max-w-[850px] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20"><MessageCircle className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold tracking-tight">Use games alongside everyday English</h2><p className="mt-4 leading-relaxed text-muted-foreground">These activities work best as one part of learning. Reading together, talking about daily routines, noticing words in books and using new sentence patterns in conversation all give the game answers a real context. Parents and teachers can use a game to introduce a pattern, revisit it after a lesson or check what needs another explanation.</p><div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3"><Link href="/games/english" className="font-semibold text-primary hover:underline">Play the free games</Link><Link href="/games/english/academy" className="font-semibold text-primary hover:underline">Explore Zalea English Academy</Link></div></section>
  </EducationHubLayout>;
}
