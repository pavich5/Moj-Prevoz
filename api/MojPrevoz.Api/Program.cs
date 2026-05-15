using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MojPrevoz.Helpers;
using System.Text.Json.Serialization;
using MojPrevoz.DTOs;
using MojPrevoz.Middlewares;
using MojPrevoz.Services;
using MojPrevoz.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllersWithViews()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Configure AppSettings before building the app
var appSettingsSection = builder.Configuration.GetSection("AppSettings");
builder.Services.Configure<TwilioSettings>(builder.Configuration.GetSection("Twilio"));
builder.Services.Configure<AppSettings>(appSettingsSection);
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
AppSettings appSettings = appSettingsSection.Get<AppSettings>() ?? new AppSettings();

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection") ??
    appSettings.ConnectionString;

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("A database connection string must be provided.");
}

if (string.IsNullOrWhiteSpace(appSettings.Secret))
{
    throw new InvalidOperationException("AppSettings:Secret must be configured.");
}

// Add DbContext, Repositories, and Services
builder.Services.InjectDbContext(connectionString);
builder.Services.InjectRepositories();
builder.Services.InjectServices();

//builder.Services.AddSignalR();


builder.Services.AddControllers();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JWT Authentication
var key = Encoding.ASCII.GetBytes(appSettings.Secret);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    //options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Configure CORS to allow specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policyBuilder =>
        {
            policyBuilder.WithOrigins("http://localhost:8081") // Add more allowed origins if needed
                         .AllowAnyMethod()
                         .AllowAnyHeader()
                         .AllowCredentials(); // Allow credentials like cookies or authentication headers
        });
});

var app = builder.Build();

// Enable WebSockets
app.UseWebSockets();

app.MapGet("/", () => "MojPrevoz API is running.");

// WebSocket Handler
app.Use(async (context, next) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();

        // Resolve HandleWebSocket service from DI container
        var handleWebSocketService = context.RequestServices.GetRequiredService<HandleWebSocket>();

        // Use the HandleWebSocket service's method
        await handleWebSocketService.HandleWebSocketAsync(webSocket);
        return;
    }

    await next();
});


// Middleware to handle token blocklist
app.UseMiddleware<TokenBlocklistMiddleware>();

// Configure the HTTP request pipeline for development and production
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MojPrevoz API V1");
        c.DocumentTitle = "MojPrevoz API";
    });
}
else
{
    // Serve Swagger in production
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MojPrevoz API V1");
        c.DocumentTitle = "MojPrevoz API";
        c.RoutePrefix = string.Empty; // Swagger will be available at the root ("/")
    });
}

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Apply CORS policy
app.UseCors("AllowSpecificOrigin");

// Ensure proper routing and authentication
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
