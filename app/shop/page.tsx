import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ABOUT_ROUTE,
  HEALTH_TOOLS_URL,
  PAYHIP_MONEY_MILESTONE_USD_URL,
  PAYHIP_NO_SPEND_COLLECTION_URL,
} from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Shop Digital Learning & Money Resources | Zalea Studio' },
  description: 'Explore interactive learning games, printable savings challenges, no-spend activities and educational resources from Zalea Studio.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop Digital Learning & Money Resources | Zalea Studio',
    description: 'Explore interactive learning games, printable savings challenges, no-spend activities and educational resources from Zalea Studio.',
    url: '/shop',
    type: 'website',
  },
};

const products = [
  {
    category: 'English learning',
    badge: 'Founding Member',
    title: 'Zalea English Academyâ„¢ â€“ Founding Member Lifetime Access',
    description: 'Interactive English games that help children practise grammar and vocabulary through play.',
    price: 'USD 14.99',
    features: ['Grammar Level 2', 'Vocabulary Level 1', 'Future Academy updates included'],
    image: '/images/shop/zalea-english-academy.jpg',
    imageAlt: 'Zalea English Academy Lifetime Access product cover',
    href: '/games/english/academy',
    cta: 'Explore Academy',
    external: false,
  },
  {
    category: 'Financial literacy for kids',
    badge: undefined,
    title: 'Little Money Masterâ„¢ Volume 1 â€“ Needs or Wants?',
    description: 'A playful financial literacy game that helps children aged 5â€“8 understand needs and wants.',
    price: 'USD 5.99',
    features: ['Interactive learning game', 'Parent & Teacher Guide', 'Completion certificate'],
    image: '/images/Cover.webp',
    imageAlt: 'Little Money Master Volume 1 Needs or Wants product cover',
    href: '/shop/little-money-master-volume-1',
    cta: 'View Game',
    external: false,
  },
  {
    category: 'Money challenge',
    badge: undefined,
    title: 'The Do-It Challengeâ„¢ â€“ No Spend Collection',
    description: 'Printable challenges designed to make cutting unnecessary spending feel simple, visual and motivating.',
    price: 'USD 4.99',
    features: ['Four no-spend challenge lengths', 'Reflection pages', 'Reward planner'],
    image: '/images/shop/no-spend-collection.jpg',
   ;ßÍí¢G§²ÚîÆ­yÓ¦w&–BÖ6öÇ2ÓB#ç¶ÖöFW2æÖ‚†—FVÒ’ÓâÆ'WGFöâ¶W“×¶—FVÒæ–GÒG—SÒ&'WGFöâ"&öÆSÒ'F""&–×6VÆV7FVC×¶ÖöFRÓÓÒ—FVÒæ–GÒ&–Ö6öçG&öÇ3Ò'&F–ò×æVÂ"öä6Æ–6³×²‚’Óâ6†ævTÖöFR†—FVÒæ–B—Ò6Æ74æÖS×¶Ö–âÖ‚Ó"&÷VæFVBÖÆr‚Ó2’Ó"FW‡B×6ÒföçB×6VÖ–&öÆBfö7W2×f—6–&ÆS¦÷WFÆ–æRÖæöæRfö7W2×f—6–&ÆS§&–ærÓ"fö7W2×f—6–&ÆS§&–ær×&–ærfö7W2×f—6–&ÆS§&–ærÖöfg6WBÓ"G¶ÖöFRÓÓÒ—FVÒæ–Bòv&rÖ&6¶w&÷VæBFW‡BÖf÷&Vw&÷VæB6†F÷r×6Òr¢wFW‡BÖ×WFVBÖf÷&Vw&÷VæB†÷fW#§FW‡BÖf÷&Vw&÷VæBwÖÓãÇ7â6Æ74æÖSÒ'6Ó¦†–FFVâ#ç¶—FVÒç6†÷'DÆ&VÇÓÂ÷7ããÇ7â6Æ74æÖSÒ&†–FFVâ6Ó¦–æÆ–æR#ç¶—FVÒæÆ&VÇÓÂ÷7ããÂö'WGFöãâ—ÓÂöF—cà¢ÆF—b–CÒ'&F–ò×æVÂ"&öÆSÒ'F'æVÂ"6Æ74æÖSÒ&×BÓbw&–BvÓbÆs¦w&–BÖ6öÇ2Õ³ã–g%óãg%Ò#à¢Ç6V7F–öâ&–ÖÆ&VÃÒ%&F–ò–çWG2#à¢ÄÖöFTf–VÆG2ÖöFS×¶ÖöFWÒfÇVW3×·fÇVW7Òöä6†ævS×·WFFUfÇVWÒóà¢Ä'WGFöâG—SÒ&'WGFöâ"f&–çCÒ&÷WFÆ–æR"6Æ74æÖSÒ&×BÓb"öä6Æ–6³×·&W6WGÓãÅ&÷FFT67r6Æ74æÖSÒ&×"Ó"‚ÓBrÓB"&–Ö†–FFVãÒ'G'VR"óå&W6WCÂô'WGFöãà¢¶6Æ7VÆF–öâæW'&÷"bbÇ&öÆSÒ&ÆW'B"6Æ74æÖSÒ&×BÓR&÷VæFVBÖÆr&÷&FW"&÷&FW"ÖFW7G'V7F—fRó3&rÖFW7G'V7F—fRóRÓ2FW‡B×6ÒföçBÖÖVF—VÒFW‡BÖFW7G'V7F—fR#ç¶6Æ7VÆF–öâæW'&÷'ÓÂ÷çĞ¢Â÷6V7F–öãà¢Å&W7VÇEæVÂ6Æ7VÆF–öã×¶6Æ7VÆF–öâç&W7VÇGÒóà¢ÂöF—cà¢Âô6&D6öçFVçCà¢Âô6&Cã°§Ğ ¦gVæ7F–öâÖöFTf–VÆG2‡²ÖöFRÂfÇVW2Âöä6†ævRÓ¢²ÖöFS¢&F–ôÖöFS²fÇVW3¢7G&–æuµÓ²öä6†ævS¢†–æFWƒ¢çVÖ&W"ÂfÇVS¢7G&–ær’Óâfö–BÒ’°¢–b†ÖöFRÓÓÒw&÷÷'F–öâr’°¢&WGW&âÆf–VÆG6WCãÆÆVvVæB6Æ74æÖSÒ&föçB×6VÖ–&öÆB#ä¢"Ò2¢CÂöÆVvVæCãÇ6Æ74æÖSÒ&×BÓ"FW‡B×6ÒFW‡BÖ×WFVBÖf÷&Vw&÷VæB#äÆVfRW†7FÇ’öæRf–VÆBV×G’÷"VçFW"‚f÷"F†RÖ—76–ærfÇVRãÂ÷ãÆF—b6Æ74æÖSÒ&×BÓBw&–B—FV×2ÖVæBvÓ26Ó¦w&–BÖ6öÇ2Õ³g%öWFõóg%öWFõóg%öWFõóg%Ò#à¢ÄçVÖ&W$f–VÆB–CÒ'&F–òÖ"Æ&VÃÒ$"fÇVS×·fÇVW5³ÒóòrwÒöä6†ævS×²‡fÇVR’Óâöä6†ævRƒÂfÇVR—ÒÆ6V†öÆFW#Ò#""ÆÆ÷uVæ¶æ÷vâóà¢Å6W&F÷#ã£Âõ6W&F÷#à¢ÄçVÖ&W$f–VÆB–CÒ'&F–òÖ""Æ&VÃÒ$""fÇVS×·fÇVW5³ÒóòrwÒöä6†ævS×²‡fÇVR’Óâöä6†ævRƒÂfÇVR—ÒÆ6V†öÆFW#Ò#2"ÆÆ÷uVæ¶æ÷vâóà¢Å6W&F÷#ãÓÂõ6W&F÷#à¢ÄçVÖ&W$f–VÆB–CÒ'&F–òÖ2"Æ&VÃÒ$2"fÇVS×·fÇVW5³%ÒóòrwÒöä6†ævS×²‡fÇVR’Óâöä6†ævRƒ"ÂfÇVR—ÒÆ6V†öÆFW#Ò'‚"ÆÆ÷uVæ¶æ÷vâóà¢Å6W&F÷#ã£Âõ6W&F÷#à¢ÄçVÖ&W$f–VÆB–CÒ'&F–òÖB"Æ&VÃÒ$B"fÇVS×·fÇVW5³5ÒóòrwÒöä6†ævS×²‡fÇVR’Óâöä6†ævRƒ2ÂfÇVR—ÒÆ6V†öÆFW#Ò#""ÆÆ÷uVæ¶æ÷vâóà¢ÂöF—cãÂöf–VÆG6WCã°¢Ğ ¢6öç7Bf–VÆD6÷VçBÒÖöFRÓÓÒw6–×Æ–g’rò"¢3°¢6öç7BÆ&VÇ2ÒÖöFRÓÓÒw66ÆRrò²u&F–òrÂu&F–ò"rÂu66ÆRf7F÷"uÒ¢ÖöFRÓÓÒwF‡&VRrò²u&F–òrÂu&F–ò"rÂu&F–ò2uÒ¢²u&F–òrÂu&F–ò"uÓ°¢&WGW&âÆf–VÆG6WCãÆÆVvVæB6Æ74æÖSÒ&föçB×6VÖ–&öÆB#ç¶ÖöFRÓÓÒw66ÆRròu66ÆRâWV—fÆVçB&F–òr¢ÖöFRÓÓÒwF‡&VRròu6–×Æ–g’F‡&VRÖçVÖ&W"&F–òr¢u6–×Æ–g’GvòÖçVÖ&W"&F–òwÓÂöÆVvVæCãÆF—b6Æ74æÖS×¶×BÓBw&–BvÓBG¶f–VÆD6÷VçBÓÓÒ2òw6Ó¦w&–BÖ6öÇ2Ó2r¢w6Ó¦w&–BÖ6öÇ2Ó"wÖÓç¶Æ&VÇ2æÖ‚†Æ&VÂÂ–æFW‚’ÓâÄçVÖ&W$f–VÆB¶W“×¶Æ&VÇÒ–C×¶G¶ÖöFWÒÒG¶–æFW‡ÖÒÆ&VÃ×¶Æ&VÇÒfÇVS×·fÇVW5¶–æFW…ÒóòrwÒöä6†ævS×²‡fÇVR’Óâöä6†ævR†–æFW‚ÂfÇVR—Òóâ—ÓÂöF—cãÂöf–VÆG6WCã°§Ğ ¦gVæ7F–öâçVÖ&W$f–VÆB‡²–BÂÆ&VÂÂfÇVRÂÆ6V†öÆFW"ÂÆÆ÷uVæ¶æ÷vâÂöä6†ævRÓ¢²–C¢7G&–æs²Æ&VÃ¢7G&–æs²fÇVS¢7G&–æs²Æ6V†öÆFW#ó¢7G&–æs²ÆÆ÷uVæ¶æ÷vãó¢&ööÆVã²öä6†ævS¢‡fÇVS¢7G&–ær’Óâfö–BÒ’°¢&WGW&âÆF—b6Æ74æÖSÒ'76R×’Ó"#ãÄÆ&VÂ‡FÖÄf÷#×¶–GÓç¶Æ&VÇÓÂôÆ&VÃãÄ–çWB–C×¶–GÒG—SÒ'FW‡B"–çWDÖöFSÒ&FV6–ÖÂ"WFô6ö×ÆWFSÒ&öfb"fÇVS×·fÇVWÒÆ6V†öÆFW#×·Æ6V†öÆFW'Òöä6†ævS×²†WfVçB’Óâöä6†ævR†WfVçBçF&vWBçfÇVR—Ò&–ÖFW67&—F–öã×¶ÆÆ÷uVæ¶æ÷vâòtVçFW"çVÖ&W"Â‚Â÷"ÆVfRV×G’f÷"F†RVæ¶æ÷vâfÇVRâr¢VæFVf–æVGÒ6Æ74æÖSÒ&‚ÓFW‡BÖ&6R"óãÂöF—cã°§Ğ ¦gVæ7F–öâ6W&F÷"‡²6†–ÆG&VâÓ¢²6†–ÆG&Vã¢&V7Bå&V7DæöFRÒ’°¢&WGW&âÇ7â6Æ74æÖSÒ&†–FFVâ‚Ó—FV×2Ö6VçFW"§W7F–g’Ö6VçFW"FW‡B×†ÂföçBÖ&öÆBFW‡BÖ×WFVBÖf÷&Vw&÷VæB6Ó¦fÆW‚"&–Ö†–FFVãÒ'G'VR#ç¶6†–ÆG&VçÓÂ÷7ãã°§Ğ ¦gVæ7F–öâ&W7VÇEæVÂ‡²6Æ7VÆF–öâÓ¢²6Æ7VÆF–öã¢6Æ7VÆF–öâÂçVÆÂÒ’°¢&WGW&âÇ6V7F–öâ6Æ74æÖSÒ'&÷VæFVBÓ'†Â&rÖ&ÇVRÓSósÓR6Ó§Ób"&–ÖÆ&VÆÆVF'“Ò'&F–ò×&W7VÇB"&–ÖÆ—fSÒ'öÆ—FR#à¢Ç6Æ74æÖSÒ'FW‡B×6ÒföçB×6VÖ–&öÆBWW&66RG&6¶–ær×v–FW"FW‡B×&–Ö'’#å&W7VÇCÂ÷à¢Æƒ2–CÒ'&F–ò×&W7VÇB"6Æ74æÖSÒ&×BÓ"FW‡B×†ÂföçBÖ&öÆB#å–÷W"&F–ò6Æ7VÆF–öãÂöƒ3à¢²6Æ7VÆF–öâbbÇ6Æ74æÖSÒ&×BÓBÆVF–ær×&VÆ†VBFW‡BÖ×WFVBÖf÷&Vw&÷VæB#äVçFW"fÆ–BfÇVW2Fò6VRF†Rç7vW"æB7FWÖ'’×7FW6Æ7VÆF–öâãÂ÷çĞ¢¶6Æ7VÆF–öâbb†6Æ7VÆF–öâæ¶–æBÓÓÒw6–×Æ–g’rÇÂ6Æ7VÆF–öâæ¶–æBÓÓÒwF‡&VRr’bbÅ6–×Æ–g•&W7VÇB&W7VÇC×¶6Æ7VÆF–öâç&W7VÇGÒF‡&VS×¶6Æ7VÆF–öâæ¶–æBÓÓÒwF‡&VRwÒóçĞ¢¶6Æ7VÆF–öãòæ¶–æBÓÓÒw66ÆRrbbÅ66ÆU&W7VÇB&W7VÇC×¶6Æ7VÆF–öâç&W7VÇGÒóçĞ¢¶6Æ7VÆF–öãòæ¶–æBÓÓÒw&÷÷'F–öârbbÅ&÷÷'F–öå&W7VÇEæVÂ&W7VÇC×¶6Æ7VÆF–öâç&W7VÇGÒóçĞ¢Â÷6V7F–öãã°§Ğ ¦gVæ7F–öâ6–×Æ–g•&W7VÇB‡²&W7VÇBÂF‡&VRÓ¢²&W7VÇC¢6–×Æ–f–VE&F–ó²F‡&VS¢&ööÆVâÒ’°¢&WGW&âÃãÇ6Æ74æÖSÒ&×BÓR'&V²×v÷&G2FW‡BÓG†ÂföçBÖ&öÆBG&6¶–ær×F–v‡BFW‡B×&–Ö'’6Ó§FW‡BÓW†Â#ç·&W7VÇBç6–×Æ–f–VGÓÂ÷ãÆFÂ6Æ74æÖSÒ&×BÓbw&–BvÓ26Ó¦w&–BÖ6öÇ2Ó"#ãÅ&W7VÇD—FVÒÆ&VÃÒ$÷&–v–æÂ&F–ò"fÇVS×·&W7VÇBæ÷&–v–æÇÒóãÅ&W7VÇD—FVÒÆ&VÃÒ$w&VFW7B6öÖÖöâF—f—6÷""fÇVS×·&W7VÇBæF—f—6÷'Òóç·&W7VÇBæ–çFVvW$WV—fÆVçBÓÒ&W7VÇBæ÷&–v–æÂbbÅ&W7VÇD—FVÒÆ&VÃÒ$–çFVvW"WV—fÆVçB"fÇVS×·&W7VÇBæ–çFVvW$WV—fÆVçGÒóç×²F‡&VRbb&W7VÇBæg&7F–öâbbÅ&W7VÇD—FVÒÆ&VÃÒ%&F–òg&7F–öâô""fÇVS×·&W7VÇBæg&7F–öçÒóçÓÂöFÃãÅ7FW27FW3×µ¶6öçfW'BFòâ–çFVvW"&F–ó¢G·&W7VÇBæ–çFVvW$WV—fÆVçGÒæÂF—f–FRWfW'’fÇVR'’G·&W7VÇBæF—f—6÷'ÒæÂ&W7VÇBæ6Æ7VÆF–öå×Òóç²F‡&VRbb&W7VÇBçF÷FÅ'G2bbÆF—b6Æ74æÖSÒ&×BÓR&÷VæFVB×†Â&rÖ&6¶w&÷VæBÓB#ãÆƒB6Æ74æÖSÒ&föçB×6VÖ–&öÆB#å'B×Fò×v†öÆR–ç6–v‡CÂöƒCãÇ6Æ74æÖSÒ&×BÓ"FW‡B×6ÒFW‡BÖ×WFVBÖf÷&Vw&÷VæB#åF÷FÂ'G3¢·&W7VÇBçF÷FÅ'G7ÓÂ÷ãÇ6Æ74æÖSÒ&×BÓ"FW‡B×6ÒFW‡BÖ×WFVBÖf÷&Vw&÷VæB#äf—'7BVçF—G“¢·&W7VÇBæf—'7E6†&WÓÂ÷ãÇ6Æ74æÖSÒ&×BÓFW‡B×6ÒFW‡BÖ×WFVBÖf÷&Vw&÷VæB#å6V6öæBVçF—G“¢·&W7VÇBç6V6öæE6†&WÓÂ÷ãÂöF—cçÓÂóã°§Ğ ¦gVæ7F–öâ66ÆU&W7VÇB‡²&W7VÇBÓ¢²&W7VÇC¢66ÆVE&F–òÒ’°¢&WGW&âÃãÇ6Æ74æÖSÒ&×BÓR'&V²×v÷&G2FW‡BÓG†ÂföçBÖ&öÆBG&6¶–ær×F–v‡BFW‡B×&–Ö'’6Ó§FW‡BÓW†Â#ç·&W7VÇBç66ÆVGÓÂ÷ãÆFÂ6Æ74æÖSÒ&×BÓbw&–BvÓ26Ó¦w&–BÖ6öÇ2Ó"#ãÅ&W7VÇD—FVÒÆ&VÃÒ$÷&–v–æÂ&F–ò"fÇVS×·&W7VÇBæ÷&–v–æÇÒóãÅ&W7VÇD—FVÒÆ&VÃÒ%6–×ÆW7Bf÷&Ò"fÇVS×·&W7VÇBç6–×Æ–f–VGÒóãÂöFÃãÅ7FW27FW3×µ²t×VÇF—Ç’WfW'’&F–òfÇVR'’F†R6ÖR66ÆRf7F÷"ârÂ&W7VÇBæ6Æ7VÆF–öâÂG·&W7VÇBç66ÆVGÒ—2WV—fÆVçBFòG·&W7VÇBæ÷&–v–æÇÒæ×ÒóãÂóã°§Ğ ¦gVæ7F–öâ&÷÷'F–öå&W7VÇEæVÂ‡²&W7VÇBÓ¢²&W7VÇC¢&÷÷'F–öå&W7VÇBÒ’°¢&WGW&âÃãÇ6Æ74æÖSÒ&×BÓR'&V²×v÷&G2FW‡BÓG†ÂföçBÖ&öÆBG&6¶–ær×F–v‡BFW‡B×&–Ö'’6Ó§FW‡BÓW†Â#ç·&W7VÇBæç7vW'ÓÂ÷ãÆFÂ6Æ74æÖSÒ&×BÓb#ãÅ&W7VÇD—FVÒÆ&VÃÒ%&÷÷'F–öâ"fÇVS×·&W7VÇBæWVF–öçÒóãÂöFÃãÅ7FW27FW3×·&W7VÇBç7FW7ÒóãÂóã°§Ğ ¦gVæ7F–öâ&W7VÇD—FVÒ‡²Æ&VÂÂfÇVRÂ6Æ74æÖRÒrrÓ¢²Æ&VÃ¢7G&–æs²fÇVS¢7G&–æs²6Æ74æÖSó¢7G&–ærÒ’°¢&WGW&âÆF—b6Æ74æÖS×¶&÷VæFVB×†Â&rÖ&6¶w&÷VæBÓBG¶6Æ74æÖWÖÓãÆGB6Æ74æÖSÒ'FW‡B×6ÒföçBÖÖVF—VÒFW‡BÖ×WFVBÖf÷&Vw&÷VæB#ç¶Æ&VÇÓÂöGCãÆFB6Æ74æÖSÒ&×BÓ'&V²×v÷&G2FW‡BÖÆrföçB×6VÖ–&öÆB#ç·fÇVWÓÂöFCãÂöF—cã°§Ğ ¦gVæ7F–öâ7FW2‡²7FW2Ó¢²7FW3¢7G&–æuµÒÒ’°¢&WGW&âÆF—b6Æ74æÖSÒ&×BÓR&÷VæFVB×†Â&rÖ&6¶w&÷VæBÓB#ãÆƒB6Æ74æÖSÒ&föçB×6VÖ–&öÆB#å7FWÖ'’×7FW6öÇWF–öãÂöƒCãÆöÂ6Æ74æÖSÒ&×BÓ2Æ—7BÖFV6–ÖÂ76R×’Ó"ÂÓRFW‡B×6ÒÆVF–ær×&VÆ†VBFW‡BÖ×WFVBÖf÷&Vw&÷VæB#ç·7FW2æÖ‚‡7FWÂ–æFW‚’ÓâÆÆ’¶W“×¶G¶–æFW‡ÒÒG·7FWÖÓç·7FWÓÂöÆ“â—ÓÂööÃãÂöF—cã°§Ğ ¦gVæ7F–öâ6Æ7VÆFR†ÖöFS¢&F–ôÖöFRÂfÇVW3¢7G&–æuµÒ“¢²&W7VÇC¢6Æ7VÆF–öâÂçVÆÃ²W'&÷#¢7G&–ærÂçVÆÂÒ°¢G'’°¢–b†ÖöFRÓÓÒw6–×Æ–g’r’&WGW&â²&W7VÇC¢²¶–æC¢ÖöFRÂ&W7VÇC¢6–×Æ–g•&F–ò‡fÇVW2ç6Æ–6RƒÂ"’’ÒÂW'&÷#¢çVÆÂÓ°¢–b†ÖöFRÓÓÒwF‡&VRr’&WGW&â²&W7VÇC¢²¶–æC¢ÖöFRÂ&W7VÇC¢6–×Æ–g•&F–ò‡fÇVW2ç6Æ–6RƒÂ2’’ÒÂW'&÷#¢çVÆÂÓ°¢–b†ÖöFRÓÓÒw66ÆRr’&WGW&â²&W7VÇC¢²¶–æC¢ÖöFRÂ&W7VÇC¢66ÆU&F–ò‡fÇVW5³ÒóòrrÂfÇVW5³ÒóòrrÂfÇVW5³%Òóòrr’ÒÂW'&÷#¢çVÆÂÓ°¢&WGW&â²&W7VÇC¢²¶–æC¢ÖöFRÂ&W7VÇC¢6öÇfU&÷÷'F–öâ…·fÇVW5³ÒóòrrÂfÇVW5³ÒóòrrÂfÇVW5³%ÒóòrrÂfÇVW5³5ÒóòruÒ’ÒÂW'&÷#¢çVÆÂÓ°¢Ò6F6‚†W'&÷"’°¢&WGW&â²&W7VÇC¢çVÆÂÂW'&÷#¢W'&÷"–ç7Fæ6VöbW'&÷"òW'&÷"æÖW76vR¢t6†V6²F†RfÇVW2æBG'’v–âârÓ°¢Ğ§Ğ