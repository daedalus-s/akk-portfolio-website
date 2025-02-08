const AWS = require('aws-sdk');

// Configure AWS (Replace with your region)
AWS.config.update({
    region: 'us-east-1' 
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Sample articles array - you can modify this with your actual articles
const articles = [
    {
        id: '1',
        title: 'First Article',
        description: 'This is a description of the first article...',
        image: 'articles/article1.jpg',
        url: 'https://example.com/article1',
        date: '2024-01-20',
        category: 'Technology'
    },
    {
        id: '2',
        title: 'Second Article',
        description: 'This is a description of the second article...',
        image: 'articles/article2.jpg',
        url: 'https://example.com/article2',
        date: '2024-01-21',
        category: 'Writing'
    }
];

async function uploadArticles() {
    for (const article of articles) {
        const params = {
            TableName: 'portfolio-articles',
            Item: article
        };

        try {
            await dynamodb.put(params).promise();
            console.log(`Successfully uploaded article: ${article.title}`);
        } catch (error) {
            console.error(`Error uploading article ${article.title}:`, error);
        }
    }
}

uploadArticles();