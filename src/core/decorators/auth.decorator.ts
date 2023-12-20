import { UseGuards, applyDecorators } from "@nestjs/common";
import { EPermission } from "src/modules/core-module/users/enums/permissions";
import { ERole } from "src/modules/core-module/users/enums/roles";
import { Role } from "./role.decorator";
import { Permission } from "./permission.decorator";
import { RoleGuard } from "../guards/role.guard";
import { JwtStrategy } from "src/modules/core-module/jwt.strategy";
import { PermissionGuard } from "../guards/permission.guard";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";

type auth = { role: ERole; permission: EPermission };

export function Auth({ role, permission }: Partial<auth>) {
  return applyDecorators(
    Role(role),
    Permission(permission),
    UseGuards(JwtStrategy, RoleGuard, PermissionGuard),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
