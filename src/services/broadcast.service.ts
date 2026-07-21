import type { GroupMetadata } from "@whiskeysockets/baileys";

import type { BroadcastMessage } from "../types/broadcast-message.js";

import logger from "../config/logger.js";
import { getSocket } from "../whatsapp.js";

export async function broadcast(
  targets: GroupMetadata[],
  message: BroadcastMessage,
): Promise<void> {
  const socket = getSocket();

  logger.info({
    event: "broadcast.started",
    type: message.type,
    total: targets.length,
  });

  for (const group of targets) {
    try {
      await socket.sendMessage(group.id, message.content);

      logger.info({
        event: "broadcast.success",
        group: group.subject,
      });
    } catch (error) {
      logger.error(error, `Failed to send to ${group.subject}`);
    }
  }

  logger.info({
    event: "broadcast.finished",
  });
}
