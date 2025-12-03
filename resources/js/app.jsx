import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import '../css/app.css';
import axios from 'axios';

const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found');
}

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Track if we're in the middle of handling a 419 error
let handling419 = false;

// Intercept axios errors to handle 419 globally (before Inertia sees it)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 419 && !handling419) {
      handling419 = true;

      // Store the failed request config to retry after reload
      const requestConfig = error.config;
      sessionStorage.setItem('csrf_retry_request', JSON.stringify({
        url: requestConfig.url,
        method: requestConfig.method,
        data: requestConfig.data,
        timestamp: Date.now()
      }));

      // Reload page to get fresh CSRF token
      window.location.reload();

      // Return a never-resolving promise to prevent further error handling
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

// After page reload, check if we need to retry a request
window.addEventListener('load', () => {
  const retryRequest = sessionStorage.getItem('csrf_retry_request');

  if (retryRequest) {
    try {
      const request = JSON.parse(retryRequest);

      // Only retry if it's less than 5 seconds old (prevent stale retries)
      if (Date.now() - request.timestamp < 5000) {
        // Clear the stored request
        sessionStorage.removeItem('csrf_retry_request');

        // Wait a bit for the page to fully load
        setTimeout(() => {
          // Retry the request with fresh CSRF token
          axios({
            url: request.url,
            method: request.method,
            data: request.data ? JSON.parse(request.data) : undefined
          }).then(() => {
            // Request succeeded, reload to get the new state
            window.location.href = window.location.href;
          }).catch(err => {
            console.error('Retry failed:', err);
          });
        }, 100);
      } else {
        // Request too old, just clear it
        sessionStorage.removeItem('csrf_retry_request');
      }
    } catch (e) {
      console.error('Error retrying request:', e);
      sessionStorage.removeItem('csrf_retry_request');
    }
  }
});

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App {...props} />
      </ThemeProvider>
    )
  },
  progress: {
    color: '#000',
  }
})