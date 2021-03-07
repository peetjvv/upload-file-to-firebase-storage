// https://stackoverflow.com/questions/60922198/firebase-storage-upload-image-file-from-node-js

import admin from 'firebase-admin';
import { uuid } from 'uuidv4';

// TODO: set these as command line args
const serviceAccount = require('path/to/serviceAccountKey.json');
const storageBucketUrl = '<BUCKET_NAME>.appspot.com';
const filename = 'path/to/image.png';
const contentType = 'image/png';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucketUrl.replace(/^gs:\/\//g, ''), // remove gs:// at the beginning of the url
});

const bucket = admin.storage().bucket();

const uploadFile = async () => {
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: uuid(),
    },
    contentType,
    cacheControl: 'public, max-age=600000000', // about 7d
  };

  // Uploads a local file to the bucket
  return await bucket.upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata,
  });
};

uploadFile()
  .then(response => console.log(`${filename} uploaded.`, response))
  .catch(err => console.error(`failed to upload ${filename}`, err));
