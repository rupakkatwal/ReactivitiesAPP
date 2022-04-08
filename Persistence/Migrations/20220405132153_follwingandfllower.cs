using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    public partial class follwingandfllower : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserFollowings",
                columns: table => new
                {
                    ObserverId = table.Column<string>(type: "TEXT", nullable: false),
                    TargetId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFollowings", x => new { x.ObserverId, x.TargetId });
                    table.ForeignKey(
                        name: "FK_UserFollowings_AspNetUsers_ObserverId",
                        column: x => x.ObserverId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFollowings_AspNetUsers_TargetId",
                        column: x => x.TargetId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFollowingUserFollowing",
                columns: table => new
                {
                    FollowersObserverId = table.Column<string>(type: "TEXT", nullable: false),
                    FollowersTargetId = table.Column<string>(type: "TEXT", nullable: false),
                    FollowingsObserverId = table.Column<string>(type: "TEXT", nullable: false),
                    FollowingsTargetId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFollowingUserFollowing", x => new { x.FollowersObserverId, x.FollowersTargetId, x.FollowingsObserverId, x.FollowingsTargetId });
                    table.ForeignKey(
                        name: "FK_UserFollowingUserFollowing_UserFollowings_FollowersObserverId_FollowersTargetId",
                        columns: x => new { x.FollowersObserverId, x.FollowersTargetId },
                        principalTable: "UserFollowings",
                        principalColumns: new[] { "ObserverId", "TargetId" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFollowingUserFollowing_UserFollowings_FollowingsObserverId_FollowingsTargetId",
                        columns: x => new { x.FollowingsObserverId, x.FollowingsTargetId },
                        principalTable: "UserFollowings",
                        principalColumns: new[] { "ObserverId", "TargetId" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserFollowings_TargetId",
                table: "UserFollowings",
                column: "TargetId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFollowingUserFollowing_FollowingsObserverId_FollowingsTargetId",
                table: "UserFollowingUserFollowing",
                columns: new[] { "FollowingsObserverId", "FollowingsTargetId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserFollowingUserFollowing");

            migrationBuilder.DropTable(
                name: "UserFollowings");
        }
    }
}
