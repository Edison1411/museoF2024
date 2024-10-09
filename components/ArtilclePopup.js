// components/ArticlePopup.js
import React from 'react';
import Image from 'next/image';

const ArticlePopup = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="max-w-4xl bg-white p-8 rounded-lg overflow-y-auto">
        {/* ... otros elementos ... */}
        <div className="mb-4 relative w-full aspect-w-16 aspect-h-9">
          <Image
            src={article.image}
            alt={article.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* ... otros elementos ... */}
        <div className="grid grid-cols-3 gap-4">
          {article.relatedImages.map((image, index) => (
            <div key={index} className="relative aspect-w-3 aspect-h-2">
              <Image
                src={image}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
        {/* ... otros elementos ... */}
      </div>
    </div>
  );
};

export default ArticlePopup;
