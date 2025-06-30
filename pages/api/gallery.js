import fs from "fs";
import path from "path";
import formidable from "formidable";

// Disable body parsing untuk FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

const dataFile = path.join(process.cwd(), "data", "gallery.json");
const imagesDir = path.join(process.cwd(), "public", "images");

// Helper: baca JSON
const readData = () => {
  const fileData = fs.readFileSync(dataFile);
  return JSON.parse(fileData);
};

// Helper: tulis JSON
const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// Handler utama
export default async function handler(req, res) {
  const gallery = readData();

  switch (req.method) {
    case "GET":
      return res.status(200).json(gallery);

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
          title: title.toString(),
          url: imageUrl,
          description: description?.toString() || "",
          maps_url: maps_url?.toString() || "",
        };

        gallery.push(newItem);
        writeData(gallery);

        return res.status(201).json(newItem);
      });
      break;
    }

    case "PUT": {
      const form = new formidable.IncomingForm({
        uploadDir: imagesDir,
        keepExtensions: true,
      });

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Edit error:", err);
          return res.status(500).json({ message: "Edit error" });
        }

        const { id, title, description, maps_url, url } = fields;
        const file = files.file;

        if (!id) {
          return res.status(400).json({ message: "ID is required" });
        }

        const index = gallery.findIndex((item) => item.id === id);
        if (index === -1) {
          return res.status(404).json({ message: "Item not found" });
        }

        let newUrl = url?.toString() || gallery[index].url;
        if (file) {
          const filename = path.basename(file.filepath);
          newUrl = `/images/${filename}`;
        }

        gallery[index] = {
          ...gallery[index],
          title: title?.toString() || gallery[index].title,
          url: newUrl,
          description: description?.toString() ?? gallery[index].description,
          maps_url: maps_url?.toString() ?? gallery[index].maps_url,
        };

        writeData(gallery);
        return res.status(200).json(gallery[index]);
      });
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

      return res.status(200).json({
        message: "Deleted successfully",
        deleted: deleted[0],
      });
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
