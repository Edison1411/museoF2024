import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Head from "next/head";
import Navbar from "../components/navbar";
import Link from 'next/link';
import Image from 'next/image';

const ITEMS_PER_PAGE = 6;

const Catalogo = () => {
  const [articles, setArticles] = useState([]);
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0); 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = getToken();
        const response = await fetch(`/api/catalogue?page=${currentPage}&search=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setArticles(data.items.filter(item => item.isVisible));
        setTotalItems(data.total);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
        setTotalItems(0);
      }
    };

    fetchArticles();
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se cambia el término de búsqueda
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
          {articles.length === 0 ? (
            <p>No articles found.</p>
          ) : (
            articles.map((article, index) => (
              <div key={article.id} className={`max-w-sm rounded overflow-hidden shadow-lg m-4 border ${darkMode ? 'border-gray-600' : 'border-cyan-500'}`}>
                <Link href={`/articles/${article.id}`}>
                  <div className="cursor-pointer bg-blue-200 rounded">
                    <div className="relative w-full aspect-w-16 aspect-h-9">
                      <Image
                        src={article.imageUrl || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        priority={index === 0} // Añade priority solo a la primera imagen
                      />
                    </div>
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2 text-black">{article.title}</div>
                      <p className="text-base text-black">{article.description || 'No description available'}</p>
                    </div>
                  </div>
                </Link>
                {/* Sección de información adicional */}
                <div className="px-6 py-4 bg-blue-200 rounded text-black">
                  <div className="text-sm">
                    <p><strong>IDENTIFICACIÓN</strong></p>
                    <p>Código de coleccionista: {article.codigoColeccionista || 'N/A'}</p>
                    <p>Código Sipce: {article.codigoSipce || 'N/A'}</p>
                    <p>Código de ubicación: {article.codigoUbicacion || 'N/A'}</p>
                    <p>FILIACIÓN CULTURAL: {article.filiacionCultural || 'N/A'}</p>
                    <p><strong>DIMENSIONES</strong></p>
                    <p>{article.dimensiones || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
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