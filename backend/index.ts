import AUTHORIZE from './authenticate';
import  startServer from './controller/server'



// Initialize authorization then start server
AUTHORIZE()
  .then(() => {
    console.log('Authorization successful.')
    startServer();
  })
  .catch(error => {
    console.error('Authorization failed:', error);
  });




