import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-stone-200 shadow-sm p-4 flex items-center justify-center sticky top-0 z-10">
      <div className="max-w-3xl w-full flex items-center gap-3">
        <div className="bg-yellow-500 text-white p-2 rounded-full">
          {/* Simple Cross Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-stone-800 tracking-tight">Iniciação Cristã</h1>
          <p className="text-xs text-stone-500 font-sans uppercase tracking-wider">Pesquisa de Doutrina Católica</p>
        </div>
      </div>
    </header>
  );
};