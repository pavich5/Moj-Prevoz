namespace MojPrevoz.Helpers
{
    public class AppSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string BackupConnectionString { get; set; } = string.Empty;
        public string Secret { get; set; } = string.Empty;
    }
}
