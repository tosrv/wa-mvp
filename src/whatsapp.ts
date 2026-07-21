import {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import type { WASocket } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import { setGroups, getGroupCount } from "./cache/groups.js";
import logger from "./config/logger.js";
import { env } from "./config/env.js";
import pino from "pino";
import { handleMessagesUpsert } from "./events/message.handler.js";

let socket: WASocket | null = null;

export async function startWhatsApp(): Promise<void> {
  const { state, saveCreds } = await useMultiFileAuthState(env.AUTH_FOLDER);

  const wa = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
  });

  socket = wa;

  wa.ev.on("creds.update", saveCreds);
  wa.ev.on("messages.upsert", handleMessagesUpsert);
  wa.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      logger.info("QR Code generated.");

      qrcode.generate(qr, {
        small: true,
      });
    }

    if (connection === "open") {
      logger.info("WhatsApp connected.");

      try {
        const groups = await wa.groupFetchAllParticipating();

        setGroups(groups);

        logger.info(`Loaded ${getGroupCount()} groups.`);
      } catch (error) {
        logger.error(error, "Failed to load group cache.");
      }
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;

      logger.warn("WhatsApp disconnected.");

      if (shouldReconnect) {
        logger.info("Reconnecting in 5 seconds...");

        setTimeout(() => {
          startWhatsApp().catch((error) => {
            logger.error(error, "Reconnect failed.");
          });
        }, 5000);
      } else {
        logger.error("Logged out. Delete auth folder and login again.");
      }
    }
  });
}

export function getSocket(): WASocket {
  if (!socket) {
    throw new Error("WhatsApp socket not initialized.");
  }

  return socket;
}
