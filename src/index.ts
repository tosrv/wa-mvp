import "dotenv/config";

import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";
import { startWhatsApp } from "./whatsapp.js";

app.listen(env.PORT, () => {
  logger.info(`HTTP Server started on port ${env.PORT}`);
});

startWhatsApp().catch((error) => {
  logger.error(error, "Failed to start WhatsApp");
});
