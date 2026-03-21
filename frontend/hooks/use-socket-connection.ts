"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";

/**
 * Tracks Socket.io connection state for UI indicators (offline / reconnecting).
 */
export function useSocketConnection() {
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const hadConnectRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      hadConnectRef.current = true;
      setConnected(true);
      setReconnecting(false);
    };
    const onDisconnect = () => {
      setConnected(false);
      if (hadConnectRef.current) setReconnecting(true);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const manager = socket.io;
    const onReconnectAttempt = () => setReconnecting(true);
    const onReconnect = () => {
      setConnected(true);
      setReconnecting(false);
    };

    manager.on("reconnect_attempt", onReconnectAttempt);
    manager.on("reconnect", onReconnect);

    if (socket.connected) {
      hadConnectRef.current = true;
      setConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      manager.off("reconnect_attempt", onReconnectAttempt);
      manager.off("reconnect", onReconnect);
    };
  }, []);

  return { connected, reconnecting };
}
