import { UseGuards, applyDecorators } from "@nestjs/common";
import { EPermission } from "../enums/permissions";
import { ERole } from "../enums/roles";
import { Roles } from "./roles.decorator";
import { Permission } from "./permission.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { JwtStrategy } from "src/modules/core-module/jwt.strategy";
import { PermissionGuard } from "../guards/permission.guard";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";
import { IsActiveGuard } from "../guards/is.active.guard";

type auth = { roles: ERole[]; permission: EPermission };

export function Auth({ roles, permission }: Partial<auth>) {
  return applyDecorators(
    Roles(roles),
    Permission(permission),
    UseGuards(JwtStrategy, IsActiveGuard, RolesGuard, PermissionGuard),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
