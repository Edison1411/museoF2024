import Head from "next/head";
import Navbar from "../components/navbar";
import { benefitOne, benefitTwo } from "../components/About_data";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import PopupWidget from "../components/popupWidget";
import About from "../components/About";

const History = () => {
  return (
    <>
      <Head>
      <title>Yachay Archaeological Museum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <About />

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      
            
      <Footer />

    </>
  );
}

export default History;