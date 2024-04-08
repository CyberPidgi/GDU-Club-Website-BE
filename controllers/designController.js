import Design from "../model/Design.model.js";
import Logger from "../logger/Logger.js";

export async function addDesign(req, res) {
    try {
        const {
            title,
            description,
            features,
            design,
            thumbnails,
            achievements,
            download_url,
            play_url,
            tags,
            developer_id,
            likeCount,
            shareCount
        } = req.body;

        const newDesign = new Design({
            title,
            description,
            features,
            design,
            thumbnails,
            achievements: [{
                image: achievements.image,
                title: achievements.title,
                description: achievements.description,
            }],
            download_url,
            play_url,
            tags,
            developer_id,
            likeCount,
            shareCount
        });

        const savedDesign = await newDesign.save();

        res.status(201).json({ msg: "Design added successfully", design: savedDesign });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export const getDesigns = async (req, res) => {
    try {
        const designs = await Design.find().populate('developer_id');
        //console.log(designs)

        Logger(': Response 👍 :', 'Designs retrieved successfully', req.url, req.method);
        res.status(200).json(designs);
    } catch (error) {
        Logger(': Request 🙏 :', `Error occurred while fetching designs: ${error.message}`, req.url, req.method);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



export const updateDesign = async (req, res) => {
    try {
        const { id, title, description, features, achievements, tags, developer_id } = req.body;
        const design = await Design.findById(id);
        if (design) {
            design.title = title;
            design.description = description;
            design.features = features;
            design.achievements = achievements;
            design.tags = tags;
            design.developer_id = developer_id;
            design.likeCount = likeCount;
            design.shareCount = shareCount;

            const updatedDesign = await design.save();
            res.status(200).json({ msg: "Design updated successfully", design: updatedDesign });
        } else {
            res.status(404).json({ error: "Design not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export const deleteDesign = async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (design) {
            await design.remove();
            res.status(200).json({ msg: "Design deleted successfully" });
        } else {
            res.status(404).json({ error: "Design not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export const updateDesignAssets = async (req, res) => {
    try {
        const { id, design, thumbnails, download_url, play_url } = req.body;
        const oldDesign = await Design.findById(id);
        if (!oldDesign) {
            return res.status(404).json({ error: "Design not found" });
        }
        if (design) {
            oldDesign.design = design;
        }
        if (thumbnails) {
            oldDesign.thumbnails = thumbnails;
        }
        if (download_url) {
            oldDesign.download_url = download_url;
        }
        if (play_url) {
            oldDesign.play_url = play_url;
        }
        const updatedDesign = await oldDesign.save();
        res.status(200).json({ msg: "Design assets updated successfully", design: updatedDesign });
    } catch (error) {

    }
}