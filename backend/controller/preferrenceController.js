import Preferrence from "../models/preferrence.js";

export const createPreference = async( req,res) => {
    try{
        const existingPref = await Preferrence.findOne({
            user: req.user._id
        });

        if(existingPref){
            return res.status(403).json({
                success: false,
                message: "Preferrence already exists",
            });
        }

        const preferrence = await Preferrence.create({
            ...req.body,
            user: req.user._id,
        })

        return res.status(201).json({
            message: "Preferrence created successfully",
            data: preferrence
        });

    }catch(error){
        console.error("preferrence error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getMyPreference = async (req,res) => {
    try {
        const userId = req.user._id;

        const preferrence = await Preferrence.findOne({
            user: userId
        });

        if(!preferrence){
            return res.status(404).json({
                success: false,
                message: "Preferrence not found",
            });
        }

        res.status(200).json(preferrence)

    } catch (error) {
        console.error(" get preferrence error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


export const updatePreference = async(req, res) => {
    try{
        const userId = req.user._id;

        const preference = await Preferrence.findOneAndUpdate({user: userId},{$set: req.body },{new: true, runValidators: true});

        if(!preference){
            return res.status(404).json({
                success: false,
                message: "Preferrence not found",
            });
        }

         return res.status(200).json({
            message: "Preference update successfully",
            data: preference
        });

    } catch(error){
        console.error(" update preference error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const deletePreference = async(req,res) => {
    try{
        const {id} = req.params;

        const preference = await Preferrence.findByIdAndDelete(id);
        if(!preference){
            return res.status(404).json({
                success: false,
                message: "Preference not found",
            });
        }

        return res.status(200).json({
            message: "Preference deleted successfully",
        });
    }catch(error){
        console.error(" delete preference error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}