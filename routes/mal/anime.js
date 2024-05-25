const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/anime', async (req, res) => {
    const url = "https://myanimelist.net/animelist/EsieEyen/load.json?offset=0&order=5&status=7";

    var activityLabels = {
        1: "Watching",
        2: "Completed",
        3: "On-hold",
        4: "Dropped",
        6: "Plan-to-watch"
    };

    try {
        const response = await axios.get(url);
        
        if (response.status === 200) {
            const animeList = response.data.slice(0, 15);

            const formattedAnimeList = animeList.map(anime => {
                let image = anime.anime_image_path;
                image = image.replace("/r/192x272", "");
                const modifiedImageParts = image.split(".");
                if (modifiedImageParts.length > 1) {
                    image = modifiedImageParts.slice(0, -1).join(".") + "l." + modifiedImageParts.slice(-1);
                }

                const title = anime.anime_title_eng || anime.anime_title;
                const link = "https://myanimelist.net" + anime.anime_url;
                const activity = activityLabels[anime.status] || "Unknown";
                const rating = anime.score;

                return {
                    image,
                    title,
                    link,
                    activity,
                    rating
                };
            });

            res.json(formattedAnimeList);
        } else {
            res.status(500).json({ error: "Failed to retrieve the webpage" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve the webpage" });
    }
});

module.exports = router;