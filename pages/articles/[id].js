import Head from "next/head";
import Image from "next/image";
import articles from "../../data/articles.json"; // Importa tus datos de artículos
import { useState } from "react";
import Navbar from "../../components/navbar"; // Importa el componente Navbar
import Footer from "../../components/footer"; // Importa el componente Footer

const Articulo = ({ article }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrevImage = () => {
    setCurrentImage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => Math.min(prev + 1, article.relatedImages.length - 1));
  };

  return (
    <>
      <Head>
        <title>{article.title} - Descripción Detallada</title>
        {/* Otros metadatos si es necesario */}
      </Head>
      <Navbar /> {/* Agrega la barra de navegación */}
      <div className="container mx-auto p-8 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/museum.gif" // Ruta de tu imagen animada
            alt="Background animation"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
          />
        </div>
        <div className="relative z-50">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="relative flex justify-center">
            <button onClick={handlePrevImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 p-2 rounded-full focus:outline-none">&#8249;</button>
            <button onClick={handleNextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 p-2 rounded-full focus:outline-none">&#8250;</button>
            <div className="w-full max-w-4xl">
              <Image
                src={article.relatedImages[currentImage]}
                alt={article.title}
                layout="responsive"
                width={500}
                height={300}
              />
            </div>
          </div>
          <div className="flex justify-between">
            {article.relatedImages.map((image, index) => (
              <div key={index} className="w-1/4 p-2 border border-blue-500">
                <Image
                  src={image}
                  alt={article.title}
                  width={400}
                  height={400}
                  onClick={() => setCurrentImage(index)} // Cambiar la imagen principal al hacer clic en la miniatura
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
          <p className="text-lg my-4">{article.details}</p> {/* Aquí enlazamos la descripción detallada */}
        </div>
      </div>
      <Footer /> {/* Agrega el pie de página */}
    </>
  );
};

export default Articulo;

// Obtener datos del artículo para la página dinámica
export async function getStaticProps({ params }) {
  const { id } = params;
  const article = articles.find((item) => item.id === id); // Suponiendo que cada artículo tiene un campo "id" único
  return {
    props: {
      article,
    },
  };
}

// Generar rutas dinámicas para los artículos
export async function getStaticPaths() {
  const paths = articles.map((article) => ({
    params: { id: article.id },
  }));
  return {
    paths,
    fallback: false,
  };
}
