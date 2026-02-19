import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'video.movie' | 'video.tv_show' | 'article';
  canonicalPath?: string;
  noindex?: boolean;
  keywords?: string;
  /** JSON-LD structured data object */
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'PitBox';
const SITE_TITLE_SUFFIX = 'PitBox | Premium Streaming';
const BASE_URL = 'https://www.pitbox.fun';
const DEFAULT_DESCRIPTION =
  'Watch and stream the latest Ugandan movies, Hollywood blockbusters, series, and more in premium quality on PitBox. Discover thrilling action, drama, comedy, and exclusive releases.';
const DEFAULT_IMAGE = `${BASE_URL}/opengraph-image-p98pqg.png`;
const DEFAULT_KEYWORDS =
  'PitBox, Ugandan movies, Luganda films, movie streaming Uganda, watch movies online, Hollywood movies, African films, premium streaming, latest releases, action movies, drama series';

export default function SEO({
  title,
  description,
  image,
  type = 'website',
  canonicalPath,
  noindex = false,
  keywords,
  jsonLd,
}: SEOProps) {
  const fullTitle = `${title} - ${SITE_TITLE_SUFFIX}`;
  const desc = description || DEFAULT_DESCRIPTION;
  const ogImage = image || DEFAULT_IMAGE;
  const canonical = canonicalPath ? `${BASE_URL}${canonicalPath}` : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords || DEFAULT_KEYWORDS} />
      <meta name="author" content="PitBox" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${title} - ${SITE_NAME}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pitboxfun" />
      <meta name="twitter:creator" content="@pitboxfun" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - ${SITE_NAME}`} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}