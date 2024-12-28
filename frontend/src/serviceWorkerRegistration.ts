type Config = {
    ready?: (registration: ServiceWorkerRegistration) => void;
    registered?: (registration: ServiceWorkerRegistration) => void;
    cached?: (registration: ServiceWorkerRegistration) => void;
    updatefound?: (registration: ServiceWorkerRegistration) => void;
    updated?: (registration: ServiceWorkerRegistration) => void;
    offline?: () => void;
    error?: (error: Error) => void;
  };
  
  export function register(config?: Config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        navigator.serviceWorker
          .register(swUrl)
          .then(registration => {
            // eslint-disable-next-line no-param-reassign
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // At this point, the updated precached content has been fetched,
                    // but the previous service worker will still serve the older
                    // content until all client tabs are closed.
                    console.log(
                      'New content is available and will be used when all ' +
                        'tabs for this page are closed. See https://cra.link/PWA.'
                    );
  
                    // Execute callback
                    if (config && config.updated) {
                      config.updated(registration);
                    }
                  } else {
                    // At this point, everything has been precached.
                    // It's the perfect time to display a
                    // "Content is cached for offline use." message.
                    console.log('Content is cached for offline use.');
  
                    // Execute callback
                    if (config && config.cached) {
                      config.cached(registration);
                    }
                  }
                }
              };
            };
          })
          .catch(error => {
            console.error('Error during service worker registration:', error);
          });
      });
    }
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.unregister();
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }