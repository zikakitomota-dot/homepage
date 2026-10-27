'use client';

import { useState } from 'react';
import { Languages, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MathematicsWorksheetStudio } from './mathematics-worksheet-studio';
import { EnglishWorksheetStudio } from './english-worksheet-studio';

export function WorksheetStudio() {
  const [subject, setSubject] = useState<'mathematics' | 'english'>('mathematics');
  return <div>
    <section className="worksheet-screen-only mx-auto mb-8 max-w-xl rounded-2xl border border-blue-200 bg-white p-3 shadow-sm" aria-labelledby="worksheet-subject-heading">
      <h2 id="worksheet-subject-heading" className="sr-only">Choose a worksheet subject</h2>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Worksheet subject">
        <Button type="button" size="lg" variant={subject === 'mathematics' ? 'default' : 'ghost'} aria-pressed={subject === 'mathematics'} onClick={() => setSubject('mathematics')}><Sigma className="mr-2 h-5 w-5" aria-hidden="true" />Mathematics</Button>
        <Button type="button" size="lg" variant={subject === 'english' ? 'default' : 'ghost'} aria-pressed={subject === 'english'} onClick={() => setSubject('english')}><Languages className="mr-2 h-5 w-5" aria-hidden="true" />English</Button>
      </div>
    </section>
    {subject === 'mathematics' ? <MathematicsWorksheetStudio /> : <EnglishWorksheetStudio />}
  </div>;
}
