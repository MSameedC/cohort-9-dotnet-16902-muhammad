using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Models;

namespace TaskManagementApp.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
}