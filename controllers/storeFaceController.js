import fs from "fs";
import path from "path";
// import tf from "@tensorflow/tfjs-node";
import faceapi from "face-api.js";
import { Canvas, Image } from "canvas";
import QRCode from "qrcode";
import { fileURLToPath } from "url";

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const storeFace = async (req, res) => {
  //setup face-api.js
  faceapi.env.monkeyPatch({ Canvas, Image });

  const MODEL_PATH = path.join(__dirname, "../face_api_config/models");
  async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  }
  loadModels();

  

  if(!image){}
};
