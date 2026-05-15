namespace MojPrevoz.Helpers
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using MojPrevoz.DataAccess.DataContext;
    using MojPrevoz.DataAccess.Implementations;
    using MojPrevoz.DataAccess.Interfaces;
    using MojPrevoz.Services.Implementations;
    using MojPrevoz.Services.Interfaces;

    public static class DependencyInjectionHelper
    {
        public static void InjectDbContext(this IServiceCollection services, string connectionString)
        {
            // Use the provided connection string
            services.AddDbContext<MojPrevozDbContext>(options =>
                options.UseMySql(
                    connectionString,
                    new MySqlServerVersion(new Version(10, 11, 9)) // Specify your MySQL version
                ));
        }

        public static void InjectRepositories(this IServiceCollection services)
        {
            services.AddTransient<IUsersRepository, UsersRepository>();
            services.AddTransient<IPostsRepository, PostsRepository>();
            services.AddTransient<IReviewsRepository, ReviewsRepository>();
        }

        public static void InjectServices(this IServiceCollection services)
        {
            // Register HttpClient
            services.AddHttpClient();

            services.AddTransient<IUsersService, UsersService>();
            services.AddTransient<IPostsService, PostsService>();
            services.AddTransient<IReviewsService, ReviewsService>();
            services.AddTransient<IMailService, MailService>();
            services.AddTransient<ITwilioService, TwilioService>();
            services.AddTransient<IApiKeyValidator, ApiKeyValidator>();
            services.AddTransient<FirebaseStorageService>();
            services.AddTransient<TokenBlocklistService>();
            services.AddTransient<HandleWebSocket>();
            services.AddTransient<ExpoSdkNotifications>();
        }
    }
}
