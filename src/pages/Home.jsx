/**
 * Home Page Component
 * Main portfolio landing page with all sections
 * Optimized for SEO with comprehensive meta tags and structured data
 */

import { Helmet } from 'react-helmet-async';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Projects from '../components/portfolio/Projects';
import Experience from '../components/portfolio/Experience';
import Contact from '../components/portfolio/Contact';

const Home = () => {
    // SEO Configuration
    const seoConfig = {
        title: "Mashrab Mamarizayev | Full-Stack Developer Portfolio",
        description: "Professional Full-Stack Developer specializing in React, Node.js, MongoDB, and modern web technologies. Building scalable, high-performance web applications.",
        url: "https://asqarovich.uz/",
        image: "https://asqarovich.uz/og-image.svg",
        author: "Mashrab Mamarizayev",
        keywords: "Full-Stack Developer, Web Developer, React Developer, Node.js, JavaScript, Portfolio, Mashrab Mamarizayev, Uzbekistan Developer"
    };

    // JSON-LD for Professional Service
    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Mashrab Mamarizayev - Web Development Services",
        "description": seoConfig.description,
        "url": seoConfig.url,
        "image": seoConfig.image,
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "UZ"
        },
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 41.2995,
                "longitude": 69.2401
            }
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Web Development Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Frontend Development",
                        "description": "React, Vue.js, Next.js web applications"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Backend Development",
                        "description": "Node.js, Express.js, MongoDB APIs"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Full-Stack Development",
                        "description": "Complete web application development"
                    }
                }
            ]
        }
    };

    // BreadcrumbList for navigation
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": seoConfig.url
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "About",
                "item": `${seoConfig.url}#about`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Skills",
                "item": `${seoConfig.url}#skills`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": "Projects",
                "item": `${seoConfig.url}#projects`
            },
            {
                "@type": "ListItem",
                "position": 5,
                "name": "Experience",
                "item": `${seoConfig.url}#experience`
            },
            {
                "@type": "ListItem",
                "position": 6,
                "name": "Contact",
                "item": `${seoConfig.url}#contact`
            }
        ]
    };

    return (
        <>
            <Helmet>
                {/* Primary Meta Tags */}
                <title>{seoConfig.title}</title>
                <meta name="title" content={seoConfig.title} />
                <meta name="description" content={seoConfig.description} />
                <meta name="keywords" content={seoConfig.keywords} />
                <meta name="author" content={seoConfig.author} />
                <link rel="canonical" href={seoConfig.url} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={seoConfig.url} />
                <meta property="og:title" content={seoConfig.title} />
                <meta property="og:description" content={seoConfig.description} />
                <meta property="og:image" content={seoConfig.image} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="uz_UZ" />
                <meta property="og:site_name" content="Mashrab Portfolio" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={seoConfig.url} />
                <meta name="twitter:title" content={seoConfig.title} />
                <meta name="twitter:description" content={seoConfig.description} />
                <meta name="twitter:image" content={seoConfig.image} />

                {/* JSON-LD Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(professionalServiceSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <main className="relative" role="main" itemScope itemType="https://schema.org/WebPage">
                {/* Hero Section */}
                <section id="hero" aria-label="Introduction">
                    <Hero />
                </section>

                {/* About Section */}
                <section id="about" aria-label="About Me">
                    <About />
                </section>

                {/* Skills Section */}
                <section id="skills" aria-label="Technical Skills">
                    <Skills />
                </section>

                {/* Projects Section */}
                <section id="projects" aria-label="Portfolio Projects">
                    <Projects />
                </section>

                {/* Experience Section */}
                <section id="experience" aria-label="Work Experience">
                    <Experience />
                </section>

                {/* Contact Section */}
                <section id="contact" aria-label="Contact Information">
                    <Contact />
                </section>
            </main>
        </>
    );
};

export default Home;
