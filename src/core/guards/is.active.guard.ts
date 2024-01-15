import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class IsActiveGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Deactivated',
        "The user's account is not active.",
      )
    }

    return user.isActive
  }
}
