import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "gallery.json");

// Helper untuk membaca data
const readData = () => {
  const fileData = fs.readFileSync(dataFile);
  return JSON.parse(fileData);
};

// Helper untuk menulis data
const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  if (req.method === "GET") {
    const gallery = readData();
    res.status(200).json(gallery);
  } else if (req.method === "POST") {
    const { title, url, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    const gallery = readData();
    const newItem = {
      id: Date.now().toString(),
      title,
      url,
      description: description || "",
    };

    gallery.push(newItem);
    writeData(gallery);

    res.status(201).json(newItem);
  } else if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: "ID is required" });

    const gallery = readData();
    const updated = gallery.filter((item) => item.id !== id);
    writeData(updated);

    res.status(200).json({ message: "Deleted successfully" });
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
