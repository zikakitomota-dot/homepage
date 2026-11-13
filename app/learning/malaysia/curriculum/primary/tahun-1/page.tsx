import { LearningCollectionPage } from '@/components/learning/curriculum-pages';
import { createEducationalMetadata } from '@/lib/seo';
import { learningPages } from '@/lib/learning/curriculum';
const page=learningPages.find(item=>item.path==='/learning/malaysia/curriculum/primary/tahun-1')!;
export const metadata=createEducationalMetadata({title:page.title+' | Zalea Studio',description:page.description,path:'/learning/malaysia/curriculum/primary/tahun-1',image:null});
export default function Page(){return <LearningCollectionPage path="/learning/malaysia/curriculum/primary/tahun-1" />;}
