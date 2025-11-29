const categoryKeywords = {
    "beach": ["beach", "shore", "ocean", "sea", "sandy"],
    "castles": ["castle", "fort", "palace"],
    "rooms": ["room", "studio", "suite", "apartment", "bedroom"],
    "farms": ["farm", "barn", "agri", "ranch"],
    "amazingviews": ["view", "vista", "panorama", "overlook", "scenic", "breathtaking"],
    "camping": ["camp", "tent", "campground", "rv"],
    "cabins": ["cabin", "log cabin", "cottage"],
    "amazing pools": ["pool", "private pool", "infinity", "swimming pool"],
    "iconic cities": ["city", "downtown", "skyline", "urban", "iconic", "metropolis"],
    "OMG": ["unique", "weird", "quirky", "unusual", "wow", "omg", "surprising"],
    "trending": ["trending", "popular", "hot", "featured"]
};

function normalize(text = "") {
    return String(text).toLowerCase().trim();
}

function detectCategory(listing) {
    const title = normalize(listing.title);
    const location = normalize(listing.location);
    const description = normalize(listing.description);

    // combine searchable text
    const text = `${title} ${location} ${description}`;

    // check each category's keywords — return first match
    for (const category of Object.keys(categoryKeywords)) {
        const keywords = categoryKeywords[category];
        for (const word of keywords) {
            if (text.includes(word)) {
                return category; // returns exact category key (e.g. "beach", "amazing pools")
            }
        }
    }
    // fallback
    return "trending";
}

module.exports = { detectCategory };