using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Build Application
var app = builder.Build();

app.MapControllers();
app.Run();