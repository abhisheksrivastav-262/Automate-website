import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/landing/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#F4B400", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      Loading Auto Ads Solution…
    </div>
  );
}
