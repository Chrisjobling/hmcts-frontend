import { Nunjucks } from '../../main/modules/nunjucks';
import home from '../../main/routes/home';

import axios from 'axios';
import express from 'express';
import request from 'supertest';

jest.mock('axios');
const get = jest.mocked(axios.get);

const app = express();
new Nunjucks(false).enableFor(app);
home(app);

describe('Home page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('shows a button without fetching the case on initial load', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.text).toContain('Get example case');
    expect(response.text).toContain('action="/get-example-case"');
    expect(get).not.toHaveBeenCalled();
    expect(response.text).not.toContain('govuk-summary-list__key');
  });

  test('fetches and displays the case as an escaped summary list', async () => {
    get.mockResolvedValue({
      data: {
        id: 1,
        caseNumber: 'CASE-123',
        title: 'Example title',
        description: '<script>alert("unsafe")</script>',
        status: 'Open',
        createdDate: '2026-10-21',
      },
    });

    const response = await request(app).get('/get-example-case').expect(200);

    expect(get).toHaveBeenCalledWith('http://localhost:4000/get-example-case', { timeout: 5000 });
    expect(response.text).toContain('govuk-summary-list');
    expect(response.text).toContain('CASE-123');
    expect(response.text).toContain('Example title');
    expect(response.text).toContain('&lt;script&gt;');
    expect(response.text).not.toContain('<script>alert');
    expect(response.text).toContain('Open');
    expect(response.text).toContain('2026-10-21');
    expect(response.text).not.toContain('>Change<');
  });

  test.each(['unavailable', 'invalid'])('shows a retryable error when the backend is %s', async failure => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    if (failure === 'unavailable') {
      get.mockRejectedValue(new Error('Connection refused'));
    } else {
      get.mockResolvedValue({ data: {} });
    }

    try {
      const response = await request(app).get('/get-example-case').expect(502);

      expect(response.text).toContain('The example case could not be loaded. Please try again.');
      expect(response.text).toContain('Get example case');
      expect(response.text).not.toContain('govuk-summary-list__key');
      expect(log).toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
