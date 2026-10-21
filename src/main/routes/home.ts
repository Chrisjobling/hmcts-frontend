import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', (req, res) => {
    res.render('home');
  });

  app.get('/get-example-case', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:4000/get-example-case', { timeout: 5000 });
      if (!response.data || typeof response.data !== 'object' || Array.isArray(response.data) || !response.data.id) {
        throw new Error('The backend returned an invalid example case');
      }
      res.render('home', { example: response.data });
    } catch (error) {
      console.error('Error fetching example case:', error);
      res.status(502).render('home', {
        error: 'The example case could not be loaded. Please try again.',
      });
    }
  });
}
