import ICAL from "ical.js";
import { addDays, format } from "date-fns";
import { getLocale } from "../i18n";
import React from "react";
import { TZDate } from "@date-fns/tz";

const upcomingEvents = async () => {
  const returnEvents: {
    startDate: TZDate;
    summary?: string;
    location?: string;
  }[] = [];

  const icalUrl =
    "https://vc1.brainfact.de/nextcloud/remote.php/dav/public-calendars/LqyiwT8aRjkbLako/?export";

  const response = await fetch(icalUrl);

  if (response.ok) {
    const text = await response.text();

    const jcalData = ICAL.parse(text);

    const comp = new ICAL.Component(jcalData);
    const vevent = comp.getAllSubcomponents("vevent");

    const rangeStart = ICAL.Time.fromDateString(new Date().toISOString());
    const rangeEnd = ICAL.Time.fromDateString(
      addDays(new Date(), 14).toISOString()
    );

    for (const v of vevent) {
      const dtstart = v.getFirstPropertyValue("dtstart");

      if (!dtstart) {
        continue;
      }

      const expand = new ICAL.RecurExpansion({
        component: v,
        // @ts-expect-error Should usually be string, so this is fine
        dtstart,
      });

      for (
        let next = expand.next();
        next && next.compare(rangeEnd) < 0;
        next = expand.next()
      ) {
        if (next.compare(rangeStart) < 0) {
          continue;
        }

        returnEvents.push({
          summary: v.getFirstPropertyValue("summary")?.toString(),
          location: v.getFirstPropertyValue("location")?.toString(),
          startDate: new TZDate(
            expand.last.toJSDate(),
            expand.last.zone.toString()
          ),
        });
      }
    }
  }

  return returnEvents;
};

const Events = ({
  events,
  lang,
}: {
  events: {
    startDate: TZDate;
    summary?: string;
    location?: string;
  }[];
  lang: string;
}) => {
  if (!events.length) {
    return null;
  }

  return (
    <div>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <div>
              {format(event.startDate, "Pp", {
                locale: getLocale(lang),
              })}
            </div>
            <div>
              {event.summary} {event.location && ` (${event.location})`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const paramsAwaited = await params;
  const events = await upcomingEvents();

  const awaitedParams = await params;

  const EventComponent = <Events events={events} lang={paramsAwaited.lang} />;

  const lastChange = new TZDate(2024, 10, 5);

  if (awaitedParams.lang === "de") {
    return <HomeDe events={EventComponent} lastChange={lastChange} />;
  } else {
    return <HomeEn events={EventComponent} lastChange={lastChange} />;
  }
}

const HomeDe = ({
  events,
  lastChange,
}: {
  events: JSX.Element;
  lastChange: TZDate;
}) => {
  return (
    <div className="prose dark:prose-invert">
      <div className="text-center">
        <em>
          Letzte Änderung:{" "}
          {format(lastChange, "P", { locale: getLocale("de") })}
        </em>
      </div>

      <p>
        Der Chaostreff Osnabrück e.V. ist eine lockere Gruppe von Leuten mit
        Interesse in den Bereichen Sicherheit, Kryptografie, alternative
        Betriebssysteme, freie (libre) Software, Netzpolitik und vielen weiteren
        Themen.
      </p>

      <p>
        Interessierte sind bei unseren regelmäßigen Treffen jederzeit herzlich
        willkommen.
      </p>

      <dl>
        <dt>Regelmäßige Treffen</dt>
        <dd>
          Jeden zweiten Donnerstag treffen wir uns um 19:00 Uhr im{" "}
          <a
            href="https://www.openstreetmap.org/?mlat=52.27274&mlon=8.04577#map=19/52.27274/8.04577"
            rel="noreferer"
            target="_blank"
          >
            AStA der Universität Osnabrück, Alte Münze 12, 49074 Osnabrück
          </a>{" "}
          in unserem Hackspace Rabbithole.
        </dd>

        <dt>Kalender</dt>
        <dd>
          Alle Termine der nächsten Monate können online angesehen, als
          iCalendar abonniert oder als .ics-Datei heruntergeladen werden:{" "}
          <a
            href="https://vc1.brainfact.de/nextcloud/apps/calendar/p/LqyiwT8aRjkbLako"
            rel="noreferer"
            target="_blank"
          >
            zu unserem Kalender
          </a>
          .
        </dd>

        {events}

        <dt>E-Mail</dt>
        <dd>
          <ul>
            <li>
              <a href="mailto:info@chaostreff-osnabrueck.de">Kontakt</a>
            </li>
            <li>
              <a href="mailto:presse@chaostreff-osnabrueck.de">
                Presseanfragen
              </a>
            </li>
          </ul>
        </dd>

        <dt>Öffentlicher Chatraum</dt>
        <dd>
          <ul>
            <li>
              Besucher sind willkommen beim{" "}
              <a
                href="xmpp:public@conference.jabber.chaostreff-osnabrueck.de?join"
                rel="noreferer"
                target="_blank"
              >
                öffentlichen Jabber-MUC
              </a>
              .
            </li>
            <li>
              Der{" "}
              <a
                href="https://matrix.to/#/#public_ctreffos:matrix.drpetervoigt.de"
                rel="noreferer"
                target="_blank"
              >
                öffentliche Matrix-Raum
              </a>{" "}
              wird mit dem öffentlichen Jabber-MUC bidirektional gespiegelt.
            </li>
          </ul>
        </dd>

        <dt>Mailingliste</dt>
        <dd>
          Für einen ausführlicheren Austausch zu unterschiedlichen Themen steht{" "}
          <a
            href="https://listserv.chaostreff-osnabrueck.de/sympa/arc/ctreffos-public/2023-02/msg00000.html"
            rel="noreferer"
            target="_blank"
          >
            unsere öffentliche Mailingliste
          </a>{" "}
          zur Verfügung.
        </dd>

        <dt>Soziale Medien</dt>
        <dd>
          <ul>
            <li>
              Fediverse (Mastodon):{" "}
              <a
                href="https://chaos.social/@chaostreff_osnabrueck"
                rel="me"
                target="_blank"
              >
                @chaostreff_osnabrueck
              </a>
            </li>
            <li>
              X (ehemals Twitter):{" "}
              <a
                href="https://twitter.com/ctreffos"
                rel="noreferer"
                target="_blank"
              >
                @ctreffos
              </a>
            </li>
          </ul>
        </dd>

        <dt>Projekte</dt>
        <dd>
          <ul>
            <li>
              <a href="pm-mastodon.html">
                Pressemitteilung: Eröffnung osna.social
              </a>
            </li>
            <li>
              <a href="chaostalks.html">chaOStalks</a>
            </li>
            <li>
              <a href="chaos-colloquia.html">Chaos Colloquia</a>
            </li>
            {/* <!--
		<li><a href="https://codingchaos.chaostreff-osnabrueck.de/">codingchaOS</a></li>
		--> */}
            <li>
              <a href="downloads/offenerBrief_offeneDaten.pdf">
                Stellungnahme zur Informationsfreiheitssatzung
              </a>
            </li>
            <li>
              <a
                href="https://niedersachsentrojaner.de/"
                rel="noreferer"
                target="_blank"
              >
                #noNPOG Bündnis
              </a>
            </li>
            <li>
              <a href="downloads/brief_kontaktnachverfolgungsapps.pdf">
                Offener Brief Corona-Kontaktnachverfolgungs-Apps
              </a>
            </li>
          </ul>
        </dd>

        <dt>GitHub</dt>
        <dd>
          <a href="https://github.com/CTreffOS" rel="noreferer" target="_blank">
            github.com/CTreffOS
          </a>
        </dd>
      </dl>
    </div>
  );
};

const HomeEn = ({
  events,
  lastChange,
}: {
  events: JSX.Element;
  lastChange: TZDate;
}) => {
  return (
    <div className="prose dark:prose-invert">
      <div className="text-center">
        <em>
          Last amended: {format(lastChange, "P", { locale: getLocale("en") })}
        </em>
      </div>

      <p>
        The Chaostreff Osnabrück e.V. is a group of people interested in topics
        like security, cryptography, alternative operating systems, free (libre)
        software, internet related politics and what else comes to mind.
      </p>

      <p>
        People interested in our topics are welcome at our regular meetings.
      </p>

      <dl>
        <dt>Regular meetings</dt>
        <dd>
          Every second Thursday we meet at 7 pm at the{" "}
          <a
            href="https://www.openstreetmap.org/?mlat=52.27274&mlon=8.04577#map=19/52.27274/8.04577"
            rel="noreferer"
            target="_blank"
          >
            AStA of the University of Osnabrück, Alte Münze 12, 49074 Osnabrück
          </a>{" "}
          in our hackspace Rabbithole.
        </dd>

        <dt>Calendar</dt>
        <dd>
          All events of the next months can be viewed online, be subscribed to
          as iCalendar or be downloaded as .ics file:{" "}
          <a
            href="https://vc1.brainfact.de/nextcloud/apps/calendar/p/LqyiwT8aRjkbLako"
            rel="noreferer"
            target="_blank"
          >
            to our calendar
          </a>
          .
        </dd>

        {events}

        <dt>Email</dt>
        <dd>
          <ul>
            <li>
              <a href="mailto:info@chaostreff-osnabrueck.de">Contact</a>
            </li>
            <li>
              <a href="mailto:presse@chaostreff-osnabrueck.de">
                Press requests
              </a>
            </li>
          </ul>
        </dd>

        <dt>Public Chatroom</dt>
        <dd>
          <ul>
            <li>
              Visitors are welcome in the{" "}
              <a
                href="xmpp:public@conference.jabber.chaostreff-osnabrueck.de?join"
                rel="noreferer"
                target="_blank"
              >
                public Jabber MUC
              </a>
              .
            </li>
            <li>
              The{" "}
              <a
                href="https://matrix.to/#/#public_ctreffos:matrix.drpetervoigt.de"
                rel="noreferer"
                target="_blank"
              >
                public Matrix room
              </a>{" "}
              is bidirectionally mirrored with the public Jabber MUC.
            </li>
          </ul>
        </dd>

        <dt>Mailing list</dt>
        <dd>
          For more detailed discussions about different topics we offer{" "}
          <a
            href="https://listserv.chaostreff-osnabrueck.de/sympa/arc/ctreffos-public/2023-02/msg00000.html"
            rel="noreferer"
            target="_blank"
          >
            our public mailinglist
          </a>
          .
        </dd>

        <dt>Social Media</dt>
        <dd>
          <ul>
            <li>
              Fediverse (Mastodon):{" "}
              <a
                href="https://chaos.social/@chaostreff_osnabrueck"
                rel="me"
                target="_blank"
              >
                @chaostreff_osnabrueck
              </a>
            </li>
            <li>
              X (formerly Twitter):{" "}
              <a
                href="https://twitter.com/ctreffos"
                rel="noreferer"
                target="_blank"
              >
                @ctreffos
              </a>
            </li>
          </ul>
        </dd>

        <dt>Projects</dt>
        <dd>
          <ul>
            <li>
              <a href="pm-mastodon.html">
                Press release: Opening of osna.social (German)
              </a>
            </li>
            <li>
              <a href="chaostalks-en.html">chaOStalks</a>
            </li>
            <li>
              <a href="chaos-colloquia-en.html">Chaos Colloquia</a>
            </li>
            {/* <!--
			<li><a href="https://codingchaos.chaostreff-osnabrueck.de">codingchaOS</a></li>
		--> */}
            <li>
              <a href="downloads/offenerBrief_offeneDaten.pdf">
                Statement on the statute of the freedom of information (German)
              </a>
            </li>
            <li>
              <a
                href="https://niedersachsentrojaner.de/"
                rel="noreferer"
                target="_blank"
              >
                #noNPOG Bündnis (German)
              </a>
            </li>
            <li>
              <a href="downloads/brief_kontaktnachverfolgungsapps.pdf">
                Open letter Covid contact tracing apps (German)
              </a>
            </li>
          </ul>
        </dd>

        <dt>GitHub</dt>
        <dd>
          <a href="https://github.com/CTreffOS" rel="noreferer" target="_blank">
            github.com/CTreffOS
          </a>
        </dd>
      </dl>
    </div>
  );
};
