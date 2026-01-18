import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from "./app.config";
import databaseConfig from "./database.config";
import { validate } from "./env.validation";
import jwtConfig from "./jwt.config";

@Module({
    imports: [
        NestConfigModule.forRoot({
          // Global module
          isGlobal: true,
          
          // Load config files
          load: [appConfig, databaseConfig, jwtConfig],
          
          // Gunakan validate function (bukan validationSchema)
          validate,
          
          // Validation options (optional)
          validationOptions: {
            enableDebugMessages: process.env.NODE_ENV !== 'production',
          },
        }),
      ],
})
export class ConfigModule{}