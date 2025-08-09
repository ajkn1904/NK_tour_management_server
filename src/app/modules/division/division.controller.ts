import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import sendResponse from "../../utils/sendResponse";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(async (req:Request, res:Response) => {
    //const result = await DivisionService.createDivision(req.body);
    const payload:IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const result = await DivisionService.createDivision(payload);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message:"Division Created Successfully!",
        data: result
    })
});


const getAllDivision = catchAsync(async (req:Request, res:Response) => {
    const query = req.query;
    const result = await DivisionService.getAllDivision(query as Record<string, string>);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message:"All Division Retrieved Successfully!",
        data: result.data,
        meta: result.meta
    })
});


const getSingleDivision = catchAsync(async (req:Request, res:Response) => {
    const result = await DivisionService.getSingleDivision(req.params.slug);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message:"Division Retrieved Successfully!",
        data: result
    })
});


const updatedDivision = catchAsync(async (req:Request, res:Response) => {

    const id = req.params.id;
    //const result = await DivisionService.updateDivision(id, req.body);
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const result = await DivisionService.updateDivision(id, payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message:"Division Updated Successfully!",
        data: result
    })
});


const deleteDivision = catchAsync(async (req:Request, res:Response) => {
    const result = await DivisionService.deleteDivision(req.params.id);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message:"Division Deleted Successfully!",
        data: result
    })
});


export const DivisionController = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updatedDivision,
    deleteDivision
}