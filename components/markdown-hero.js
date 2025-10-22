// Markdown Hero Component
// Renders a full-width markdown hero section at the top of the homepage

class MarkdownHero {
    constructor(heroFile = 'What is.md') {
        this.heroFile = heroFile;
        this.container = null;
    }

    async loadHeroContent() {
        try {
            const response = await fetch(`markdown/${this.heroFile}`);
            if (!response.ok) {
                console.warn(`Hero markdown file not found: ${this.heroFile}`);
                return null;
            }

            const content = await response.text();
            return content;
        } catch (error) {
            console.warn('Error loading hero markdown:', error);
            return null;
        }
    }

    async render(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Hero container ${containerSelector} not found`);
            return;
        }

        this.container = container;

        const content = await this.loadHeroContent();
        if (!content) {
            container.style.display = 'none';
            return;
        }

        // Create single markdown card styled like the other cards
        const card = document.createElement('article');
        card.className = 'markdown-card animate-cascade';
        card.style.minHeight = 'auto';
        card.innerHTML = content;

        container.appendChild(card);
    }
}

// Initialize markdown hero when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroContainer = document.querySelector('#markdown-hero-content');
    if (heroContainer) {
        const hero = new MarkdownHero('What is.md');
        hero.render('#markdown-hero-content');

        // Make hero available globally
        window.markdownHero = hero;
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownHero;
}
