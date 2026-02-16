import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'video.movie' | 'video.tv_show';
}

export default function SEO({ title, description, image, type = 'website' }: SEOProps) {
  const siteTitle = "PitBox | Premium Streaming";
  const fullTitle = `${title} - ${siteTitle}`;
  const defaultDesc = "Watch the latest movies and series translated by your favorite VJs on PitBox.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}