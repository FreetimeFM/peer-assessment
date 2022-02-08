import { S3 } from "aws-sdk"

// Setup connection to object storage service with credentials.
const store = new S3({
  accessKeyId: process.env.STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.STORAGE_SECRET_KEY,
  endpoint: process.env.STORAGE_ENDPOINT
});

// Uploads the specified object.
// key: The identifier of the object.
// object: The object itself.
export function upload(key, object) {

  store.putObject({
    Key: key,
    Body: object,
    Bucket: process.env.STORAGE_BUCKET_NAME,

  }, function (err, _data) {
    if (err) return {
      error: true,
      result: err
    }
    else return {
      error: false
    }
  });
}

