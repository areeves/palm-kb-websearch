const apiKey = process.env.GCP_API_KEY;
const searchEngineId = process.env.GCP_CSE_ID;
const query = 'chatbot';

// const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&fields=items(link)`;
const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data.items);
  })
  .catch(error => {
    console.error('Error:', error);
  });
