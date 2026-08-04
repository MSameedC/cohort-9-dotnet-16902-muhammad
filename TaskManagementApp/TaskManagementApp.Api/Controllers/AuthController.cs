using Microsoft.AspNetCore.Mvc;
using TaskManagementApp.Api.Data;
using TaskManagementApp.Api.Dtos;
using TaskManagementApp.Api.Models;

namespace TaskManagementApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ApplicationDbContext context) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            // Basic Validation
            if (context.Users.Any(u => u.Email == dto.Email))
            {
                return BadRequest("Email already in use");
            }

            if (context.Users.Any(u => u.Username == dto.Username))
            {
                return BadRequest("Username already in use");
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = dto.Password,
                Role = "User",
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully!", user = user.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
    
}