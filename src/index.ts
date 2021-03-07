import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';

const args = process.argv;
console.log(args);
const serviceAccount = args[2]; // e.g. 'path/to/serviceAccountKey.json'
const storageBucketUrl = args[3]; // e.g. '<BUCKET_NAME>.appspot.com'
const filename = args[4]; // e.g. 'path/to/image.png'
const contentType = args[5]; // e.g. 'image/png'

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
  .then(() => console.log(`'${filename}' uploaded successfully`))
  .catch(err => console.error(`failed to upload '${filename}'`, err));
