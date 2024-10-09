import Head from "next/head";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";
import Video from "../components/video";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import Faq from "../components/faq";
import Image from "next/image";
import heroImg from "../public/img/hero.png"; 

const Home = () => {
  return (
    <>
      <Head>
        <title>Yachay Archaeological Museum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <SectionTitle pretitle="About the Museum" title="Get to know us">
        The archaeological museum of the Yachay Tech University is a museum formed 
        from the archaeological goods and material found from the archaeological 
        investigation called "Siembra: Archaeological Interventions 2014-2020" carried 
        out between the years 2014 to 2020 by the public company Siembra. In 2020 it closed 
        its doors, but as of 2022 it reopened its doors thanks to the project "Safeguarding 
        the Caranqui cultural heritage in northern Ecuador", executed based on the framework 
        agreement between the Embassy of the United States and the School of Earth, Energy 
        and Environmental Sciences of the Yachay Tech University.
      </SectionTitle>

      <div className="flex justify-center mb-10">
        <Image
          src={heroImg}
          width="616"
          height="617"
          className={"object-cover"}
          alt="Hero Illustration"
          loading="eager"
          placeholder="blur"
        />
      </div>

      <SectionTitle pretitle="Prizes" title="Our project">
        The project “Safeguarding the Caranqui cultural heritage in northern Ecuador”, approved in 2021, and whose award number is: SEC75021GR3013, is an award from the Ambassadors Fund Program for Cultural Preservation granted by the Embassy of the United States, which allocated $220,271.00 to the Yachay Tech University so that, together with the School of Earth, Energy and Environmental Sciences, it will be responsible for executing it.
      </SectionTitle>

      <SectionTitle pretitle="Watch a video" title="How to get">
        To be able to visit us and enjoy a wonderful experience about science and history, you can follow the video to guide you.
      </SectionTitle>
      <Video />
      <SectionTitle pretitle="Testimonials" title="Here's what our visitors said">
        Testimonials is a great way to increase the brand trust and awareness. Use this section to highlight your popular customers.
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
