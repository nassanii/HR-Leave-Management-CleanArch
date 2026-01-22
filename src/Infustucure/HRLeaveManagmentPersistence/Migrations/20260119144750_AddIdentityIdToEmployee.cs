using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HRLeaveManagmentPersistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentityIdToEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Removed incorrect DropTable calls for Identity tables


            migrationBuilder.AddColumn<string>(
                name: "IdentityId",
                table: "Employees",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "DateCreated",
                value: new DateTime(2026, 1, 19, 14, 47, 50, 135, DateTimeKind.Utc).AddTicks(1430));

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "DateCreated",
                value: new DateTime(2026, 1, 19, 14, 47, 50, 135, DateTimeKind.Utc).AddTicks(1440));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdentityId",
                table: "Employees");

            // Removed incorrect CreateTable calls for Identity tables
        }
    }
}
