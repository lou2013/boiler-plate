import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './common/config/app.config';
import { AppConfigs } from './constants/app.configs';
import * as basicAuth from 'express-basic-auth';
import { SwaggerConfig } from './common/config/swagger.config';
import {
  ParameterObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export async function swaggerBootstrap(app: INestApplication) {
  const appConfig = app
    .get<ConfigService>(ConfigService)
    .get<AppConfig>(AppConfigs.APP);

  const swaggerConfig = app
    .get<ConfigService>(ConfigService)
    .get<SwaggerConfig>(AppConfigs.SWAGGER);

  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [swaggerConfig.username]: swaggerConfig.password,
      },
    }),
  );

  const documents = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription(appConfig.description)
    .setVersion(appConfig.version)
    .addBearerAuth()
    .build();
  const document = fixSwaggerQuery(
    SwaggerModule.createDocument(app, documents),
  );
  SwaggerModule.setup('docs/index', app, document);
}

const fixSwaggerQuery = (document: OpenAPIObject): OpenAPIObject => {
  const distinctParams: (arr: any) => (ParameterObject | ReferenceObject)[] = (
    arr,
  ) =>
    [
      ...new Map(
        arr.map((item) => [item.in + item.name + item.$ref, item]),
      ).values(),
    ] as (ParameterObject | ReferenceObject)[];
  for (const path in document.paths || {}) {
    const pathObj = document.paths[path];
    const methodParams = [
      { key: 'get', params: pathObj.get?.parameters },
      { key: 'put', params: pathObj.put?.parameters },
      { key: 'post', params: pathObj.post?.parameters },
      { key: 'delete', params: pathObj.delete?.parameters },
      { key: 'options', params: pathObj.options?.parameters },
      { key: 'head', params: pathObj.head?.parameters },
      { key: 'patch', params: pathObj.patch?.parameters },
      { key: 'trace', params: pathObj.trace?.parameters },
    ];
    if (pathObj.parameters) {
      document.paths[path].parameters = distinctParams(
        document.paths[path].parameters,
      );
    }
    methodParams.forEach((x) => {
      if (x.params) {
        document.paths[path][x.key].parameters = distinctParams(x.params);
      }
    });
  }
  return document;
};
