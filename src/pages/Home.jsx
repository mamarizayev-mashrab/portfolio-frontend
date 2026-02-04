/**
 * Home Page Component
 * Main portfolio landing page with all sections
 */

import { Helmet } from 'react-helmet-async';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Projects from '../components/portfolio/Projects';
import Experience from '../components/portfolio/Experience';
import Contact from '../components/portfolio/Contact';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Portfolio | Full-Stack Developer</title>
                <meta name="description" content="Professional Full-Stack Developer Portfolio - Building modern web applications with React, Node.js, and cutting-edge technologies." />
                <meta property="og:title" content="Portfolio | Full-Stack Developer" />
                <meta property="og:description" content="Professional Full-Stack Developer Portfolio" />
                <meta property="og:type" content="website" />
            </Helmet>

            <main className="relative">
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Experience />
                <Contact />
            </main>
        </>
    );
};

export default Home;
