import HeroV2 from "./HeroV2";
import NavbarV2 from "./NavbarV2";
import AboutV2 from "./AboutV2";
import ProjectsV2 from "./ProjectsV2";
import ContactV2 from "./ContactV2";

// Site is live — render the full portfolio for everyone.
export default function PreviewGate() {
  return (
    <>
      <NavbarV2 />
      <main>
        <HeroV2 />
        <AboutV2 />
        <ProjectsV2 />
        <ContactV2 />
      </main>
    </>
  );
}
