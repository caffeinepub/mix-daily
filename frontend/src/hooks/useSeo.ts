import { useEffect } from 'react';

interface SeoData {
  title: string;
  description: string;
  jsonLd?: object;
}

export function useSeo({ title, description, jsonLd }: SeoData) {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    let scriptTag: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(jsonLd);
      document.head.appendChild(scriptTag);
    }

    return () => {
      if (scriptTag) {
        document.head.removeChild(scriptTag);
      }
    };
  }, [title, description, jsonLd]);
}
