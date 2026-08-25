using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Data;
using TaskManagementApp.Api.Dtos;
using TaskManagementApp.Api.Enums;
using TaskManagementApp.Api.Models;
using TaskManagementApp.Api.Services;

namespace TaskManagementApp.Tests;

public class TaskServiceTests
{
    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetAllTasksAsync_ReturnsOnlyUserTasks_WhenRoleIsNotAdmin()
    {
        await using var context = CreateInMemoryDbContext();
        var user1Id = Guid.NewGuid();
        var user2Id = Guid.NewGuid();

        context.Tasks.AddRange(
            new TaskItem { Id = Guid.NewGuid(), Title = "User 1 Task", UserId = user1Id },
            new TaskItem { Id = Guid.NewGuid(), Title = "User 2 Task", UserId = user2Id }
        );
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.GetAllTasksAsync(user1Id, "User");

        Assert.Single(result);
        Assert.Equal("User 1 Task", result.First().Title);
    }

    [Fact]
    public async Task GetAllTasksAsync_ReturnsAllTasks_WhenRoleIsAdmin()
    {
        await using var context = CreateInMemoryDbContext();
        var user1Id = Guid.NewGuid();
        var user2Id = Guid.NewGuid();

        context.Tasks.AddRange(
            new TaskItem { Id = Guid.NewGuid(), Title = "Task 1", UserId = user1Id },
            new TaskItem { Id = Guid.NewGuid(), Title = "Task 2", UserId = user2Id }
        );
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.GetAllTasksAsync(user1Id, "Admin");

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsNull_WhenUserDoesNotOwnTaskAndNotAdmin()
    {
        await using var context = CreateInMemoryDbContext();
        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem { Id = taskId, Title = "Private Task", UserId = ownerId });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.GetTaskByIdAsync(taskId, otherUserId, "User");

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateTaskAsync_AddsTaskToDatabase_WithPendingStatus()
    {
        await using var context = CreateInMemoryDbContext();
        var service = new TaskService(context);
        var userId = Guid.NewGuid();

        var dto = new CreateTaskDto
        {
            Title = "New Unit Test Task",
            Description = "Testing EF In-Memory",
            Priority = Priority.High,
            DueDate = DateTime.UtcNow.AddDays(2)
        };

        var created = await service.CreateTaskAsync(dto, userId);

        Assert.NotNull(created);
        Assert.Equal(Status.Pending, created.Status);
        Assert.Equal(userId, created.UserId);

        var dbTask = await context.Tasks.FirstOrDefaultAsync(t => t.Id == created.Id);
        Assert.NotNull(dbTask);
        Assert.Equal("New Unit Test Task", dbTask.Title);
    }

    [Fact]
    public async Task UpdateTaskAsync_UpdatesTaskProperties_WhenTaskExists()
    {
        await using var context = CreateInMemoryDbContext();
        var userId = Guid.NewGuid();
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem
        {
            Id = taskId,
            Title = "Old Title",
            Description = "Old Description",
            Status = Status.Pending,
            Priority = Priority.Low,
            UserId = userId
        });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var updateDto = new UpdateTaskDto
        {
            Title = "Updated Title",
            Description = "Updated Description",
            Status = Status.Completed,
            Priority = Priority.High
        };

        var updated = await service.UpdateTaskAsync(taskId, updateDto, userId);

        Assert.NotNull(updated);
        Assert.Equal("Updated Title", updated.Title);
        Assert.Equal(Status.Completed, updated.Status);
        Assert.Equal(Priority.High, updated.Priority);
    }

    [Fact]
    public async Task DeleteTaskAsync_ReturnsFalse_WhenUserDoesNotOwnTaskAndNotAdmin()
    {
        await using var context = CreateInMemoryDbContext();
        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem { Id = taskId, Title = "Owner's Task", UserId = ownerId });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.DeleteTaskAsync(taskId, otherUserId, "User");

        Assert.False(result);
        Assert.Equal(1, await context.Tasks.CountAsync());
    }

    [Fact]
    public async Task DeleteTaskAsync_ReturnsTrue_WhenAdminDeletesAnotherUsersTask()
    {
        await using var context = CreateInMemoryDbContext();
        var ownerId = Guid.NewGuid();
        var adminId = Guid.NewGuid();
        var taskId = Guid.NewGuid();

        context.Tasks.Add(new TaskItem { Id = taskId, Title = "User's Task", UserId = ownerId });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.DeleteTaskAsync(taskId, adminId, "Admin");

        Assert.True(result);
        Assert.Equal(0, await context.Tasks.CountAsync());
    }
}