const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/manga', async (req, res) => {
    const url = "https://myanimelist.net/mangalist/EsieEyen/load.json?offset=0&order=5&status=7";
    var mangaMediaTypes = ["Manga", "Manhwa", "Manhua"];

    const activityLabels = {
        1: "Reading",
        2: "Completed",
        3: "On-hold",
        4: "Dropped",
        6: "Plan-to-read"
    };

    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const mangaList = response.data;

            const mangaListFiltered = mangaList.filter(manga => mangaMediaTypes.includes(manga.manga_media_type_string)).slice(0, 14);

            const formattedMangaList = mangaListFiltered.map(manga => {
                let image = manga.manga_image_path;
                image = image.replace("/r/192x272", "");
                const modifiedImageParts = image.split(".");
                if (modifiedImageParts.length > 1) {
                    image = modifiedImageParts.slice(0, -1).join(".") + "l." + modifiedImageParts.slice(-1);
                }

                const title = manga.manga_title_eng || manga.manga_title;
                const link = "https://myanimelist.net" + manga.manga_url;
                const activity = activityLabels[manga.status] || "Unknown";
                const rating = manga.score;

                return {
                    image,
                    title,
                    link,
                    activity,
                    rating
                };
            });

            res.json(formattedMangaList);
        } else {
            res.status(500).json({ error: "Failed to retrieve the webpage" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve the webpage" });
    }
});

module.exports = router;