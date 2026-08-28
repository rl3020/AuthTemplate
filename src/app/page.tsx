import Navbar from "@/app/landingPage/Navbar";
import Hero from "@/app/landingPage/Hero";
import OwnerBenefits from "@/app/landingPage/OwnerBenefits";
import PartnerBenefits from "@/app/landingPage/PartnerBenefits";
import HowItWorks from "@/app/landingPage/HowItWorks";
import TrustSection from "@/app/landingPage/TrustSection";
import FinalCTA from "@/app/landingPage/FinalCTA";
import Footer from "@/app/landingPage/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <OwnerBenefits />
        <PartnerBenefits />
        <HowItWorks />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
