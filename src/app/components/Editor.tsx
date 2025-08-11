"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ySyncPlugin, yCursorPlugin } from "y-prosemirror";

export default function Editor({ docId }: { docId: string }) {
  const ydoc = useRef(new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const wsProvider = new WebsocketProvider("wss://your-websocket-server", docId, ydoc.current);
    setProvider(wsProvider);

    wsProvider.on("status", (event) => {
      console.log(event.status); // connected/disconnected
    });

    return () => {
      wsProvider.disconnect();
      ydoc.current.destroy();
    };
  }, [docId]);

  const editor = useEditor({
    extensions: [StarterKit, ySyncPlugin(ydoc.current.getXmlFragment("prosemirror"))],
    content: "<p>Loading document...</p>",
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
