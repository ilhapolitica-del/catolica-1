import React from 'react';
import { GroundingMetadata } from '../types';

interface SourceListProps {
  metadata?: GroundingMetadata;
}

export const SourceList: React.FC<SourceListProps> = ({ metadata }) => {
  if (!metadata || !metadata.groundingChunks || metadata.groundingChunks.length === 0) {
    return null;
  }

  // Filter chunks that have web data and deduplicate based on URI
  const sources = metadata.groundingChunks
    .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
    .map(chunk => chunk.web!)
    .filter((value, index, self) => 
      index === self.findIndex((t) => (
        t.uri === value.uri
      ))
    );

  if (sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-stone-100">
      <h4 className="text-xs font-bold text-stone-500 uppercase mb-2 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
        </svg>
        Fontes Consultadas
      </h4>
      <ul className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {sources.map((source, idx) => (
          <li key={idx}>
            <a 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start p-2 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-xs text-stone-700 group"
            >
              <span className="font-medium truncate w-full group-hover:text-blue-700">
                {source.title}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1 text-stone-400 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};