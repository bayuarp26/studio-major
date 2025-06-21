import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const tools = [
  "Social Blade",
  "Canva",
  "Google Analytics",
  "Meta Business Suite",
  "Instagram Insights",
  "dan lainnya..."
];

export default function Tools() {
  return (
    <section id="tools" className="bg-background py-24 sm:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-semibold text-primary sm:text-5xl">
            Tools yang Digunakan
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            Beberapa tools yang saya kuasai untuk mendukung analisis dan strategi digital marketing.
          </p>
        </div>
        <Card className="mt-16 max-w-3xl mx-auto bg-card">
          <CardContent className="p-8">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
              {tools.map((tool) => (
                <li key={tool} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-foreground/80">{tool}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
