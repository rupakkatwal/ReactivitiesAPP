using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;
using Persistence;
using FluentValidation.AspNetCore;
using Domain;
using Microsoft.AspNetCore.Identity;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Application.Interfaces;
using Infrastructure.Security;
using Infrastructure.Photos;
using API.SignalR;
using Microsoft.Extensions.DependencyInjection.Extensions;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt =>{
    var policy =  new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})
.AddFluentValidation(
    config => {
        config.RegisterValidatorsFromAssemblyContaining<Create>();
    }
);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options =>
  options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors( opt =>{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithOrigins("http://localhost:3000");
    });

});
builder.Services.AddMediatR(typeof(List.Handler).Assembly);
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddIdentityCore<AppUser>( opt => {
    opt.Password.RequireNonAlphanumeric =  false;

})
.AddEntityFrameworkStores<DataContext>()
.AddSignInManager<SignInManager<AppUser>>();
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Super secret Kay"));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>{
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey =  true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false
        };
        opt.Events =  new JwtBearerEvents
        {
            OnMessageReceived =  context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path =  context.HttpContext.Request.Path;
                if(!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                {
                    context.Token =  accessToken;
                }
                return Task.CompletedTask;
            }
        };
    } );

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IUserAccessor, UserAccessor>();

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("IsActivityHost", policy=>{
        policy.Requirements.Add(new IsHostRequirement());
    });
});
builder.Services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddScoped<IPhotoAccessor, PhotoAccessor>();
builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddSignalR();


var app = builder.Build();

 app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseDeveloperExceptionPage();
}

using(var scope =  app.Services.CreateScope())
{
    var services  = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        context.Database.EnsureCreated();  
        await Seed.SeedData(context,userManager);
    }
    catch (Exception ex)
    {
        var logger  = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occured during migration of database");
    }
    

}
app.UseRouting();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index","Fallback");
app.MapControllers();

app.Run();
