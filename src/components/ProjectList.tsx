'use client';

import { useState } from 'react';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Project } from '@/lib/types';

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={`${project.title}-${index}`} className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
            <div className="aspect-video overflow-hidden">
               <Image
                src={project.imageUrl || 'https://placehold.co/600x400.png'}
                alt={project.title}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={project.imageHint}
              />
            </div>
            <CardContent className="flex flex-grow flex-col p-6">
              <CardTitle className="text-xl font-bold text-primary">{project.title}</CardTitle>
              <p className="mt-3 flex-grow text-base text-foreground/80">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-end p-6 pt-0">
              {project.link && project.link !== '#' ? (
                <Button variant="outline" onClick={() => handleViewDetails(project)}>
                  Lihat Detail
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Lihat Detail
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
            {selectedProject && (
                <>
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>{selectedProject.title}</DialogTitle>
                    </DialogHeader>
                    <div className="w-full h-full">
                        <iframe
                            src={selectedProject.link}
                            title={selectedProject.title}
                            className="w-full h-full border-0"
                            allowFullScreen
                        />
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
