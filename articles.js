class ArticleManager {
    constructor() {
        this.apiUrl = 'YOUR_API_GATEWAY_URL/prod/articles';
        this.currentPage = 1;
        this.articles = [];
        
        // Bind elements
        this.gridElement = document.querySelector('.articles-grid');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.searchFilter = document.getElementById('searchFilter');
        
        // Bind event listeners
        this.categoryFilter.addEventListener('change', () => this.filterArticles());
        this.searchFilter.addEventListener('input', () => this.filterArticles());
    }

    async loadArticles() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            this.articles = data.articles;
            
            // Update category filter options
            this.updateCategoryOptions();
            
            // Render articles
            this.renderArticles();
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showError();
        }
    }

    updateCategoryOptions() {
        const categories = [...new Set(this.articles.map(article => article.category))];
        const options = categories.map(category => 
            `<option value="${category}">${category}</option>`
        ).join('');
        
        this.categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
    }

    async filterArticles() {
        const category = this.categoryFilter.value;
        const searchTerm = this.searchFilter.value;
        
        let url = this.apiUrl;
        if (category || searchTerm) {
            url += '?';
            if (category) url += `category=${encodeURIComponent(category)}&`;
            if (searchTerm) url += `searchTerm=${encodeURIComponent(searchTerm)}&`;
        }
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.renderArticles(data.articles);
        } catch (error) {
            console.error('Error filtering articles:', error);
        }
    }

    renderArticles(articles = this.articles) {
        this.gridElement.innerHTML = articles.map(article => `
            <article class="article-card">
                <img src="${article.image}" alt="${article.title}" class="article-image">
                <div class="card-content">
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <div class="article-meta">
                        <span class="date">${new Date(article.date).toLocaleDateString()}</span>
                        <span class="category">${article.category}</span>
                    </div>
                    <a href="${article.url}" class="button" target="_blank">Read More</a>
                </div>
            </article>
        `).join('');
    }

    showError() {
        this.gridElement.innerHTML = `
            <div class="error-message">
                <h4>Failed to load articles</h4>
                <p>Please try again later</p>
                <button onclick="articleManager.loadArticles()" class="button">Retry</button>
            </div>
        `;
    }
}

// Initialize
const articleManager = new ArticleManager();
articleManager.loadArticles();