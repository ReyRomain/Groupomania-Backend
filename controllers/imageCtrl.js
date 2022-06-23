function updateImage(req, res, next) {
    try {
        const thingObject = JSON.parse(req.body.user && req.body.post);
        delete thingObject._id;
        const thing = {
            ...thingObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
        thing.save()
        res.status(201).json({ message: 'Image ajoutée.' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

module.exports = {
    updateImage
}