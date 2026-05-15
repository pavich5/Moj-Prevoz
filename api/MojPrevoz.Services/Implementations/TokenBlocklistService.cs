namespace MojPrevoz.Services.Implementations
{
    public class TokenBlocklistService
    {
        private readonly HashSet<string> _blockedTokens = new HashSet<string>();

        // Adds the token to the blocklist
        public void BlockToken(string token)
        {
            _blockedTokens.Add(token);
        }

        // Checks if the token is blocked
        public bool IsTokenBlocked(string token)
        {
            return _blockedTokens.Contains(token);
        }
    }
}
