import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Navbar from "../../components/navbar"; 
import Footer from "../../components/footer"; 

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
      </Head>
      <Navbar />
      <div className="container mx-auto p-8 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/museum.gif" 
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
                src={article.relatedImages && article.relatedImages[currentImage] ? article.relatedImages[currentImage] : '/placeholder.jpg'}
                alt={article.title}
                layout="responsive"
                width={500}
                height={300}
              />
            </div>
          </div>
          <div className="flex justify-between">
            {article.relatedImages && article.relatedImages.length > 0 ? (
              article.relatedImages.map((image, index) => (
                <div key={index} className="w-1/4 p-2 border border-blue-500">
                  <Image
                    src={image}
                    alt={article.title}
                    width={400}
                    height={400}
                    onClick={() => setCurrentImage(index)}
                    className="cursor-pointer"
                  />
                </div>
              ))
            ) : (
              <p>No related images available.</p>
            )}
          </div>
          <p className="text-lg my-4">{article.details}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Articulo;

// Obtener datos del artículo desde la API para la página dinámica
export async function getStaticProps({ params }) {
  const { id } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogue/${id}`);

    if (!res.ok) {
      return {
        notFound: true, // Si ocurre un error, devolver una página 404
      };
    }

    const article = await res.json();

    return {
      props: {
        article,
      },
      revalidate: 10, // Revalidar los datos cada 10 segundos (si deseas ISR)
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      notFound: true,
    };
  }
}

// Generar rutas dinámicas para los artículos
export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogue`);

    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }

    const articles = await res.json();

    const paths = articles.map((article) => ({
      params: { id: article.id.toString() },
    }));

    return {
      paths,
      fallback: false, // Si un artículo no existe, mostrará una página 404
    };
  } catch (error) {
    console.error('Error fetching paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}
