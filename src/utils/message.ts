import { downloadMediaMessage, getContentType } from "@whiskeysockets/baileys";
import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import type { BroadcastMessage } from "../types/broadcast-message.js";
import logger from "../config/logger.js";

export async function extractBroadcastMessage(
  socket: WASocket,
  message: WAMessage,
): Promise<BroadcastMessage | null> {
  const msg = message.message;

  if (!msg) {
    return null;
  }

  const type = getContentType(msg);

  switch (type) {
    case "conversation": {
      const text = msg.conversation;

      if (!text) {
        return null;
      }

      return extractConversation(text);
    }

    case "extendedTextMessage": {
      const text = msg.extendedTextMessage?.text;

      if (!text) {
        return null;
      }

      return extractExtendedText(text);
    }

    case "imageMessage":
      return extractImage(socket, message);

    case "videoMessage":
      return extractVideo(socket, message);

    case "documentMessage":
      return extractDocument(socket, message);

    case "audioMessage":
      return extractAudio(socket, message);

    case "stickerMessage":
      return extractSticker(socket, message);

    default:
      return null;
  }
}

function extractConversation(text: string): BroadcastMessage {
  return {
    type: "text",
    content: {
      text,
    },
  };
}

function extractExtendedText(text: string): BroadcastMessage {
  return {
    type: "text",
    content: {
      text,
    },
  };
}

async function extractImage(
  socket: WASocket,
  message: WAMessage,
): Promise<BroadcastMessage> {
  const image = message.message!.imageMessage!;

  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    {
      logger,
      reuploadRequest: socket.updateMediaMessage,
    },
  );

  return {
    type: "image",
    content: {
      image: buffer,
      caption: image.caption ?? undefined,
      mimetype: image.mimetype ?? undefined,
    },
  };
}

async function extractVideo(
  socket: WASocket,
  message: WAMessage,
): Promise<BroadcastMessage> {
  const video = message.message!.videoMessage!;

  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    {
      logger,
      reuploadRequest: socket.updateMediaMessage,
    },
  );

  return {
    type: "video",
    content: {
      video: buffer,
      caption: video.caption ?? undefined,
      mimetype: video.mimetype ?? undefined,
      gifPlayback: video.gifPlayback ?? false,
    },
  };
}

async function extractDocument(
  socket: WASocket,
  message: WAMessage,
): Promise<BroadcastMessage> {
  const document = message.message!.documentMessage!;

  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    {
      logger,
      reuploadRequest: socket.updateMediaMessage,
    },
  );

  return {
    type: "document",
    content: {
      document: buffer,
      mimetype: document.mimetype ?? "",
      fileName: document.fileName ?? undefined,
    },
  };
}

async function extractAudio(
  socket: WASocket,
  message: WAMessage,
): Promise<BroadcastMessage> {
  const audio = message.message!.audioMessage!;

  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    {
      logger,
      reuploadRequest: socket.updateMediaMessage,
    },
  );

  return {
    type: "audio",
    content: {
      audio: buffer,
      mimetype: audio.mimetype ?? undefined,
      ptt: audio.ptt ?? false,
    },
  };
}

async function extractSticker(
  socket: WASocket,
  message: WAMessage,
): Promise<BroadcastMessage> {
  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    {
      logger,
      reuploadRequest: socket.updateMediaMessage,
    },
  );

  return {
    type: "sticker",
    content: {
      sticker: buffer,
    },
  };
}
