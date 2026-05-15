using Google.Cloud.Storage.V1;

namespace MojPrevoz.Services.Implementations
{
    public class FirebaseStorageService
    {
        private readonly StorageClient _storageClient;
        private readonly string _bucketName = "ubermacedonia-b0278.appspot.com"; // Replace with your actual bucket name

        public FirebaseStorageService()
        {
            // Initialize the StorageClient with the service account credentials
            //_storageClient = StorageClient.Create(GoogleCredential.FromFile("C:\\Users\\Dragan\\Downloads\\ubermacedonia-b0278-firebase-adminsdk-9flb2-9f6d1776d7.json.json"));
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
        {
            // Upload the file to the specified bucket
            var bucket = _bucketName;
            var fileObject = await _storageClient.UploadObjectAsync(bucket, fileName, null, fileStream);

            // Return the URL of the uploaded file
            return $"https://storage.googleapis.com/{bucket}/{fileObject.Name}";
        }
    }
}
