using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using TaskManagementApp.Api.Controllers;
using TaskManagementApp.Api.Models;
using TaskManagementApp.Api.Services;
using TaskManagementApp.Api.Enums;

namespace TaskManagementApp.Tests
{
    public class TaskControllerTests
    {
        private readonly Mock<ITaskService> _mockTaskService;
        private readonly TaskController _controller;

        public TaskControllerTests()
        {
            _mockTaskService = new Mock<ITaskService>();
            // Constructor only takes ITaskService
            _controller = new TaskController(_mockTaskService.Object);
        }

        [Fact]
        public async Task GetTaskById_ReturnsOk_WhenTaskExists()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var sampleTask = new TaskItem 
            { 
                Id = taskId, 
                Title = "Test Task", 
                Status = Status.Pending
            };

            _mockTaskService
                .Setup(s => s.GetTaskByIdAsync(taskId, userId, "User"))
                .ReturnsAsync(sampleTask);

            // Act
            var result = await _controller.GetTaskById(taskId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnTask = Assert.IsType<TaskItem>(okResult.Value);
            Assert.Equal(taskId, returnTask.Id);
        }

        [Fact]
        public async Task GetTaskById_ReturnsNotFound_WhenTaskDoesNotExist()
        {
            // Arrange
            var missingId = Guid.NewGuid();
            _mockTaskService
                .Setup(s => s.GetTaskByIdAsync(missingId, It.IsAny<Guid>(), It.IsAny<string>()))
                .ReturnsAsync((TaskItem)null!);

            // Act
            var result = await _controller.GetTaskById(missingId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}