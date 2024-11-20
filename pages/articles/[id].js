import Head from "next/head";
import Image from "next/image";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function Articulo({ article }) {
  if (!article) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold">Artículo no encontrado</h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} - Descripción Detallada</title>
      </Head>
      <Navbar />
      <main className="container mx-auto p-8">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="relative w-full h-[600px] mb-4">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              style={{ objectFit: 'contain' }}
              priority
              className="rounded-lg shadow-lg"
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-lg">{article.description}</p>
          </div>

          <div className="mt-4 bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-600">
              Fecha de creación: {article.createdAt ? 
                new Date(article.createdAt).toLocaleDateString() : 
                'Fecha no disponible'}
            </p>
            <p className="text-sm text-gray-600">
              Última actualización: {article.updatedAt ? 
                new Date(article.updatedAt).toLocaleDateString() : 
                'Fecha no disponible'}
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  if (!params?.id) {
    return { props: { article: null } };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/catalogue/${params.id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const article = await response.json();

    return {
      props: {
        article
      }
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      props: {
        article: null
      }
    };
  }
}