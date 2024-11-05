using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeInOpenHours3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FridayHours",
                table: "Offices",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MondayHours",
                table: "Offices",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SaturdayHours",
                table: "Offices",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SundayHours",
                table: "Offices",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ThursdayHours",
                table: "Offices",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TuesdayHours",
                table: "Offices",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "WednesdayHours",
                table: "Offices",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FridayHours",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "MondayHours",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "SaturdayHours",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "SundayHours",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "ThursdayHours",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "TuesdayHours",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "WednesdayHours",
                table: "Offices");
        }
    }
}
