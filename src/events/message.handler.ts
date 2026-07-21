import type { BaileysEventMap, WAMessage } from "@whiskeysockets/baileys";

import {
  getGroup,
  getChildGroups,
  isAnnouncementGroup,
} from "../cache/groups.js";
import { broadcast } from "../services/broadcast.service.js";
import { getSocket } from "../whatsapp.js";
import { extractBroadcastMessage } from "../utils/message.js";

export async function handleMessagesUpsert(
  event: BaileysEventMap["messages.upsert"],
): Promise<void> {
  if (event.type !== "notify") {
    return;
  }

  for (const message of event.messages) {
    await processMessage(message);
  }
}

async function processMessage(message: WAMessage): Promise<void> {
  const remoteJid = message.key.remoteJid;

  if (!remoteJid?.endsWith("@g.us")) {
    return;
  }

  if (!isAnnouncementGroup(remoteJid)) {
    return;
  }

  const announcement = getGroup(remoteJid);

  if (!announcement?.linkedParent) {
    return;
  }

  const targets = getChildGroups(announcement.linkedParent);

  const socket = getSocket();

  const broadcastMessage = await extractBroadcastMessage(socket, message);

  if (!broadcastMessage) {
    return;
  }

  await broadcast(targets, broadcastMessage);
}
