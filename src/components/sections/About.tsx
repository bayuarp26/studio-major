
import Image from 'next/image';

interface AboutProps {
  about: string;
  profilePictureUrl: string;
  dictionary: any;
}

export default function About({ about, profilePictureUrl, dictionary }: AboutProps) {
  return (
    <section id="about" className="py-24 sm:py-32 bg-secondary">
      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-5">
          <div className="hidden lg:col-span-2 lg:block">
             <div className="relative mx-auto h-96 w-full max-w-sm">
               <Image
                src={profilePictureUrl}
                alt="Foto profil Wahyu Pratomo"
                fill
                className="rounded-xl object-cover shadow-lg"
                data-ai-hint="professional man"
              />
             </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-center font-headline text-4xl font-semibold text-primary sm:text-5xl lg:text-left">
              {dictionary.about.title}
            </h2>
            <p className="mt-6 text-center text-lg leading-relaxed text-foreground/70 lg:text-left">
              {about}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
