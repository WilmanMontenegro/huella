import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { Certification } from "@/types";

const ICON_MAP: Record<Certification["type"], string> = {
  organic: "verified",
  fairtrade: "handshake",
  rainforest: "park",
};

interface CertificationsProps {
  items: Certification[];
}

export function Certifications({ items }: CertificationsProps) {
  return (
    <section className="flex flex-wrap justify-center gap-6 border-y border-outline-variant/30 py-8">
      {items.map((cert) => (
        <div key={cert.id} className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-primary-container">
            <MaterialIcon name={ICON_MAP[cert.type]} className="text-3xl" />
          </div>
          <span className="text-center font-body text-label-sm text-on-surface-variant">
            {cert.label.split(" ").map((word, i, arr) => (
              <span key={i}>
                {word}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        </div>
      ))}
    </section>
  );
}
