import { CommandFactory } from 'nest-commander'
import 'module-alias/register'

import { AppModule } from '@modules/app.module'

async function bootstrap() {
  await CommandFactory.run(AppModule, ['warn', 'error', 'debug', 'log'])
}
bootstrap()
