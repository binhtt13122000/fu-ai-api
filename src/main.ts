import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ServiceAccount } from "firebase-admin";
import * as firebase from "firebase-admin";
import firebase_admin_config from "src/keys/firebase_admin_sdk.json";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // implement firebase
  if (!firebase.apps.length) {
    firebase.initializeApp({
      credential: firebase.credential.cert(
        <ServiceAccount>firebase_admin_config,
      ),
    });
  }
}
bootstrap();
