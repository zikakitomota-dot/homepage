import { LearningCollectionPage } from '@/components/learning/curriculum-pages';
import { createEducationalMetadata } from '@/lib/seo';
import { learningPages } from '@/lib/learning/curriculum';
const page=learningPages.find(item=>item.path==='/learning')!;
export const metadata=createEducationalMetadata({title:page.title+' | Zalea Studio',description:page.description,path:'/learning',image:null});
export default function Page(){return <LearningCollectionPage path="/learning" />;}
