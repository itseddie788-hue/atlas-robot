import { RobotFace } from "./RobotFace";
import { useAtlas } from "@/lib/atlas-store";

/** Persistent Atlas face, pinned to the corner on every page. */
export function AtlasCorner() {
  const { face, settings } = useAtlas();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <RobotFace expression={face} size={72} faceStyle={settings.faceStyle} showLabel={false} />
    </div>
  );
}
