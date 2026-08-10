using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Models;

namespace TaskManagementApp.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<TaskItem> Tasks { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<TaskItem>().HasOne(x => x.User).WithMany(t => t.Tasks).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}