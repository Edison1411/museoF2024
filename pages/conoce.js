import Head from "next/head";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
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


      
            
      <Footer />

    </>
  );
}

export default History;