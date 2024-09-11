// components/ArticlePopup.js
import React from 'react';
import Image from 'next/image';

const ArticlePopup = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="max-w-4xl bg-white p-8 rounded-lg overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{article.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>
        <div className="mb-4">
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={500}
            layout="responsive"
          />
        </div>
        <p className="text-lg mb-4">{article.description}</p>
        <div className="grid grid-cols-3 gap-4">
          {article.relatedImages.map((image, index) => (
            <div key={index}>
              <Image
                src={image}
                alt={article.title}
                width={300}
                height={200}
                layout="responsive"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p><strong>Identificación</strong></p>
          <p>Código de coleccionista: {article.codigoColeccionista}</p>
          <p>Código SIPCE: {article.codigoSipce}</p>
          <p>Código de ubicación: {article.codigoUbicacion}</p>
          <p>Filiación cultural: {article.filiacionCultural}</p>
          <p><strong>Dimensiones</strong></p>
          <p>{article.dimensiones}</p>
          <p className="mt-4">{article.details}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticlePopup;
