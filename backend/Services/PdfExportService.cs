using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SchoolSwedishAPI.Models;

namespace SchoolSwedishAPI.Services;

public class PdfExportService
{
    public byte[] GenerateCoursePdf(Course course)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header()
                    .AlignCenter()
                    .Text("Курс: " + course.Title)
                    .SemiBold().FontSize(24).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        column.Item().Text("Описание: " + (course.Description ?? "Нет описания"));
                        column.Item().Text("Уровень: " + course.Level);
                        column.Item().Text("Цена: " + course.Price + " руб.");
                        column.Item().Text("Продолжительность: " + course.DurationHours + " часов");
                        column.Item().Text("Максимум студентов: " + (course.MaxStudents ?? 0));

                        if (course.Teacher != null)
                        {
                            column.Item().Text("Преподаватель: " + course.Teacher.FirstName + " " + course.Teacher.LastName);
                            column.Item().Text("Email преподавателя: " + course.Teacher.Email);
                        }

                        column.Item().Text("Дата создания: " + course.CreatedAt?.ToString("dd.MM.yyyy"));
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Страница ");
                        x.CurrentPageNumber();
                        x.Span(" из ");
                        x.TotalPages();
                    });
            });
        }).GeneratePdf();
    }

    public byte[] GenerateCoursesListPdf(List<Course> courses)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);

                page.Header()
                    .AlignCenter()
                    .Text("Каталог курсов")
                    .SemiBold().FontSize(24).FontColor(Colors.Blue.Medium);

                page.Content()
                    .Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(30);
                            columns.RelativeColumn(3);
                            columns.RelativeColumn();
                            columns.ConstantColumn(60);
                            columns.ConstantColumn(50);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("№").Bold();
                            header.Cell().Text("Название").Bold();
                            header.Cell().Text("Уровень").Bold();
                            header.Cell().Text("Цена").Bold();
                            header.Cell().Text("Часы").Bold();
                        });

                        for (int i = 0; i < courses.Count; i++)
                        {
                            var course = courses[i];
                            var rowNumber = i + 1;

                            table.Cell().Text(rowNumber.ToString());
                            table.Cell().Text(course.Title);
                            table.Cell().Text(course.Level);
                            table.Cell().Text(course.Price + " руб.");
                            table.Cell().Text(course.DurationHours.ToString());
                        }
                    });
            });
        }).GeneratePdf();
    }
}