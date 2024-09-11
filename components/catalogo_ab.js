import { useState, useEffect } from 'react';
import Head from "next/head";
import Navbar from "../components/navbar";
import PopupWidget from "../components/popupWidget";
import Link from 'next/link';
import Image from 'next/image';

const ITEMS_PER_PAGE = 6;

const Catalogo = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
    };
    
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    return article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           article.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetear la página actual cuando se cambia el término de búsqueda
  };

  return (
    <>
      <Head>
        <title>Yachay Archaeological Museum</title>
      </Head>

      <Navbar />
      
      <main className={`container mx-auto p-9 ${darkMode ? 'dark' : ''}`}>
        {/* Texto "Artículos disponibles" */}
        <div className="mb-5 text-center">
          <p className="text-lg font-bold">Articles on exhibitions</p>
        </div>
        {/* Barra de búsqueda */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 w-full border rounded"
          />
        </div>

        <div className="flex flex-wrap justify-center">
          {currentArticles.map(article => (
            <div key={article._id} className={`max-w-sm rounded overflow-hidden shadow-lg m-4 border ${darkMode ? 'border-gray-600' : 'border-cyan-500'}`}>
              {/* Contenido del artículo */}
              <Link href={`/articles/${article._id}`}>
                <div className="cursor-pointer bg-blue-200 rounded">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={500}
                    height={300}
                    layout="responsive"
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 text-black">{article.title}</div>
                    <p className="text-base text-black">{article.description}</p>
                  </div>
                </div>
              </Link>
              {/* Sección de información adicional */}
              <div className="px-6 py-4 bg-blue-200 rounded text-black">
                <div className="text-sm">
                  <p><strong>IDENTIFICACIÓN</strong></p>
                  <p>Código de coleccionista: {article.codigoColeccionista}</p>
                  <p>Código Sipce: {article.codigoSipce}</p>
                  <p>Código de ubicación: {article.codigoUbicacion}</p>
                  <p>FILIACIÓN CULTURAL: {article.filiacionCultural}</p>
                  <p><strong>DIMENSIONES</strong></p>
                  <p>{article.dimensiones}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botones de paginación */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 text-white bg-blue-500 rounded disabled:bg-gray-400"
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 text-white bg-blue-500 rounded disabled:bg-gray-400"
          >
            Siguiente
          </button>
        </div>
      </main>
      
      
    </>
  );
}

export default Catalogo;
