import { createWriteStream } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { finished } from "node:stream/promises";
import PDFDocument from "pdfkit";

const resume = JSON.parse(await readFile(new URL("../src/data/resume.json", import.meta.url), "utf8"));
const destination = new URL("../public/cv/", import.meta.url);
await mkdir(destination, { recursive: true });

for (const language of ["pt", "en"]) {
  const copy = resume[language];
  const document = new PDFDocument({
    size: "A4",
    margin: 42,
    bufferPages: true,
    lang: language === "pt" ? "pt-BR" : "en",
    info: { Title: `${resume.name} | ${copy.role}`, Author: resume.name },
  });
  const output = createWriteStream(new URL(`werik-santos-${language}.pdf`, destination));
  document.pipe(output);

  const paragraph = (text, options = {}) => {
    document.font("Helvetica").fontSize(9.5).fillColor("#27272a").text(text, { lineGap: 2, ...options });
  };
  const section = (title) => {
    document.moveDown(0.8);
    document.font("Helvetica-Bold").fontSize(9).fillColor("#18181b").text(title, { characterSpacing: 1.1 });
    document.moveDown(0.45);
  };

  document.font("Helvetica-Bold").fontSize(25).fillColor("#09090b").text(resume.name);
  document.moveDown(0.2);
  document.font("Helvetica").fontSize(11).text(copy.role);
  document.moveDown(0.35);
  paragraph(`${copy.location} | ${resume.email}`, { link: `mailto:${resume.email}` });
  section(copy.summaryHeading);
  paragraph(copy.summary);
  section(copy.skillsHeading);
  paragraph(copy.skills);
  section(copy.experienceHeading);
  document.font("Helvetica-Bold").fontSize(10).text(copy.experienceTitle);
  paragraph(copy.experiencePeriod);
  document.moveDown(0.25);
  copy.experience.forEach((item) => { paragraph(`• ${item}`); document.moveDown(0.2); });
  section(copy.projectsHeading);
  copy.projects.forEach((project) => {
    document.font("Helvetica-Bold").fontSize(10).fillColor("#18181b").text(project.title, { link: project.url, underline: true });
    document.moveDown(0.2);
    paragraph(project.text);
    document.moveDown(0.45);
  });
  section(copy.educationHeading);
  copy.education.forEach((item) => paragraph(item));
  section(copy.linksHeading);
  paragraph(resume.github, { link: resume.github, underline: true });
  paragraph(resume.linkedin, { link: resume.linkedin, underline: true });

  const pageCount = document.bufferedPageRange().count;
  document.end();
  await finished(output);
  if (pageCount !== 1) throw new Error(`The ${language} résumé overflowed: ${pageCount} pages. Review the layout.`);
  console.log(`Generated public/cv/werik-santos-${language}.pdf (${pageCount} page)`);
}
