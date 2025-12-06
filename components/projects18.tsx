import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const projects = [
  {
    heading: "Modern Living Space",
    subheading: "Residential design",
    description:
      "This project involves the complete transformation of a contemporary apartment, focusing on creating an open, minimalist aesthetic with warm accents. The goal is to maximize natural light, optimize space flow.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/alvin-engler-bIhpiQA009k-unsplash.jpg",
    url: "#",
  },
  {
    heading: "Creative Workspace",
    subheading: "Office interior",
    description:
      "In this project, we designed a dynamic office environment that fosters creativity and collaboration. This includes creating flexible work zones, incorporating biophilic design elements, comfortable breakout areas.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/michel-isamuna-kL-EAXnMAp0-unsplash.jpg",
    url: "#",
  },
  {
    heading: "Cozy Bistro Interior",
    subheading: "Restaurant design",
    description:
      "In this project, we crafted an intimate dining atmosphere for a local bistro. This includes designing custom seating arrangements, selecting warm lighting fixtures, creating feature walls.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/michal-balog-HTNB1UDJ4Hg-unsplash.jpg",
    url: "#",
  },
  {
    heading: "Boutique Showroom",
    subheading: "Retail space",
    description:
      "The objective here is to create an immersive retail environment that enhances the customer shopping experience. The focus is on strategic product placement, ambient lighting.",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/ivan-lopatin-w2DMtHixE5o-unsplash.jpg",
    url: "#",
  },
];

const Projects18 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div>
          <p className="text-muted-foreground mb-1 uppercase md:text-lg">
            Transform Ideas Into Reality
          </p>
          <h1 className="text-3xl font-bold uppercase md:text-7xl">Projects</h1>
          <p className="text-muted-foreground mt-7 max-w-2xl">
            Where creativity, craftsmanship, and vision unite to create stunning
            interior spaces. Discover our comprehensive portfolio of projects,
            each thoughtfully designed to transform spaces and enhance the lives
            of our clients worldwide.
          </p>
          <Button variant="outline" size="lg" className="mt-7">
            View All Projects
            <ArrowDownRight className="size-4" />
          </Button>
        </div>
        <div className="mt-24 flex flex-col gap-5 md:mt-36">
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.url}
              className="group relative isolate min-h-72 bg-cover bg-center px-5 py-14 lg:px-12 lg:py-24"
              style={{
                backgroundImage: `url(${project.image})`,
              }}
            >
              <div className="relative z-10 flex flex-col gap-7 text-white/80 transition-colors duration-300 ease-out group-hover:text-white lg:flex-row">
                <div className="flex gap-1 text-2xl font-bold">
                  <span>/</span>
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2.5">
                  <h3 className="text-2xl font-bold lg:text-4xl">
                    {project.heading}
                  </h3>
                  <p className="text-sm font-medium uppercase">
                    {project.subheading}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <p>{project.description}</p>
                    <div className="mt-2.5 h-0 overflow-hidden transition-all duration-300 ease-out group-hover:h-10">
                      <div>
                        <Button
                          variant="outline"
                          size="lg"
                          className="dark w-fit opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                        >
                          View project
                          <ArrowUpRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="backdrop-blur-xs absolute inset-0 z-0 bg-black/80 transition-all duration-300 ease-out group-hover:bg-black/50 group-hover:backdrop-blur-none" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Projects18 };
