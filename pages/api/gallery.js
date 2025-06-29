import fs from "fs";
import path from "path";
import formidable from "formidable";

// Nonaktifkan bodyParser bawaan Next.js untuk handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

const dataFile = path.join(process.cwd(), "data", "gallery.json");
const imagesDir = path.join(process.cwd(), "public", "images");

const readData = () => {
  const fileData = fs.readFileSync(dataFile);
  return JSON.parse(fileData);
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

export default async function handler(req, res) {
  const gallery = readData();

  switch (req.method) {
    case "GET":
      res.status(200).json(gallery);
      break;

    case "POST": {
      const form = new formidable.IncomingForm({
        uploadDir: imagesDir,
        keepExtensions: true,
      });

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: "Upload error" });
        }

        const { title, description, maps_url } = fields;
        const file = files.file;

        if (!file || !title) {
          return res
            .status(400)
            .json({ message: "Title and image are required" });
        }

        const filename = path.basename(file.filepath);
        const imageUrl = `/images/${filename}`;

        const newItem = {
          id: Date.now().toString(),
          title,
          url: imageUrl,
          description: description || "",
          maps_url: maps_url || "",
        };

        gallery.push(newItem);
        writeData(gallery);

        res.status(201).json(newItem);
      });
      break;
    }

    case "PUT": {
      const { id, title, url, description, maps_url } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      const index = gallery.findIndex((item) => item.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Item not found" });
      }

      gallery[index] = {
        ...gallery[index],
        title: title || gallery[index].title,
        url: url || gallery[index].url,
        description: description ?? gallery[index].description,
        maps_url: maps_url ?? gallery[index].maps_url,
      };

      writeData(gallery);
      res.status(200).json(gallery[index]);
      break;
    }

    case "DELETE": {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "ID is required" });

      const index = gallery.findIndex((item) => item.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Item not found" });
      }

      const deleted = gallery.splice(index, 1);
      writeData(gallery);
      res
        .status(200)
        .json({ message: "Deleted successfully", deleted: deleted[0] });
      break;
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
