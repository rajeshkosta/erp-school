import React, { useEffect } from "react";
import HeroSection from "./components/HeroSection/HeroSection";
import AboutUs from "./components/AboutUs/AboutUs";
import GallerySection from "./components/Gallery/Gallery";
import ContactUsSection from "./components/ContactUs/ContactUs";
import FeatureSection from "./components/Feature/Feature";
import Footer from "../../shared/component/Footer/Footer";
import Header from "../../shared/component/Header/Header";
import { useLocation } from "react-router-dom";

const Home = () => {
  const {state} = useLocation();


  useEffect(() => {
    if(state && state.scroll_section) {
      scrollToSection(state.scroll_section);
    }
  }, [state]);

  
  const scrollToSection = (target) => {
    if (target !== "") {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });

      }
    }
  };

  return (
    <div>
   
      <HeroSection />
      <AboutUs />
      <FeatureSection />
      <GallerySection />
      <ContactUsSection />
      <Footer />
    </div>
  );
};

export default Home;
