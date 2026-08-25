using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagementApp.Api.Controllers;
using TaskManagementApp.Api.Dtos;
using TaskManagementApp.Api.Enums;
using TaskManagementApp.Api.Services;

namespace TaskManagementApp.Tests;

public class TaskControllerTests
{
    private readonly Mock<ITaskService> _mockTaskService;
    private readonly TaskController _controller;
    private readonly Guid _testUserId = Guid.NewGuid();

    public TaskControllerTests()
    {
        _mockTaskService = new Mock<ITaskService>();
        _controller = new TaskController(_mockTaskService.Object);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, _testUserId.ToString()),
            new(ClaimTypes.Role, "User")
        };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    [Fact]
    public async Task GetAllTasks_ReturnsOk_WithListOfTasks()
    {
        // Arrange
        var tasksList = new List<TaskResponseDto>
        {
            new() { Id = Guid.NewGuid(), Title = "Task 1", UserId = _testUserId },
            new() { Id = Guid.NewGuid(), Title = "Task 2", UserId = _testUserId }
        };

        _mockTaskService
            .Setup(s => s.GetAllTasksAsync(_testUserId, "User"))
            .ReturnsAsync(tasksList);

        // Act
        var result = await _controller.GetAllTasks();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedTasks = Assert.IsAssignableFrom<IEnumerable<TaskResponseDto>>(okResult.Value);
        Assert.Equal(2, returnedTasks.Count());
    }

    [Fact]
    public async Task GetTaskById_ReturnsOk_WhenTaskExists()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var sampleTask = new TaskResponseDto
        {
            Id = taskId,
            Title = "Test Task",
            Description = "Testing xUnit",
            Status = Status.Pending,
            Priority = Priority.Normal,
            DueDate = DateTime.UtcNow.AddDays(1),
            UserId = _testUserId
        };

        _mockTaskService
            .Setup(s => s.GetTaskByIdAsync(taskId, _testUserId, "User"))
            .ReturnsAsync(sampleTask);

        // Act
        var result = await _controller.GetTaskById(taskId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnTask = Assert.IsType<TaskResponseDto>(okResult.Value);
        Assert.Equal(taskId, returnTask.Id);
    }

    [Fact]
    public async Task GetTaskById_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        // Arrange
        var missingId = Guid.NewGuid();
        _mockTaskService
            .Setup(s => s.GetTaskByIdAsync(missingId, It.IsAny<Guid>(), It.IsAny<string>()))
            .ReturnsAsync((TaskResponseDto?)null);

        // Act
        var result = await _controller.GetTaskById(missingId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task CreateTask_ReturnsCreatedAtAction_WithCreatedTask()
    {
        // Arrange
        var createDto = new CreateTaskDto
        {
            Title = "New Task",
            Description = "Task Details",
            Priority = Priority.High
        };

        var createdResponse = new TaskResponseDto
        {
            Id = Guid.NewGuid(),
            Title = createDto.Title,
            Description = createDto.Description,
            Priority = createDto.Priority,
            UserId = _testUserId
        };

        _mockTaskService
            .Setup(s => s.CreateTaskAsync(createDto, _testUserId))
            .ReturnsAsync(createdResponse);

        // Act
        var result = await _controller.CreateTask(createDto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnTask = Assert.IsType<TaskResponseDto>(createdResult.Value);
        Assert.Equal(nameof(TaskController.GetTaskById), createdResult.ActionName);
        Assert.Equal(createdResponse.Id, returnTask.Id);
    }

    [Fact]
    public async Task CreateTask_Returns500InternalServerError_WhenExceptionThrown()
    {
        // Arrange
        var createDto = new CreateTaskDto { Title = "Buggy Task" };

        _mockTaskService
            .Setup(s => s.CreateTaskAsync(createDto, _testUserId))
            .ThrowsAsync(new Exception("Database connection failure"));

        // Act
        var result = await _controller.CreateTask(createDto);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(500, objectResult.StatusCode);
    }

    [Fact]
    public async Task UpdateTask_ReturnsOk_WhenUpdateSucceeds()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var updateDto = new UpdateTaskDto { Title = "Updated Title", Status = Status.Completed };
        var updatedResponse = new TaskResponseDto
        {
            Id = taskId,
            Title = updateDto.Title,
            Status = updateDto.Status,
            UserId = _testUserId
        };

        _mockTaskService
            .Setup(s => s.UpdateTaskAsync(taskId, updateDto, _testUserId))
            .ReturnsAsync(updatedResponse);

        // Act
        var result = await _controller.UpdateTask(taskId, updateDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnTask = Assert.IsType<TaskResponseDto>(okResult.Value);
        Assert.Equal("Updated Title", returnTask.Title);
    }

    [Fact]
    public async Task UpdateTask_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var updateDto = new UpdateTaskDto { Title = "Updated Title" };

        _mockTaskService
            .Setup(s => s.UpdateTaskAsync(taskId, updateDto, _testUserId))
            .ReturnsAsync((TaskResponseDto?)null);

        // Act
        var result = await _controller.UpdateTask(taskId, updateDto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task DeleteTask_ReturnsNoContent_WhenDeletionSucceeds()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        _mockTaskService
            .Setup(s => s.DeleteTaskAsync(taskId, _testUserId, "User"))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteTask(taskId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteTask_ReturnsNotFound_WhenDeletionFails()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        _mockTaskService
            .Setup(s => s.DeleteTaskAsync(taskId, _testUserId, "User"))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteTask(taskId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}