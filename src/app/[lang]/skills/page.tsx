
import { getPortfolioData } from "@/lib/data";
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/../i18n.config';
import Skills from "@/components/sections/Skills";

export default async function SkillsPage({ params }: { params: { lang: Locale } }) {
  const { lang } = await params;
  const { softSkills, hardSkills, softwareSkills } = await getPortfolioData();
  const dictionary = await getDictionary(lang);

  return (
    <div className="py-24 sm:py-32">
      <Skills 
        softSkills={softSkills}
        hardSkills={hardSkills}
        softwareSkills={softwareSkills}
        dictionary={dictionary} 
      />
    </div>
  );
}
