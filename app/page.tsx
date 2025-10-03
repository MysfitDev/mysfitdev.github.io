import Link from 'next/link';
import React from 'react';

export const metadata = {
    title: 'mysfitdev.github.io',
};

export default function Page() {
    return (
        <main style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', padding: '2rem' }}>
            <h1>Welcome to MysfitDev's GitHub Pages</h1>
            <p>
                This repository hosts a collection of links to various resources. Use this page as a central hub to navigate to the tools, guides, and references you need.
            </p>

            <section>
                <h2>Resources</h2>
                <ul>
                    <li>
                        <Link href="./dnd/homebrew">D&D Content</Link>: Dungeons and Dragons content
                    </li>
                    <li>
                        <Link href="./dnd/homebrew">Homebrew Content</Link>: Homebrew content for Dungeons and Dragons
                    </li>
                </ul>
            </section>

            <section>
                <h2>About</h2>
                <p>
                    This project is maintained by MysfitDev to provide easy access to resources. Feel free to explore and contribute!
                </p>
            </section>

            <section>
                <h2>Contributing</h2>
                <p>
                    We welcome contributions! If you have suggestions or additional resources to share, please open an issue or submit a pull request.
                </p>
            </section>

            <section>
                <h2>License</h2>
                <p>
                    This project is licensed under the <Link href="LICENSE">MIT License</Link>.
                </p>
            </section>

            <footer style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
                <p>
                    Built with ❤️ using <Link href="https://pages.github.com/">GitHub Pages</Link>.
                </p>
            </footer>
        </main>
    );
}