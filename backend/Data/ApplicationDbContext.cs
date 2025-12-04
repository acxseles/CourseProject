using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using SchoolSwedishAPI.Models;

namespace SchoolSwedishAPI.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Assignment> Assignments { get; set; }

    public virtual DbSet<CalendarSession> CalendarSessions { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Enrollment> Enrollments { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<SessionBooking> SessionBookings { get; set; }

    public virtual DbSet<SpecialCourse> SpecialCourses { get; set; }

    public virtual DbSet<Studentassignment> Studentassignments { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=school_swedish;user=root;password=root", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.44-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("answers");

            entity.HasIndex(e => e.QuestionId, "QuestionId_idx");

            entity.Property(e => e.IsCorrect).HasDefaultValueSql("'0'");
            entity.Property(e => e.OrderIndex).HasDefaultValueSql("'0'");
            entity.Property(e => e.Text).HasMaxLength(500);

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .HasConstraintName("fk_answers_question");
        });

        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("assignments");

            entity.HasIndex(e => e.LessonId, "LessonId");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Deadline).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.MaxScore).HasDefaultValueSql("'100'");
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.Lesson).WithMany(p => p.Assignments)
                .HasForeignKey(d => d.LessonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("assignments_ibfk_1");
        });

        modelBuilder.Entity<CalendarSession>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("calendar_sessions");

            entity.HasIndex(e => e.SpecialCourseId, "fk_special_course_idx");

            entity.HasIndex(e => e.TeacherId, "fk_teacher_idx");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.EndTime).HasColumnType("time");
            entity.Property(e => e.IsBooked).HasDefaultValueSql("'0'");
            entity.Property(e => e.StartTime).HasColumnType("time");

            entity.HasOne(d => d.SpecialCourse).WithMany(p => p.CalendarSessions)
                .HasForeignKey(d => d.SpecialCourseId)
                .HasConstraintName("fk_special_course");

            entity.HasOne(d => d.Teacher).WithMany(p => p.CalendarSessions)
                .HasForeignKey(d => d.TeacherId)
                .HasConstraintName("fk_teacher");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("courses");

            entity.HasIndex(e => e.TeacherId, "TeacherId");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
            entity.Property(e => e.Level).HasColumnType("enum('Beginner','Intermediate','Advanced')");
            entity.Property(e => e.MaxStudents).HasDefaultValueSql("'30'");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasDefaultValueSql("'0.00'");
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.Teacher).WithMany(p => p.Courses)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("courses_ibfk_1");
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("enrollments");

            entity.HasIndex(e => e.CourseId, "CourseId");

            entity.HasIndex(e => new { e.StudentId, e.CourseId }, "unique_enrollment").IsUnique();

            entity.Property(e => e.EnrolledAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Grade).HasPrecision(5, 2);
            entity.Property(e => e.Progress)
                .HasPrecision(5, 2)
                .HasDefaultValueSql("'0.00'");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Active'")
                .HasColumnType("enum('Active','Completed','Dropped')");

            entity.HasOne(d => d.Course).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("fk_enrollments_course");

            entity.HasOne(d => d.Student).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("fk_enrollments_student");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("lessons");

            entity.HasIndex(e => e.CourseId, "CourseId1");

            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.VideoUrl).HasMaxLength(500);

            entity.HasOne(d => d.Course).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("lessons_ibfk_1");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("questions");

            entity.HasIndex(e => e.AssignmentId, "AssignmentId_idx");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.QuestionType)
                .HasDefaultValueSql("'MultipleChoice'")
                .HasColumnType("enum('MultipleChoice','TrueFalse','Text')");
            entity.Property(e => e.Text).HasMaxLength(500);

            entity.HasOne(d => d.Assignment).WithMany(p => p.Questions)
                .HasForeignKey(d => d.AssignmentId)
                .HasConstraintName("fk_questions_assignment");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("reports");

            entity.HasIndex(e => e.TeacherId, "TeacherId1");

            entity.Property(e => e.Data).HasColumnType("json");
            entity.Property(e => e.GeneratedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.ReportType).HasColumnType("enum('Progress','Grades','Attendance')");
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.Teacher).WithMany(p => p.Reports)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("reports_ibfk_1");
        });

        modelBuilder.Entity<SessionBooking>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("session_bookings");

            entity.HasIndex(e => e.SessionId, "fk_session_idx");

            entity.HasIndex(e => e.StudentId, "fk_student_idx");

            entity.HasIndex(e => new { e.SessionId, e.StudentId }, "unique_booking").IsUnique();

            entity.Property(e => e.BookedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Notes).HasColumnType("text");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Booked'")
                .HasColumnType("enum('Booked','Completed','Cancelled')");

            entity.HasOne(d => d.Session).WithMany(p => p.SessionBookings)
                .HasForeignKey(d => d.SessionId)
                .HasConstraintName("fk_session");

            entity.HasOne(d => d.Student).WithMany(p => p.SessionBookings)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("fk_booking_student");
        });

        modelBuilder.Entity<SpecialCourse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("special_courses");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.DurationMinutes).HasDefaultValueSql("'60'");
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
            entity.Property(e => e.MaxParticipants).HasDefaultValueSql("'5'");
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.Title).HasMaxLength(255);
        });

        modelBuilder.Entity<Studentassignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("studentassignments");

            entity.HasIndex(e => e.AssignmentId, "AssignmentId");

            entity.HasIndex(e => e.StudentId, "StudentId");

            entity.Property(e => e.Feedback).HasColumnType("text");
            entity.Property(e => e.FileUrl).HasMaxLength(500);
            entity.Property(e => e.Score).HasPrecision(5, 2);
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Assignment).WithMany(p => p.Studentassignments)
                .HasForeignKey(d => d.AssignmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("studentassignments_ibfk_2");

            entity.HasOne(d => d.Student).WithMany(p => p.Studentassignments)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("studentassignments_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValueSql("'1'");
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Role)
                .HasDefaultValueSql("'Student'")
                .HasColumnType("enum('Student','Teacher','Admin')");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
