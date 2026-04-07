(function () {
  "use strict";

  // =========================
  // CONFIG (from URL params)
  // =========================
  function getParam(name, defaultValue) {
    try {
      const url = new URL(document.currentScript.src);
      return url.searchParams.get(name) || defaultValue;
    } catch {
      return defaultValue;
    }
  }

  const COMMAND = getParam("cmd", "DEFAULT");

  // =========================
  // HELPERS
  // =========================
  function clean(text) {
    return (text || "")
      .replace(/\s+/g, " ")
      .replace(/\|/g, "/")
      .trim();
  }

  function toast(msg, color) {
    const el = document.createElement("div");
    el.textContent = msg;

    el.style = `
      position:fixed;
      top:20px;
      right:20px;
      z-index:999999;
      padding:12px 16px;
      border-radius:8px;
      color:white;
      font:13px Arial;
      background:${color};
      box-shadow:0 4px 12px rgba(0,0,0,.3);
    `;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  // =========================
  // DATA EXTRACTION
  // =========================
  function getName() {
    const h1 = document.querySelector("h1");
    if (h1) return clean(h1.innerText);

    const title = document.title.split("|")[0];
    return clean(title.split("-")[0]);
  }

  function getProfileUrl() {
    return location.href.split("?")[0];
  }

  function getLocation() {
    const el = document.querySelector(".text-body-small");
    return el ? clean(el.innerText) : "";
  }

  function getCompanyAndTitle() {
    let company = "";
    let title = "";

    const exp = document.querySelector('[id*="experience"]');
    if (exp) {
      const lines = exp.innerText.split("\n").map(clean);
      title = lines[0] || "";
      company = lines[1] || "";
    }

    return { company, title };
  }

  // =========================
  // MAIN
  // =========================
  try {
    if (!location.href.includes("linkedin.com/in/")) {
      toast("Not a LinkedIn profile", "red");
      return;
    }

    const name = getName();
    const url = getProfileUrl();
    const location = getLocation();
    const job = getCompanyAndTitle();

    const payload = [
      COMMAND,
      url,
      name,
      job.company,
      job.title,
      location
    ]
      .map(clean)
      .join("|");

    navigator.clipboard.writeText(payload);

    toast("Copied ✔", "green");

    console.log("LinkedIn Export:", payload);

  } catch (e) {
    console.error(e);
    toast("Error ❌", "red");
  }
})();
