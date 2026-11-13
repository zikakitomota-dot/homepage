import { DetektifBunyiPage } from '@/components/learning/curriculum-pages';
import { createEducationalMetadata } from '@/lib/seo';
import { detektifBunyi } from '@/lib/learning/curriculum';

export const metadata=createEducationalMetadata({title:'Detektif Bunyi | Bahasa Melayu Tahun 1 (SK) | Zalea Studio',description:detektifBunyi.verificationNotes,path:'/learning/malaysia/curriculum/primary/tahun-1/bahasa-melayu/detektif-bunyi',image:null});
export default function Page(){return <DetektifBunyiPage />;}
