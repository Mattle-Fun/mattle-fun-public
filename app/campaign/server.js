"use server";
import dbConnect from "@/lib/dbConnect";
import { Events } from "@/models/Event";

export const getEvents = async () => {
  await dbConnect();
  try {
    return Events.find({}).sort({ startDate: -1 }).lean() || [];
  } catch (e) {
    console.log(e);
    return [];
  }
};
