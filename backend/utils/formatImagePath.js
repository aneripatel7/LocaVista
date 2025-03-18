const formatImagePath = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath; 
    return `${process.env.BACKEND_URL || "http://localhost:5000"}/${imagePath}`;
};

module.exports = formatImagePath;
