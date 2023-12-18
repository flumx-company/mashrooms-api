import { UseGuards, applyDecorators } from "@nestjs/common";
import { EPermission } from "src/modules/core-module/users/enums/permissions";
import { ERole } from "src/modules/core-module/users/enums/roles";
import { Roles } from "./roles.decorator";
import { Permission } from "./permission.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { JwtStrategy } from "src/modules/core-module/jwt.strategy";
import { PermissionGuard } from "../guards/permission.guard";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";

type auth = { roles: ERole[]; permission: EPermission };

export function Auth({ roles, permission }: Partial<auth>) {
  return applyDecorators(
    Roles(roles),
    Permission(permission),
    UseGuards(JwtStrategy, RolesGuard, PermissionGuard),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
