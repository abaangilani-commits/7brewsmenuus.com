// The site-level schema nodes every page's graph should contain, so that
// isPartOf / publisher references resolve on the page that makes them.
'use strict';
const SITE = 'https://7brewsmenuus.com';

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: '7 Brew Menu Guide USA',
  url: SITE,
  description: 'Independent consumer guide to the 7 Brew Coffee drive-thru menu, prices, nutrition and stand locations in the United States. Not affiliated with 7 Brew Coffee.',
  logo: { '@type': 'ImageObject', url: `${SITE}/assets/apple-touch-icon.png`, width: 180, height: 180 },
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: '7 Brew Menu Guide USA',
  url: SITE,
  publisher: { '@id': ORGANIZATION['@id'] },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/locations?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

module.exports = { SITE, ORGANIZATION, WEBSITE, siteNodes: () => [ORGANIZATION, WEBSITE] };
