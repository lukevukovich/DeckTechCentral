using DTC.App.Helper;
using DTC.Model;
using DTC.Service;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

var services = builder.Services;
{
    services.AddControllers();
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();

    services.Configure<SecretKey>(configuration.GetSection("AppSettings"));

    services.AddScoped<IUserService, UserService>()
            .AddScoped<IDeckService, DeckService>();
}

// services.AddAuthentication().AddGoogle(googleOptions =>
//     {
//         googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
//         googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
//     });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseMiddleware<JwtMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();