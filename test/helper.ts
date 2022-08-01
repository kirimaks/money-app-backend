import Fastify from 'fastify'

import fp from 'fastify-plugin';
import {app as App} from '../src/app';
import {getAppConfig} from '../src/config';

import type * as tap from 'tap';

export type Test = typeof tap['Test']['prototype'];


async function buildApp (t: Test, config:AppConfig) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  // void app.register(fp(App), await config())
  void app.register(fp(App), config)

  await app.ready();

  // Tear down our app after we are done
  t.teardown(() => void app.close())

  return app
}

export {buildApp, getAppConfig}
