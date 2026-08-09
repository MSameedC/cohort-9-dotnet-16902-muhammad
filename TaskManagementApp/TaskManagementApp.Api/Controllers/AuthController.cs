using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Data;
using TaskManagementApp.Api.Dtos;
using TaskManagementApp.Api.Models;
using TaskManagementApp.Api.Services;

namespace TaskManagementApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ApplicationDbContext context, JwtTokenGenerator jwtTokenGenerator) : ControllerBase
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
            
            var passwordHasher = new PasswordHasher<User>();
            var hashedPassword = passwordHasher.HashPassword(null!, dto.Password);
            
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "User",
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully!", userId = user.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            // 1. Find user by username
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
            
            // 2. Verify the Password hash
            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
            
            // 3. Generate and return JWT token here
            var userToken = jwtTokenGenerator.GenerateToken(user);
            
            return Ok(new { message = "Login successful!", token = userToken, userId = user.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }
}