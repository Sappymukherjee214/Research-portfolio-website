import HeroAnimation from "@/components/HeroAnimation";
import ResearchProjects from "@/components/ResearchProjects";
import Expertise from "@/components/Expertise";
import ResearchStatement from "@/components/ResearchStatement";
import Contact from "@/components/Contact";
import AskMyResearch from "@/components/AskMyResearch";
import VisionPlayground from "@/components/VisionPlayground";
import NetworkGraph from "@/components/NetworkGraph";
import GithubStream from "@/components/GithubStream";
import CollaborationMatcher from "@/components/CollaborationMatcher";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="bg-transparent text-white min-h-screen">
      <Navbar />
      {/* 
        Hero section includes the scroll-driven cinematic canvas animation.
        It has a height of 400vh to allow for scrolling. 
      */}
      <HeroAnimation />
      
      {/* 
        The rest of the sections follow. 
        They have relative positioning and z-index to appear over the fixed hero canvas. 
      */}
      <section id="vision" className="relative z-30 bg-black/60 backdrop-blur-3xl py-24 px-6 border-t border-white/5">
        <VisionPlayground />
      </section>

      <div id="projects">
        <ResearchProjects />
      </div>
      
      <section id="network" className="relative z-30 bg-black/60 backdrop-blur-3xl py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-2/3">
            <NetworkGraph />
          </div>
          <div className="w-full lg:w-1/3">
            <GithubStream />
          </div>
        </div>
      </section>

      <div id="expertise">
        <Expertise />
      </div>
      <ResearchStatement />
      <div id="assistant">
        <AskMyResearch />
      </div>
      <section className="relative z-30 bg-black/60 backdrop-blur-3xl py-24 px-6 border-t border-white/5">
        <CollaborationMatcher />
      </section>
      <div id="contact">
        <Contact />
      </div>
    </main>
  );
}
