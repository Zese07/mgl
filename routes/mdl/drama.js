const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const url = "https://mydramalist.com/profile/EsieEyen";

const getDigitsFromUrl = (url) => {
    const match = url.match(/(\d+)/);
    return match ? match[0] : null;
};

const scrapeRating = async (ratingLink) => {
    try {
        const mainUrl = "https://mydramalist.com/dramalist/EsieEyen";
        const response = await axios.get(mainUrl);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            const trElement = $(`tr#${ratingLink}`);

            if (trElement.length) {
                const scoreElement = trElement.find('.score');

                if (scoreElement.length) {
                    const score = parseInt(scoreElement.text().trim(), 10);
                    return score;
                } else {
                    const score = 0;
                    return score;
                }
            } else {
                console.log(`Element with id ${ratingLink} not found.`);
                return null;
            }
        } else {
            console.error('Failed to retrieve the main page.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching the URL:', error);
        return null;
    }
};

const scrapeData = async () => {
    try {
        const response = await axios.get(url);

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            const dramas = [];
            const promises = [];

            $('.list-item').each((i, element) => {
                const drama = {};

                const imageLink = $(element).find('.list-left');
                if (imageLink.length) {
                    let imageSrc = imageLink.find('img').attr('src');
                    imageSrc = imageSrc.replace("_4t", "_4c");
                    drama.image = imageSrc;
                }

                const titleLink = $(element).find('.title');
                if (titleLink.length) {
                    drama.title = titleLink.text().trim();
                    drama.link = "https://mydramalist.com" + titleLink.attr('href');

                    const ratingLink = "ml" + getDigitsFromUrl(drama.link);
                    const ratingPromise = scrapeRating(ratingLink).then(score => {
                        drama.rating = score;

                        const activityElement = $(element).find('.activity');
                        if (activityElement.length) {
                            const activityText = activityElement.text().trim();
                            if (activityText.includes("Currently watching")) {
                                drama.activity = "Watching";
                            } else if (activityText.includes("Completed")) {
                                drama.activity = "Completed";
                            } else if (activityText.includes("Plan to watch")) {
                                drama.activity = "Plan-to-watch";
                            } else if (activityText.includes("On-hold")) {
                                drama.activity = "On-hold";
                            } else if (activityText.includes("Dropped")) {
                                drama.activity = "Dropped";
                            } else if (activityText.includes("Not interested")) {
                                drama.activity = "Not-interested";
                            } else {
                                drama.activity = activityText;
                            }
                        } else {
                            drama.activity = "No activity information available";
                        }

                        dramas.push(drama);
                    });

                    promises.push(ratingPromise);
                }
            });

            await Promise.all(promises);

            return dramas;
        } else {
            console.error('Failed to retrieve the webpage');
            return [];
        }
    } catch (error) {
        console.error('Error fetching the URL:', error);
        return [];
    }
};


router.get('/drama', async (req, res) => {
    const dramas = await scrapeData();
    res.json(dramas);
});

module.exports = router;