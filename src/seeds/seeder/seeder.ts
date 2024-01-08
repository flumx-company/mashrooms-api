import { Injectable, Logger } from '@nestjs/common'

import { UserSeederService } from '@mush/seeds/users/user.service'

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly userSeederService: UserSeederService,
  ) {}

  async seed() {
    await this.users()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding users...')
        Promise.resolve(completed)
      })
      .catch((error) => {
        this.logger.error('Failed seeding users...')
        Promise.reject(error)
      })
  }

  async users() {
    try {
      const userOrNullList = await Promise.all(this.userSeederService.create())
      const userListItemNumber = userOrNullList.filter(
        (nullValueOrCreatedUser) => nullValueOrCreatedUser,
      ).length

      this.logger.debug(`No. of users created : ${userListItemNumber}`)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
