using Microsoft.OpenApi.Models;

using MyKanban.Api;
using MyKanban.Application;
using MyKanban.Application.Common;
using MyKanban.Domain;
using MyKanban.Infrastructure;

var appInfo = new OpenApiInfo
{
    Title = "MyKanban",
    Version = "v1",
    Contact = new OpenApiContact
    {
        Name = "Rain Hu",
        Email = "intervalrain@gmail.com"
    },
    Description = "A custom task management page with .Net React in Clean Architecture",
};

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", appInfo));

    builder.Services.AddSingleton<IRepository<Board>, InMemoryRepository<Board>>();
    builder.Services.AddSingleton<IRepository<Mission>, InMemoryRepository<Mission>>();
    builder.Services.AddScoped<IKanbanService, KanbanService>();
    //builder.Services.AddSingleton<IKanbanService, MockKanbanService>();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAllOrigins",
            builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
    });
}

var app = builder.Build();
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyKanban v1"));

    app.UseHttpsRedirection();
    app.UseCors("AllowAllOrigins");
    app.MapControllers();
    app.Run();
}