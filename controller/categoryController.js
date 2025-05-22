

module.exports = {

   uploadImageHandler : async (req, res) => {
    console.log(req.file)
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }

        const imageUrl = `${process.env.PUBLIC_URL}assets/uploads/${req.file.filename}`;
        return res.status(200).json({ status: true, location: imageUrl });
    } catch (err) {
        console.error('Upload Error:', err);
        return res.status(500).json({ status: false, message: 'Server error during image upload' });
    }
}

}