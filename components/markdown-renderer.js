// Markdown Renderer Component
// Handles loading and rendering markdown files as formatted cards

class MarkdownRenderer {
    constructor() {
        this.markdownFiles = [];
        this.container = null;
        this.loadMarkedLibrary();
    }

    // Load marked.js library dynamically
    loadMarkedLibrary() {
        if (typeof marked !== 'undefined') {
            this.initializeRenderer();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
        script.onload = () => {
            this.initializeRenderer();
        };
        document.head.appendChild(script);
    }

    initializeRenderer() {
        // Configure marked options for better rendering
        if (typeof marked !== 'undefined' && marked.setOptions) {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: false,
                mangle: false
            });
        }
    }

    // Load markdown files from the markdown directory
    async loadMarkdownFiles() {
        try {
            // First, get the list of markdown files
            const response = await fetch('markdown/index.json');
            if (!response.ok) {
                console.warn('No markdown index found, creating empty card set');
                return [];
            }

            const fileList = await response.json();
            const markdownPromises = fileList.map(async (filename) => {
                try {
                    const fileResponse = await fetch(`markdown/${filename}`);
                    if (!fileResponse.ok) {
                        console.warn(`Failed to load ${filename}`);
                        return null;
                    }

                    const content = await fileResponse.text();
                    const metadata = this.extractMetadata(content);
                    return {
                        filename,
                        content: metadata.content,
                        title: metadata.title || this.extractTitle(metadata.content) || filename.replace('.md', ''),
                        excerpt: this.extractExcerpt(metadata.content),
                        backgroundImage: metadata.backgroundImage,
                        textColor: metadata.textColor
                    };
                } catch (error) {
                    console.warn(`Error loading ${filename}:`, error);
                    return null;
                }
            });

            this.markdownFiles = (await Promise.all(markdownPromises)).filter(file => file !== null);
            return this.markdownFiles;
        } catch (error) {
            console.warn('Error loading markdown files:', error);
            return [];
        }
    }

    // Extract metadata from frontmatter (YAML-style at top of file)
    extractMetadata(content) {
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

        if (!frontmatterMatch) {
            return { content };
        }

        const frontmatter = frontmatterMatch[1];
        const mainContent = frontmatterMatch[2];

        const metadata = { content: mainContent };

        // Parse simple key: value pairs
        const lines = frontmatter.split('\n');
        lines.forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes

                if (key === 'backgroundImage' || key === 'background') {
                    metadata.backgroundImage = value;
                } else if (key === 'textColor' || key === 'color') {
                    metadata.textColor = value;
                } else if (key === 'title') {
                    metadata.title = value;
                }
            }
        });

        return metadata;
    }

    // Extract title from markdown content (first H1 or filename)
    extractTitle(content) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        return titleMatch ? titleMatch[1].trim() : null;
    }

    // Extract excerpt from markdown content (first paragraph)
    extractExcerpt(content) {
        // Remove title and get first meaningful content
        const withoutTitle = content.replace(/^#\s+.+$/m, '').trim();

        let excerpt = '';

        // Check for HTML pre tag first (for poems, etc)
        const preMatch = withoutTitle.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
        if (preMatch) {
            excerpt = preMatch[0];
            // Also get text after the pre tag
            const afterPre = withoutTitle.substring(preMatch.index + preMatch[0].length).trim();
            // Get first few paragraphs after pre
            const paragraphsAfter = afterPre.match(/^[^#<].+?(?=\n\n|$)/ms);
            if (paragraphsAfter) {
                excerpt += '\n\n' + paragraphsAfter[0];
            }
        } else {
            // Get first paragraph
            const paragraphMatch = withoutTitle.match(/^[^#<\n].+/m);
            if (paragraphMatch) {
                excerpt = paragraphMatch[0].trim();
            }
        }

        // Limit excerpt length - doubled from 150 to 300
        if (excerpt.length > 300) {
            excerpt = excerpt.substring(0, 297) + '...';
        }
        return excerpt;
    }

    // Render markdown content as HTML
    renderMarkdown(content) {
        if (typeof marked === 'undefined') {
            console.warn('Marked library not loaded');
            return content;
        }
        return marked.parse(content);
    }

    // Create a card element for a markdown file
    createCard(markdownFile) {
        const card = document.createElement('article');
        card.className = 'markdown-card animate-cascade';
        card.setAttribute('data-filename', markdownFile.filename);

        // Debug logging
        console.log('Creating card for:', markdownFile.filename);
        console.log('Background image:', markdownFile.backgroundImage);
        console.log('Text color:', markdownFile.textColor);

        // Apply background image if specified
        if (markdownFile.backgroundImage) {
            card.style.backgroundImage = `url('${markdownFile.backgroundImage}')`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
            card.classList.add('has-background-image');
            console.log('Applied background image to card');
        }

        // Apply text color if specified
        if (markdownFile.textColor) {
            card.style.color = markdownFile.textColor;
        }

        const cardContent = `
            <div class="markdown-card-header">
                <h3 class="markdown-card-title">${markdownFile.title}</h3>
                <span class="markdown-card-type">markdown</span>
            </div>
            <div class="markdown-card-excerpt">
                ${markdownFile.excerpt}
            </div>
            <div class="markdown-card-actions">
                <button class="btn-secondary read-more-btn" data-filename="${markdownFile.filename}">
                    Read More
                </button>
            </div>
        `;

        card.innerHTML = cardContent;

        // Add click handler for "Read More" button
        const readMoreBtn = card.querySelector('.read-more-btn');
        readMoreBtn.addEventListener('click', () => {
            this.showFullContent(markdownFile);
        });

        return card;
    }

    // Show full markdown content in a modal or expanded view
    showFullContent(markdownFile) {
        const modal = document.createElement('div');
        modal.className = 'markdown-modal';
        modal.innerHTML = `
            <div class="markdown-modal-content">
                <div class="markdown-modal-header">
                    <h2>${markdownFile.title}</h2>
                    <button class="markdown-modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="markdown-modal-body">
                    ${this.renderMarkdown(markdownFile.content)}
                </div>
            </div>
            <div class="markdown-modal-backdrop"></div>
        `;

        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = modal.querySelector('.markdown-modal-close');
        const backdrop = modal.querySelector('.markdown-modal-backdrop');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Focus management for accessibility
        closeBtn.focus();
    }

    // Render all markdown files as cards in a container
    async renderCards(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container ${containerSelector} not found`);
            return;
        }

        this.container = container;

        // Add loading state
        container.innerHTML = '<div class="markdown-loading">Loading markdown content...</div>';

        // Load markdown files
        await this.loadMarkdownFiles();

        if (this.markdownFiles.length === 0) {
            container.innerHTML = `
                <div class="markdown-empty">
                    <p>No markdown files found.</p>
                    <p class="markdown-empty-hint">Add .md files to the <code>src/markdown/</code> directory to see them here.</p>
                </div>
            `;
            return;
        }

        // Clear loading and render cards
        container.innerHTML = '';

        // Create cards grid
        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'markdown-cards-grid';

        this.markdownFiles.forEach(file => {
            const card = this.createCard(file);
            cardsGrid.appendChild(card);
        });

        container.appendChild(cardsGrid);
    }

    // Refresh the markdown content (useful for development)
    async refresh() {
        if (this.container) {
            await this.renderCards(this.container.id ? `#${this.container.id}` : '.markdown-container');
        }
    }
}

// Initialize markdown renderer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize if markdown container exists
    const markdownContainer = document.querySelector('.markdown-container, #markdown-content');
    if (markdownContainer) {
        const renderer = new MarkdownRenderer();
        const containerSelector = markdownContainer.id ? `#${markdownContainer.id}` : '.markdown-container';
        renderer.renderCards(containerSelector);

        // Make renderer available globally for development
        window.markdownRenderer = renderer;
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownRenderer;
}