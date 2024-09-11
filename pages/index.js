import Head from "next/head";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";
import { benefitOne, benefitTwo } from "../components/data";
import Video from "../components/video";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import Faq from "../components/faq";
import PopupWidget from "../components/popupWidget";

const Home = () => {
  return (
    <>
      <Head>
        <title>Yachay Archaeological Museum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Hero />
      <SectionTitle
        //pretitle="Yachay Museum Benefits"
        title=" Project ">
        
          The project “Safeguarding the Caranqui cultural heritage in northern Ecuador”, approved in 2021, and whose award number is: SEC75021GR3013, is an award from the Ambassadors Fund Program for Cultural Preservation granted by the Embassy of the United States United States, which allocated $220,271.00 to the Yachay Tech University so that, together with the School of Earth, Energy and Environmental Sciences, it will be responsible for executing it.
  
      </SectionTitle>
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle
        pretitle="Watch a video"
        title="How to get">
        
          To be able to visit us and enjoy a wonderful experience about science and history, you can follow the video to guide you.
  
      </SectionTitle>
      <Video />
      <SectionTitle
        pretitle="Testimonials"
        title="Here's what our customers said">
        
          Testimonails is a great way to increase the brand trust and awareness. Use this section to highlight your popular customers.
  
      </SectionTitle>
      <Testimonials />
      <SectionTitle pretitle="FAQ" title="Frequently Asked Questions">
        
          Answer your customers possible questions here, it will increase the conversion rate as well as support or chat requests.
  
      </SectionTitle>
      <Faq />
      
      <Footer />
      
    </>
  );
}

export default Home;
