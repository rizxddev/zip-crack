// pages/api/zip-crack.js
import unzipper from "unzipper";
import formidable from "formidable-serverless";
import fs from "fs";

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function* generatePasswords(length, charset) {
  if (length === 0) yield "";
  else {
    for (const c of charset) {
      for (const suffix of generatePasswords(length - 1, charset)) {
        yield c + suffix;
      }
    }
  }
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err || !files.zipfile) {
      return res.status(400).json({ error: "File upload error" });
    }
    const zipFilePath = files.zipfile.filepath;
    let found = null;
    let tested = 0;
    const maxLen = 3; // Max 3 karakter demi limit serverless

    outer: for (let len = 1; len <= maxLen; len++) {
      for (const password of generatePasswords(len, charset)) {
        tested++;
        try {
          // Cek password
          await fs.createReadStream(zipFilePath)
            .pipe(unzipper.Parse({ password }))
            .on("entry", (entry) => entry.autodrain())
            .promise();
          found = password;
          break outer;
        } catch (e) {
          // Password salah, lanjut
        }
      }
    }

    // Hapus file temp
    fs.unlinkSync(zipFilePath);

    if (found) {
      return res.json({ password: found, tested });
    } else {
      return res.json({ password: null, tested });
    }
  });
}
