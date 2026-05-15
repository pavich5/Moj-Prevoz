using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MojPrevoz.DataAccess.Migrations
{
    public partial class IsThemeWhiteAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsThemeWhite",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsThemeWhite",
                table: "Users");
        }
    }
}
