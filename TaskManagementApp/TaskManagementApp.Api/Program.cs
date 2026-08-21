using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManagementApp.Api.Data;
using TaskManagementApp.Api.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add Serilog logger
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/taskapp_log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ----------------------

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<JwtTokenGenerator>();
builder.Services.AddScoped<ITaskService, TaskService>();

// Add CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// ----------------------

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            
            ValidateLifetime = true,
            
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]!)
            ),
            ValidateIssuerSigningKey = true
        };
    });

// ----------------------

var app = builder.Build();

// ----------------------

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

// ----------------------

// Middleware MUST be placed right before app.UseCors or app.MapControllers in Program.cs
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        // Log the exception using Serilog
        Log.Error(exception, "An unhandled exception occurred during request execution.");

        await context.Response.WriteAsJsonAsync(new
        {
            message = "An unexpected error occurred. Please try again later.",
            details = exception?.Message // Remove in strict production environments if needed
        });
    });
});

// ----------------------

// MUST be placed before UseAuthentication and MapControllers
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// ----------------------

app.MapControllers();

try
{
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}