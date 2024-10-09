import Image from "next/image";
import Container from "./container";
import MuseumImg from "../public/img/Museo.jpg";

import { Swiper, SwiperSlide } from 'swiper/react';

const About = () => {
  return (
    <>
      {/* Título principal de la página */}
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold leading-snug tracking-tight text-gray-800 dark:text-white">
          Mission
        </h1>
      </div>

      <Container className="flex flex-wrap">
        {/* Contenedor del texto */}
        <div className="flex items-center w-full lg:w-1/2 order-last lg:order-first lg:pr-8 mb-8 lg:mb-0"> {/* Margen derecho en pantallas grandes */}
          <div className="max-w-2xl">
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              The Yachay Museum is committed to preserving, promoting and sharing the rich cultural,
              scientific and artistic heritage of the region, 
              offering meaningful and accessible educational experiences for all visitors.
              Through innovative exhibits, educational programs, and community activities,
              we seek to inspire curiosity, foster appreciation for cultural diversity, 
              and stimulate creativity and critical thinking. In addition, we strive to contribute to the development of cultural tourism and the strengthening 
              of local identity and pride. Our mission is to be a dynamic center of learning and community gathering 
              that enriches the lives of those who visit us and the community in general.
            </p>
          </div>
        </div>

        {/* Contenedor de la imagen */}
        <div className="flex items-center justify-center w-full lg:w-1/2 order-first lg:order-last lg:pl-8"> {/* Margen izquierdo en pantallas grandes */}
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 3000 }} // Cambiar imagen cada 3 segundos
            loop={true} // Para que la presentación sea continua
            className="w-full h-auto"
          >
            <SwiperSlide>
              <Image
                src={MuseumImg}
                width="600"
                height="600"
                className={"object-cover"}
                alt="Hero Image 1"
              />
            </SwiperSlide>
            
            {/* Agregar más SwiperSlide para más imágenes */}
          </Swiper>
        </div>
      </Container>
    </>
  );
}

export default About;
