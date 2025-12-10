import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 던담 기본 URL
const BASE_URL = "https://dundam.xyz/character?server=";

/**
 * 특정 캐릭터(server + key) HTML 가져오기
 */
async function fetchCharacterHTML(server, key) {
  const url = `${BASE_URL}${server}&key=${key}`;
  const html = await fetch(url).then((r) => r.text());
  return html;
}

/**
 * 던담 기본 데이터 파싱
 */
function parseNuxtData(html) {
  const match = html.match(/window\.__NUXT__=(.*?);<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/**
 * 전투력 가져오기
 * /character/:server/:key/combat
 */
app.get("/character/:server/:key/combat", async (req, res) => {
  try {
    const { server, key } = req.params;

    const html = await fetchCharacterHTML(server, key);
    const data
