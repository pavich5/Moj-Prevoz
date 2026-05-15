using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Services.Implementations
{
    public class ApiKeyValidator : IApiKeyValidator
    {
        private readonly string _storedPrivateKey;
        private readonly byte[] _encryptionKey;
        private readonly byte[] _iv;
        private readonly string _apiKeyToValidate;

        public ApiKeyValidator(IConfiguration configuration)
        {
            _storedPrivateKey = configuration["AppSettings:EncryptedApiKey"];
            _encryptionKey = Convert.FromBase64String(configuration["AppSettings:EncryptionApiKey"]);
            _iv = Convert.FromBase64String(configuration["AppSettings:EncryptionIV"]);
            _apiKeyToValidate = configuration["AppSettings:ApiKeyToValidate"];

            if (string.IsNullOrEmpty(_storedPrivateKey) || _encryptionKey == null || _iv == null || string.IsNullOrEmpty(_apiKeyToValidate))
                throw new ArgumentNullException("AppSettings configuration values are missing or invalid.");
        }

        public bool ValidateApiKey(string encryptedKey)
        {
            try
            {
                string decryptedKey = DecryptKey(encryptedKey);
                return decryptedKey == _apiKeyToValidate;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during API key validation: {ex.Message}");
                return false;
            }
        }

        private string DecryptKey(string encryptedKey)
        {
            byte[] cipherTextBytes = Convert.FromBase64String(encryptedKey);

            using (Aes aes = Aes.Create())
            {
                aes.Key = _encryptionKey;
                aes.IV = _iv;
                aes.Padding = PaddingMode.PKCS7;

                using (MemoryStream ms = new MemoryStream(cipherTextBytes))
                using (CryptoStream cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read))
                using (StreamReader reader = new StreamReader(cs))
                {
                    return reader.ReadToEnd();
                }
            }
        }
    }
}
