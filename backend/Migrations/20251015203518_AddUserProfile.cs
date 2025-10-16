using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Customers_CustomerId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Comments",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CustomerId",
                table: "Comments",
                newName: "CustomerID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Comments",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "Texto",
                table: "Comments",
                newName: "Comment");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                newName: "IX_Comments_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_CustomerId",
                table: "Comments",
                newName: "IX_Comments_CustomerID");

            migrationBuilder.AddColumn<int>(
                name: "Perfil",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Comment",
                table: "Comments",
                type: "BLOB",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Customers_CustomerID",
                table: "Comments",
                column: "CustomerID",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_UserID",
                table: "Comments",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Customers_CustomerID",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_UserID",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "Perfil",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Comments",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "CustomerID",
                table: "Comments",
                newName: "CustomerId");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Comments",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Comment",
                table: "Comments",
                newName: "Texto");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_UserID",
                table: "Comments",
                newName: "IX_Comments_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_CustomerID",
                table: "Comments",
                newName: "IX_Comments_CustomerId");

            migrationBuilder.AlterColumn<string>(
                name: "Texto",
                table: "Comments",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "BLOB");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Customers_CustomerId",
                table: "Comments",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
