import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chaostreff Osnabrück e.V. - Chaos Colloquia",
  // TODO: Add description
  // description: "Generated by create next app",
};

export default async function ChaosColloquia({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const awaitedParams = await params;

  if (awaitedParams.lang === "de") {
    return <ChaosColloquiaDe />;
  } else {
    return <ChaosColloquiaEn />;
  }
}

const ChaosColloquiaDe = () => {
  metadata.title = "Chaostreff Osnabrück e.V. - Rechtliche Hinweise";
  return (
    <div className="prose dark:prose-invert">
      <h1>Chaos Colloquia</h1>

      <p>Die folgenden Talks sind nur in Englisch verfügbar.</p>

      <dl>
        <dt>Chaos Colloqium #1</dt>
        <dd>
          <em>on DNS privacy and security</em>- Dr. Roland van Rijswijk-Deij
          (University of Twente) - 2020-02-06 -{" "}
          <a href="downloads/chaos_colloquium_flyer_a4.pdf" target="_blank">
            zum Flyer
          </a>{" "}
          -{" "}
          <a
            href="https://media.ccc.de/v/chaoscolloquium-1-dns-privacy-security"
            rel="noreferer"
            target="_blank"
          >
            zum Video
          </a>
        </dd>
      </dl>
    </div>
  );
};

const ChaosColloquiaEn = () => {
  metadata.title = "Chaostreff Osnabrück e.V. - Legal Notice";
  return (
    <div className="prose dark:prose-invert">
      <h1>Chaos Colloquia</h1>

      <dl>
        <dt>Chaos Colloqium #1</dt>
        <dd>
          <em>on DNS privacy and security</em>- Dr. Roland van Rijswijk-Deij
          (University of Twente) - 2020-02-06 -{" "}
          <a href="downloads/chaos_colloquium_flyer_a4.pdf" target="_blank">
            View leaflet
          </a>{" "}
          -{" "}
          <a
            href="https://media.ccc.de/v/chaoscolloquium-1-dns-privacy-security"
            rel="noreferer"
            target="_blank"
          >
            Watch recording
          </a>
        </dd>
      </dl>
    </div>
  );
};