import AUTHORIZE from './authenticate';
import GET_FILES from './drive';

const fileId: string = '1kVhipG5toxecytfgJexRX_4ssvz6XldW';

AUTHORIZE()
  .then((authClient) => GET_FILES(authClient, fileId))
  .catch(console.error);



