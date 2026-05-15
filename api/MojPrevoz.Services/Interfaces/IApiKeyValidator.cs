namespace MojPrevoz.Services.Interfaces
{
    public interface IApiKeyValidator
    {
        bool ValidateApiKey(string encryptedKey);
    }
}
